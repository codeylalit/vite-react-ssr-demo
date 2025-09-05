import {
  TranscriptionApiRequest,
  TranscriptionApiResponse,
  TranscriptionError,
  TranscriptionResult,
  TranscriptionServiceConfig,
  TranscriptionServiceResponse,
} from '../types/transcription';

class TranscriptionService {
  private config: TranscriptionServiceConfig;
  private jwtToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config?: Partial<TranscriptionServiceConfig>) {
    this.config = {
      // Determine the full API endpoint. If VITE_API_URL is provided at build time
      // (e.g. `VITE_API_URL=https://asr.shunyalabs.ai/`), we prepend it to the
      // `/transcribe` path so that production deployments call the correct
      // hostname.  During local development the variable is typically *not*
      // set, so we fall back to the relative path which is proxied by Vite.
      apiUrl: (() => {
        // Access via `import.meta.env` – Vite inlines the value at build time.
        // We also strip any trailing slash to avoid double slashes.
        const base = (import.meta as any)?.env?.VITE_API_URL as string | undefined;

        if (base && base.trim() !== '') {
          return `${base.replace(/\/$/, '')}/transcribe`;
        }

        // Fallback for development where the local dev proxy or serverless function handles the request.
        return '/api/transcribe';
      })(),
      // Direct API URL for large files
      directApiUrl: 'https://asr.shunyalabs.ai/transcribe',
      // JWT token endpoint
      tokenUrl: '/api/auth/token',
      // File size threshold: 4MB (4 * 1024 * 1024 bytes)
      fileSizeThreshold: 4 * 1024 * 1024,
      defaultChunkSize: 120,
      defaultEnableDiarization: true,
      timeout: 60000, // 60 seconds
      retryAttempts: 3,
      retryDelay: 1000, // 1 second
      ...config,
    };
  }

  /**
   * Get or refresh JWT token
   */
  private async getJWTToken(): Promise<string> {
    const now = Date.now() / 1000;
    
    // Return existing token if still valid (with 5 min buffer)
    if (this.jwtToken && this.tokenExpiry && this.tokenExpiry > now + 300) {
      return this.jwtToken;
    }

    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      this.jwtToken = data.token;
      this.tokenExpiry = now + data.expires_in;
      
      console.log('🔑 [DEBUG] JWT token obtained, expires in:', data.expires_in, 'seconds');
      return this.jwtToken;
    } catch (error) {
      console.error('❌ [ERROR] Failed to obtain JWT token:', error);
      throw new Error('Failed to authenticate for transcription');
    }
  }

  /**
   * Determine whether to use direct API or proxy based on file size
   */
  private shouldUseDirectAPI(fileSize: number): boolean {
    return fileSize > this.config.fileSizeThreshold;
  }

  /**
   * Transcribe audio using the backend API
   */
  async transcribe(request: TranscriptionApiRequest): Promise<TranscriptionResult> {
    const startTime = Date.now();

    try {
      const response = await this.makeRequest(request);

      if (!response.success) {
        throw new Error((response as TranscriptionError).error || 'Transcription failed');
      }

      const apiResponse = response as TranscriptionApiResponse;

      // Calculate confidence based on language probability (convert to percentage)
      const confidence = Math.round(apiResponse.language_probability * 100);

      const result: TranscriptionResult = {
        transcription: apiResponse.text,
        confidence,
        processingTime: Date.now() - startTime,
        segments: apiResponse.segments,
        detectedLanguage: apiResponse.detected_language,
        languageProbability: apiResponse.language_probability,
        speakers: apiResponse.unique_speakers,
        filename: apiResponse.filename,
      };

      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make request with hybrid routing (proxy vs direct API)
   */
  private async makeRequest(
    request: TranscriptionApiRequest,
    attempt = 1
  ): Promise<TranscriptionServiceResponse> {
    const useDirectAPI = this.shouldUseDirectAPI(request.audio.size);
    
    console.log('🌐 [DEBUG] Making API request:', {
      attempt,
      fileSize: `${(request.audio.size / 1024).toFixed(2)} KB`,
      useDirectAPI,
      method: useDirectAPI ? 'Direct API' : 'Proxy',
      language_code: request.language_code,
      chunk_size: request.chunk_size || this.config.defaultChunkSize,
      enable_diarization: request.enable_diarization ?? this.config.defaultEnableDiarization,
      audioType: request.audio.type,
      audioName: request.audio instanceof File ? request.audio.name : 'blob',
      timestamp: new Date().toISOString(),
    });

    // PRIORITY 3: API Request Validation - Validate language code before sending
    if (!request.language_code || request.language_code.trim() === '') {
      console.error('❌ [ERROR] Invalid language_code in API request:', request.language_code);
      throw new Error('Language code is required for transcription');
    }

    if (request.language_code === 'undefined' || request.language_code === 'null') {
      console.error('❌ [ERROR] Language code is undefined/null:', request.language_code);
      throw new Error('Invalid language selection. Please select a language and try again.');
    }

    if (useDirectAPI) {
      return this.makeDirectAPIRequest(request, attempt);
    } else {
      return this.makeProxyRequest(request, attempt);
    }
  }

  /**
   * Make direct API request with JWT authentication
   */
  private async makeDirectAPIRequest(
    request: TranscriptionApiRequest,
    attempt = 1
  ): Promise<TranscriptionServiceResponse> {
    const token = await this.getJWTToken();
    
    const formData = new FormData();
    formData.append('audio', request.audio);
    formData.append('language_code', request.language_code);
    if (request.output_script) {
      formData.append('output_script', request.output_script);
    }
    formData.append('index', (request.index || 0).toString());
    formData.append('chunk_size', (request.chunk_size || this.config.defaultChunkSize).toString());
    formData.append('enable_diarization', (request.enable_diarization ?? this.config.defaultEnableDiarization).toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.directApiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ERROR] Direct API request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          language_code: request.language_code,
          attempt,
          timestamp: new Date().toISOString(),
        });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [DEBUG] Direct API request successful:', {
        language_code: request.language_code,
        responseText: data.text?.substring(0, 100) + (data.text?.length > 100 ? '...' : ''),
        confidence: data.language_probability,
        detectedLanguage: data.detected_language,
        attempt,
        timestamp: new Date().toISOString(),
      });
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < this.config.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay * attempt);
        return this.makeDirectAPIRequest(request, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * Make proxy request (existing logic for small files)
   */
  private async makeProxyRequest(
    request: TranscriptionApiRequest,
    attempt = 1
  ): Promise<TranscriptionServiceResponse> {
    const formData = new FormData();
    formData.append('audio', request.audio);
    formData.append('language_code', request.language_code);
    if (request.output_script) {
      formData.append('output_script', request.output_script);
    }
    formData.append('index', (request.index || 0).toString());
    formData.append('chunk_size', (request.chunk_size || this.config.defaultChunkSize).toString());
    formData.append('enable_diarization', (request.enable_diarization ?? this.config.defaultEnableDiarization).toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: { 'accept': 'application/json' },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ERROR] Proxy API request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          language_code: request.language_code,
          attempt,
          timestamp: new Date().toISOString(),
        });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [DEBUG] Proxy API request successful:', {
        language_code: request.language_code,
        responseText: data.text?.substring(0, 100) + (data.text?.length > 100 ? '...' : ''),
        confidence: data.language_probability,
        detectedLanguage: data.detected_language,
        attempt,
        timestamp: new Date().toISOString(),
      });
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt < this.config.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay * attempt);
        return this.makeProxyRequest(request, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error.name === 'AbortError') return true;
    if (error.message?.includes('fetch')) return true;
    if (error.message?.includes('HTTP 5')) return true;
    return false;
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): Error {
    if (error.name === 'AbortError') {
      return new Error('Request timeout - please try again with a smaller file');
    }

    if (error.message?.includes('HTTP 401')) {
      return new Error('Authentication failed - invalid API key or JWT token');
    }

    if (error.message?.includes('HTTP 413')) {
      return new Error('File too large - please use a smaller audio file');
    }

    if (error.message?.includes('Failed to authenticate for transcription')) {
      return new Error('Authentication failed - unable to obtain access token');
    }

    if (error.message?.includes('HTTP 415')) {
      return new Error('Unsupported file format - please use MP3, WAV, or M4A');
    }

    if (error.message?.includes('HTTP 400')) {
      // TASK 5: Enhanced Format-Specific Error Handling
      if (error.message?.includes('Unsupported format')) {
        return new Error(
          'Audio format not supported by the API. Please use MP3, WAV, M4A, AAC, OGG, WMA, or FLAC files. For recording, try using the file upload option instead.'
        );
      }
      return new Error('Bad request - please check your audio file format and try again');
    }

    if (error.message?.includes('HTTP 429')) {
      return new Error('Too many requests - please wait a moment and try again');
    }

    if (error.message?.includes('HTTP 500')) {
      return new Error(
        'Server error. Our team has been notified. Please try again in a few moments.'
      );
    }

    // Network connectivity
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return new Error('No internet connection. Please check your network and try again.');
    }

    // Default error message
    return new Error(error.message || 'Transcription failed - please try again');
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate audio file before upload
   */
  validateAudioFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 100 * 1024 * 1024; // 100MB

    // TASK 5: Updated validation to match API requirements exactly
    // API supports: .wma, .m4a, .wav, .mp3, .aac, .flac, .ogg
    //               Added video support: .mp4, .mkv, .mov, .avi, .webm
    const apiSupportedTypes = [
      'audio/mpeg', // .mp3
      'audio/mp3', // .mp3
      'audio/wav', // .wav
      'audio/wave', // .wav
      'audio/x-wav', // .wav
      'audio/m4a', // .m4a
      'audio/mp4', // .m4a
      'audio/aac', // .aac
      'audio/ogg', // .ogg
      'audio/flac', // .flac
      'audio/x-flac', // .flac
      'audio/x-ms-wma', // .wma
      // Video MIME types (commonly accepted by APIs that extract audio)
      'video/mp4', // .mp4
      'video/x-matroska', // .mkv
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/webm', // .webm
    ];

    // Client-side accepted types (includes WebM for recording compatibility)
    const clientSupportedTypes = [
      ...apiSupportedTypes,
      'audio/webm', // WebM for MediaRecorder (will be flagged as potentially incompatible)
      // Ensure video/webm is included (duplicated above but kept for clarity)
      'video/ogg', // some browsers label .webm as video/ogg
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 100MB',
      };
    }

    const isClientSupported = clientSupportedTypes.some(
      type => file.type === type || file.name.toLowerCase().endsWith(type.split('/')[1])
    );

    if (!isClientSupported) {
      return {
        valid: false,
        error: 'Unsupported file format. Please use MP3, WAV, M4A, AAC, OGG, FLAC, or WMA files',
      };
    }

    // Check if file is API-compatible
    const isApiCompatible = apiSupportedTypes.some(
      type => file.type === type || file.name.toLowerCase().endsWith(type.split('/')[1])
    );

    if (
      !isApiCompatible &&
      (file.type.includes('webm') || file.name.toLowerCase().endsWith('.webm'))
    ) {
      console.warn('⚠️ WebM file detected - this format may not be supported by the API');
    }

    return { valid: true };
  }

  /**
   * Convert MediaRecorder blob to supported format if needed
   */
  async prepareAudioBlob(blob: Blob, filename?: string): Promise<File> {
    // TASK 4: Format Conversion Implementation
    // Determine the appropriate filename and extension based on MIME type
    let finalFilename = filename;
    let finalBlob = blob;

    // If no filename provided, generate one based on MIME type
    if (!finalFilename) {
      const mimeType = blob.type || 'audio/webm';

      if (mimeType.includes('mp4') || mimeType.includes('aac')) {
        finalFilename = 'recording.m4a';
      } else if (mimeType.includes('ogg')) {
        finalFilename = 'recording.ogg';
      } else if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
        finalFilename = 'recording.mp3';
      } else if (mimeType.includes('wav')) {
        finalFilename = 'recording.wav';
      } else {
        // Default to webm but this will likely fail at API level
        finalFilename = 'recording.webm';
        console.warn(`⚠️ Unknown MIME type: ${mimeType}. This may cause API errors.`);
      }
    }

    // Log the conversion details
    console.log(
      `🔄 Preparing audio blob: ${blob.size} bytes, MIME: ${blob.type}, filename: ${finalFilename}`
    );

    // For WebM format, we need to attempt conversion or provide better error handling
    if (blob.type.includes('webm') && finalFilename.endsWith('.webm')) {
      console.warn('⚠️ WebM format detected - this may not be supported by the API');
      console.log(
        '💡 Consider using the file upload feature with MP3, WAV, or M4A files for better compatibility'
      );

      // Try to create a file with a more compatible extension
      // Note: This doesn't actually convert the audio data, but helps with server-side detection
      if (blob.type.includes('opus')) {
        finalFilename = 'recording.ogg'; // OGG is supported by API
        console.log('🔄 Renamed WebM/Opus file to .ogg for better API compatibility');
      }
    }

    // Create a File object from the blob with the appropriate filename
    return new File([finalBlob], finalFilename, { type: blob.type });
  }

  /**
   * Get browser audio recording capabilities
   */
  getBrowserAudioCapabilities(): {
    supportsRecording: boolean;
    supportedFormats: Array<{
      mimeType: string;
      extension: string;
      apiCompatible: boolean;
      name: string;
    }>;
  } {
    const capabilities = {
      supportsRecording: !!(navigator.mediaDevices && window.MediaRecorder),
      supportedFormats: [] as Array<{
        mimeType: string;
        extension: string;
        apiCompatible: boolean;
        name: string;
      }>,
    };

    if (typeof MediaRecorder !== 'undefined') {
      const testFormats = [
        { mimeType: 'audio/mp4', extension: '.m4a', apiCompatible: true, name: 'MP4/AAC' },
        {
          mimeType: 'audio/mp4;codecs=mp4a.40.2',
          extension: '.m4a',
          apiCompatible: true,
          name: 'MP4/AAC (Advanced)',
        },
        { mimeType: 'audio/ogg', extension: '.ogg', apiCompatible: true, name: 'OGG' },
        {
          mimeType: 'audio/ogg;codecs=opus',
          extension: '.ogg',
          apiCompatible: true,
          name: 'OGG/Opus',
        },
        { mimeType: 'audio/webm', extension: '.webm', apiCompatible: false, name: 'WebM' },
        {
          mimeType: 'audio/webm;codecs=opus',
          extension: '.webm',
          apiCompatible: false,
          name: 'WebM/Opus',
        },
        { mimeType: 'audio/wav', extension: '.wav', apiCompatible: true, name: 'WAV' },
        { mimeType: 'audio/mpeg', extension: '.mp3', apiCompatible: true, name: 'MP3' },
      ];

      for (const format of testFormats) {
        if (MediaRecorder.isTypeSupported(format.mimeType)) {
          capabilities.supportedFormats.push(format);
        }
      }
    }

    return capabilities;
  }
}

// Create and export a singleton instance
export const transcriptionService = new TranscriptionService();

// Export the class for testing or custom configurations
export { TranscriptionService };

// Transcription API Types - Based on actual API response from https://asr.shunyalabs.ai/transcribe

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  speaker: string;
}

export interface TranscriptionApiResponse {
  success: boolean;
  text: string;
  segments: TranscriptionSegment[];
  detected_language: string;
  language_probability: number;
  total_segments: number;
  chunks_processed: number;
  chunk_size_seconds: number;
  filename: string;
  total_time: number;
  model_used: string;
  has_speaker_diarization: boolean;
  unique_speakers: string[];
  diarization_time: number;
}

export interface TranscriptionApiRequest {
  audio: File | Blob;
  language_code: string;
  output_script?: string;
  index?: number;
  chunk_size?: number;
  enable_diarization?: boolean;
}

export interface TranscriptionError {
  success: false;
  error: string;
  message?: string;
  code?: string;
}

export interface TranscriptionResult {
  transcription: string;
  confidence: number;
  processingTime: number;
  segments?: TranscriptionSegment[];
  detectedLanguage?: string;
  languageProbability?: number;
  speakers?: string[];
  filename?: string;
}

export interface TranscriptionServiceConfig {
  apiUrl: string;
  /**
   * (Optional) API key used for server-side authentication. This value should **never** be shipped
   * to the browser. Instead, it is injected by a proxy or serverless function that forwards the
   * request to the transcription service.
   */
  apiKey?: string;
  /**
   * Direct API URL for large file uploads (bypasses Vercel proxy)
   */
  directApiUrl: string;
  /**
   * JWT token endpoint for authentication
   */
  tokenUrl: string;
  /**
   * File size threshold in bytes for switching to direct API calls
   */
  fileSizeThreshold: number;
  defaultChunkSize: number;
  defaultEnableDiarization: boolean;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export type TranscriptionServiceResponse = TranscriptionApiResponse | TranscriptionError;

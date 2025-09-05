/**
 * PCM Recorder AudioWorklet Processor
 * Downsamples from 48kHz stereo to 16kHz mono PCM
 * Sends frames every 50ms for low-latency streaming
 */

class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    
    this.sampleRate = globalThis.sampleRate || 48000;
    this.channelCount = 1; // we'll convert to mono
    this.targetSampleRate = 16000;
    this.frameDurationMs = 50; // configurable frame duration
    this.downsampleRatio = this.sampleRate / this.targetSampleRate;
    this.frameSize = Math.floor((this.targetSampleRate * this.frameDurationMs) / 1000);
    
    // Buffer for accumulating downsampled samples
    this.buffer = new Float32Array(this.frameSize);
    this.bufferIndex = 0;
    this.sequenceNumber = 0;
    this.downsampleBuffer = new Float32Array(Math.ceil(this.downsampleRatio * 2)); // extra space for overlap
    this.downsampleIndex = 0;
    
    // Simple low-pass filter for anti-aliasing
    this.filterState = 0;
    this.filterAlpha = 0.1;
    
    console.log(`PCMRecorderProcessor initialized: ${this.sampleRate}Hz -> ${this.targetSampleRate}Hz, frame=${this.frameSize} samples`);
    
    // Listen for parameter updates
    this.port.onmessage = (event) => {
      if (event.data.type === 'updateParams') {
        this.frameDurationMs = event.data.frameDurationMs || this.frameDurationMs;
        this.frameSize = Math.floor((this.targetSampleRate * this.frameDurationMs) / 1000);
        this.buffer = new Float32Array(this.frameSize);
        this.bufferIndex = 0;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (!input || input.length === 0) {
      return true; // Keep processor alive
    }
    
    // Convert stereo to mono by averaging channels
    const monoInput = this.convertToMono(input);
    
    // Downsample to target rate
    const downsampledData = this.downsample(monoInput);
    
    // Accumulate samples into frames
    for (let i = 0; i < downsampledData.length; i++) {
      this.buffer[this.bufferIndex++] = downsampledData[i];
      
      // When frame is full, send it
      if (this.bufferIndex >= this.frameSize) {
        this.sendFrame();
        this.bufferIndex = 0;
      }
    }
    
    return true; // Keep processor alive
  }
  
  convertToMono(input) {
    const channelCount = input.length;
    const frameLength = input[0].length;
    const monoData = new Float32Array(frameLength);
    
    if (channelCount === 1) {
      // Already mono
      return input[0];
    }
    
    // Average all channels
    for (let i = 0; i < frameLength; i++) {
      let sum = 0;
      for (let ch = 0; ch < channelCount; ch++) {
        sum += input[ch][i];
      }
      monoData[i] = sum / channelCount;
    }
    
    return monoData;
  }
  
  downsample(input) {
    const outputLength = Math.floor(input.length / this.downsampleRatio);
    const output = new Float32Array(outputLength);
    
    for (let i = 0; i < outputLength; i++) {
      const sourceIndex = i * this.downsampleRatio;
      const sourceIndexFloor = Math.floor(sourceIndex);
      const sourceIndexCeil = Math.min(sourceIndexFloor + 1, input.length - 1);
      const fraction = sourceIndex - sourceIndexFloor;
      
      // Linear interpolation
      const sample = input[sourceIndexFloor] * (1 - fraction) + input[sourceIndexCeil] * fraction;
      
      // Simple low-pass filter to reduce aliasing
      this.filterState = this.filterState * (1 - this.filterAlpha) + sample * this.filterAlpha;
      output[i] = this.filterState;
    }
    
    return output;
  }
  
  sendFrame() {
    // Convert float32 to int16 PCM
    const pcmData = new Int16Array(this.frameSize);
    for (let i = 0; i < this.frameSize; i++) {
      // Clamp to [-1, 1] and convert to 16-bit
      const sample = Math.max(-1, Math.min(1, this.buffer[i]));
      pcmData[i] = Math.round(sample * 32767);
    }
    
    const frame = {
      seq: this.sequenceNumber++,
      timestamp: globalThis.performance?.now() || Date.now(),
      pcm: pcmData
    };
    
    this.port.postMessage(frame);
  }
}

registerProcessor('pcm-recorder', PCMRecorderProcessor); 
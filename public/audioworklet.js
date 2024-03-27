class MyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.sampleBuffer = new Float32Array(0);
        this.lastPlayedSample = 0;
        this.port.onmessage = (e) => {
          let mergedBuffer = new Float32Array(this.sampleBuffer.length + e.data.samples.length);
          mergedBuffer.set(this.sampleBuffer);
          mergedBuffer.set(e.data.samples, this.sampleBuffer.length);
          this.sampleBuffer = mergedBuffer;
        }
    }
    process (inputs, outputs, parameters) {
       const output = outputs[0]
       const desired_length = output[0].length;
       if (desired_length <= this.sampleBuffer.length) {
         output.forEach(channel => {
           for (let i = 0; i < channel.length; i++) {
             channel[i] = this.sampleBuffer[i];
           }
         })
         // Set the new last played sample, this will be our hold value if we have an underrun
         this.lastPlayedSample = this.sampleBuffer[desired_length - 1];
         // Remove those contents from the buffer
         this.sampleBuffer = this.sampleBuffer.slice(desired_length);
      } else {
        // Queue up nothing! Specifically, *repeat* the last sample, to hold the level; this won't
        // avoid a break in the audio, but it avoids ugly pops
        output.forEach(channel => {
          for (let i = 0; i < channel.length; i++) {
            channel[i] = (this.lastPlayedSample);
          }
        })
      }
       return true
    }
}

registerProcessor("audioworklet", MyAudioProcessor);

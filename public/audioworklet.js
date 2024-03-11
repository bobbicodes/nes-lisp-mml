class MyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.sampleBuffer = new Float32Array(0);
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
       output.forEach(channel => {
         for (let i = 0; i < channel.length; i++) {
           channel[i] = this.sampleBuffer[i];
         }
       })
       this.sampleBuffer = this.sampleBuffer.slice(desired_length);
       return true
    }
}

registerProcessor("audioworklet", MyAudioProcessor);

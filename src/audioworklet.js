class MyAudioProcessor extends AudioWorkletProcessor {

  inputReadPos = 0;
  inputBufferPos = 0;
  

  constructor(options) {
    super(options);
    this.buffer = options.processorOptions.buffer;
  }


  process(inputList, outputList, parameters) {
    if (this.inputReadPos + 2048 > this.inputBufferPos) {
      this.inputReadPos = this.inputBufferPos - 2048;
    }
    if (this.inputReadPos + 4096 < this.inputBufferPos) {
      this.inputReadPos += 2048;
    }
    let output = outputList[0][0]
    for (let i = 0; i < 2048; i++) {
      output[i] = this.buffer[(this.inputReadPos++) & 0xfff];
    }
    return true;
  }
}

registerProcessor("audioworklet", MyAudioProcessor);

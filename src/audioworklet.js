let inputReadPos = 0;
let inputBufferPos = 0;

class MyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
    }
  
    process(inputList, outputList, parameters) {
        console.log("This is running in audio worklet")
        if (inputReadPos + 2048 > inputBufferPos) {
            inputReadPos = inputBufferPos - 2048;
        }
        if (inputReadPos + 4096 < inputBufferPos) {
            inputReadPos += 2048;
        }
        let output = outputList[0]
        for (let i = 0; i < 2048; i++) {
            output[i] = inputList[0][(inputReadPos++) & 0xfff];
        }
      return true;
    }
  }
  
  registerProcessor("audioworklet", MyAudioProcessor);

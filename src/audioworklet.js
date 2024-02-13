let inputReadPos = 0;
let inputBufferPos = 0;
export let inputBuffer = new Float32Array(4096);

class MyAudioProcessor extends AudioWorkletProcessor {

    bufferSize = 4096
    _bytesWritten = 0
    _buffer = new Float32Array(this.bufferSize)

    constructor() {
        super();
        this.initBuffer()
    }

    initBuffer() {
        this._bytesWritten = 0
    }

    isBufferEmpty() {
        return this._bytesWritten === 0
    }

    isBufferFull() {
        return this._bytesWritten === this.bufferSize
    }

    process(inputList, outputList, parameters) {
        this.append(inputList[0][0])
        return true;
    }

    append(channelData) {
        if (this.isBufferFull()) {
          this.flush()
        }
    
        if (!channelData) return
    
        for (let i = 0; i < channelData.length; i++) {
          this._buffer[this._bytesWritten++] = channelData[i]
        }
      }


    flush() {
        // trim the buffer if ended prematurely
        this.port.postMessage(
          this._bytesWritten < this.bufferSize
            ? this._buffer.slice(0, this._bytesWritten)
            : this._buffer
        )
        this.initBuffer()
      }


}

registerProcessor("audioworklet", MyAudioProcessor);

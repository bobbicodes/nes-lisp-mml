let inputReadPos = 0;
let inputBufferPos = 0;
let inputBuffer = new Float64Array(4096);

function process(e) {
    if (inputReadPos + 2048 > inputBufferPos) {
        inputReadPos = inputBufferPos - 2048;
    }
    if (inputReadPos + 4096 < inputBufferPos) {
        inputReadPos += 2048;
    }
    let output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < 2048; i++) {
        output[i] = inputBuffer[(inputReadPos++) & 0xfff];
    }
}

export function AudioHandler() {

    let Ac = window.AudioContext || window.webkitAudioContext;
    this.actx = new Ac();

    this.samplesPerFrame = this.actx.sampleRate / 60;
    this.sampleBuffer = new Float64Array(this.samplesPerFrame);

    this.scriptNode = undefined;
    this.sourceNode = undefined;

    this.resume = function () {
        this.actx.resume();
    }

    this.start = function () {
        this.sourceNode = this.actx.createBufferSource();
        this.sourceNode.buffer = this.actx.createBuffer(1, 44100, 44100);
        this.sourceNode.loop = true;

        this.scriptNode = this.actx.createScriptProcessor(2048, 1, 1);
        this.scriptNode.onaudioprocess = function (e) {
            process(e);
        }

        this.biquadFilter = this.actx.createBiquadFilter();
        this.biquadFilter.type = "highpass";
        this.biquadFilter.frequency.setValueAtTime(37, this.actx.currentTime);
        this.sourceNode.connect(this.scriptNode);
        this.scriptNode.connect(this.biquadFilter);
        this.biquadFilter.connect(this.actx.destination);
        this.sourceNode.start();
    }

    this.stop = function () {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode = undefined;
        }
        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = undefined;
        }
        inputBufferPos = 0;
        inputReadPos = 0;
    }

    this.nextBuffer = function () {
        for (let i = 0; i < this.samplesPerFrame; i++) {
            let val = this.sampleBuffer[i];
            inputBuffer[(inputBufferPos++) & 0xfff] = val;
        }
    }
}

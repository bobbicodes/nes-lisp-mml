export let sq1Stream = []
export let sq2Stream = []
export let triStream = []
export let noiseStream = []

export function setSq1Stream(notes) {
    sq1Stream = notes
}

export function setSq2Stream(notes) {
    sq2Stream = notes
}

export function setTriStream(notes) {
    triStream = notes
}

export function setNoiseStream(notes) {
    noiseStream = notes
}

const noteLengths = [
    [1.5, 0x8A],     // dotted whole
    [1, 0x85],       // whole
    [0.75, 0x89],    // dotted half
    [0.5, 0x84],     // half
    [0.375, 0x88],   // dotted quarter
    [0.25, 0x83],    // quarter
    [0.1875, 0x87],  // dotted eighth
    [0.125, 0x82],   // eighth
    [0.09375, 0x86], // dotted sixteenth
    [0.0625, 0x81],  // sixteenth
    [0.03125, 0x80]  // thirtysecond
]

// find largest note length that will fit without going over
function largestNote(delta) {
    let l
    for (let i = noteLengths.length-1; i >= 0; i--) {
        if (delta > noteLengths[i][0]) {
            l = noteLengths[i]
        }
    }
    return l
}

export function assembleStream(notes) {
    const sorted = notes.sort((a, b) => a.get("ʞtime") - b.get("ʞtime"))
    let stream = []
    let currentTime = 0
    let currentLength
    for (let i = 0; i < sorted.length; i++) {
        let t = sorted[i].get("ʞtime")
        let l = sorted[i].get("ʞlength")
        let noteLen = largestNote((t+l) - currentTime)
        // is there a rest before next note?
        if (currentTime < t) {
            stream.push(noteLen[1])
            stream.push(0x5e)
            currentTime = t + l
            currentLength = noteLen[0]
        } else {
            stream.push(noteLen[1])
            // Note A1 is our 0x00 which is MIDI number 33
            stream.push(sorted[i].get("ʞpitch") - 33)
            currentTime = t + l
            currentLength = noteLen[0]
        }
    }
    return stream
}

// Linear feedback shift register for noise channel
// https://www.nesdev.org/wiki/APU_Noise
export var x = 1
export function feedback(x) {
    var f = (x & 1) ^ (x >> 1 & 1)
    x = (f << 14) | (x >> 1)
    return x
}

// variable duty cycle, see https://www.nesdev.org/wiki/APU_Pulse
export const pulse0 = [-1, -1, -1, -1, -1, -1, -1, 1]
export const pulse1 = [-1, -1, -1, -1, -1, -1, 1, 1]
export const pulse2 = [-1, -1, -1, -1, 1, 1, 1, 1]
export const pulse3 = [1, 1, 1, 1, 1, 1, -1, -1]

export function channelData(buffer, channel) {
    return buffer.getChannelData(channel)
}

export function pulse0_seq(notes) {
    return pulse(notes, pulse0)
}

export function pulse1_seq(notes) {
    return pulse(notes, pulse1)
}

export function pulse2_seq(notes) {
    return pulse(notes, pulse2)
}

export function pulse3_seq(notes) {
    return pulse(notes, pulse3)
}

export function midiToFreq(n) {
    return 440 * Math.pow(2, (n - 69) / 12)
}

export function make_download(name, abuffer) {
    var new_file = URL.createObjectURL(bufferToWave(abuffer, abuffer.length));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", new_file);
    downloadAnchorNode.setAttribute("download", name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;
    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }
    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}


export function mix(buffers) {
    // make new buffer the length of longest buffer
    const len = Math.max(...buffers.map(buf => buf.length))
    const data = [...buffers.map(buf => buf.getChannelData(0))]
    let buf = []
    for (let i = 0; i < len; i++) {
        // loop through index of each buffer and add them up
        let amplitude = 0
        for (let j = 0; j < data.length; j++) {
            if (data[j].length >= i) {
                amplitude += data[j][i]
            }
        }
        buf.push(amplitude)
    }
    return audioBuffer(buf)
}
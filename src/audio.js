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

function freqToPeriod(freq) {
    const c = 1789773;
    return c / (freq * 16) - 1
}

function midiToFreq(n) {
    return 440 * (Math.pow(2, ((n-69) / 12)))
}

function fmtWord(n) {
  n = Math.round(n)
  const pad = String(n.toString(16)).padStart(4, '0');
  return [parseInt(pad.slice(2), 16),
          parseInt(pad.slice(0, 2), 16)];
}

export let songLength = 0

export function resetSongLength() {
  songLength = 0
}

export function assembleStream(notes) {
    let stream = []
    let currentLength = 0
    let totalLength = 0
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞlength")) {
          stream.push(notes[i].get("ʞlength"))
          currentLength = notes[i].get("ʞlength") - 0x80
        }
        if (notes[i].has("ʞvolume")) {
          stream.push(notes[i].get("ʞvolume"))  
        }
        if (notes[i].has("ʞduty")) {
          stream.push(notes[i].get("ʞduty"))  
        }
        if (notes[i].has("ʞpitch")) {
             const freq = midiToFreq(notes[i].get("ʞpitch"))
             const period = freqToPeriod(freq)
             const word = fmtWord(period)
             stream.push(word[1])
             stream.push(word[0])
             totalLength += currentLength
        }
    }
    stream.push(0xFF)
    if (totalLength > songLength) {songLength = totalLength}
    return stream
}

export function assembleNoise(notes) {
    let stream = []
    let currentLength = 0
    let totalLength = 0
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].has("ʞlength")) {
          stream.push(notes[i].get("ʞlength"))
          currentLength = notes[i].get("ʞlength") - 0x80
        }
        if (notes[i].has("ʞvolume")) {
          stream.push(notes[i].get("ʞvolume"))  
        }
        if (notes[i].has("ʞduty")) {
          stream.push(notes[i].get("ʞduty"))  
        }
        if (notes[i].has("ʞpitch")) {
             stream.push(notes[i].get("ʞpitch"))
             totalLength += currentLength
        }
    }
    stream.push(0xFF)
    if (totalLength > songLength) {songLength = totalLength}
    return stream
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
    var numOfChan = 1,
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
    setUint32(48000);
    setUint32(48000 * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < 1; i++)
        channels.push(abuffer);

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

export function dpcm_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const lastNoteLength = lastNote.get("ʞbuffer").getChannelData(0).length
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNoteLength)
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        // set duration to sample length by default
        let duration = notes[i].get("ʞbuffer").getChannelData(0).length
        // change duration if note length is given
        if (notes[i].get("ʞlength")) {
            duration = notes[i].get("ʞlength") * ctx.sampleRate
        }
        // loop through the appropriate samples for that note
        for (let j = 0; j < duration; j++) {
            buf[start + j] = notes[i].get("ʞbuffer").getChannelData(0)[j]
        }
    }
    return audioBuffer(buf)
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

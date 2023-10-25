export const ctx = new AudioContext();


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

export function audioBuffer(vals) {
    const buffer = new AudioBuffer({
        length: vals.length,
        sampleRate: ctx.sampleRate,
    });
    const data = buffer.getChannelData(0);
    for (let i = 0; i < vals.length; i++) {
        data[i] = vals[i]
    }
    return buffer
}

export function channelData(buffer, channel) {
    return buffer.getChannelData(channel)
}

export function playBuffer(buffer, time) {
    ctx.resume()
    const noise = new AudioBufferSourceNode(ctx, {
        buffer: buffer,
    });
    noise.connect(ctx.destination);
    noise.start(ctx.currentTime + time || 0);
}

export function triangleWave(time, period) {
    const f = Math.floor((time / period) + (1 / 2))
    const a = Math.abs(2 * (time / period - f))
    return (2 * a) - 1
}

export function quantizeTri(sample) {
    let vals = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0, -0.125, -0.25, -0.375, -0.5, -0.625, -0.75, -0.875, -1, 0.875, 1]
    while (vals.length != 0) {
        if ((Math.abs(vals[0] - sample)) < 0.15) {
            return vals[0]
        } else {
            vals = vals.slice(1)
        }
    }
}

export function tri(note, dur) {
    const freq = midiToFreq(note)
    let buf = []
    for (let i = 0; i < ctx.sampleRate * dur; i++) {
        var q = 0.8 * quantizeTri(triangleWave(1 / ctx.sampleRate * i, 1 / freq))
        if (i < 150) {
            buf.push(q / (500 / i))
        } else if (i > (ctx.sampleRate * dur) - 200) {
            buf.push(q / (500 / (ctx.sampleRate * dur - i)))
        } else {
            buf.push(q)
        }
    }
    return audioBuffer(buf)
}

export function tri_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.6 * quantizeTri(triangleWave(1 / ctx.sampleRate * j, 1 / freq))
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start + j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start + j] = amplitude / (500 / (duration - j))
            } else {
                buf[start + j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

export function drum_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        const duration = Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate)
        for (let j = 0; j < duration; j++) {
            x = feedback(x)
            var multiplier = 1 - (j * (1 / duration))
            buf[start + j] = multiplier * (0.25 * x / 32767 * 2 - 0.25)
        }
    }
    return audioBuffer(buf)
}

export function _noise(note, dur) {
    var bufferSize = ctx.sampleRate * dur;
    var noise = []
    for (let i = 0; i < bufferSize; i++) {
        x = feedback(x)
        noise.push(0.4 * x / 32767 * 2 - 1)
    }
    return audioBuffer(noise)
}

export function fade(buf) {
    var data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
        var multiplier = 1 - (i * (1 / data.length))
        data[i] = data[i] * multiplier
    }
    return audioBuffer(data)
}

export function _pulse0(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse0[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

export function pulse0_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            var amplitude
            if (notes[i].has("ʞvibrato")) {
                const speed = notes[i].get("ʞvibrato").get("ʞspeed")
                const depth = notes[i].get("ʞvibrato").get("ʞdepth")
                amplitude = 0.1 * pulse0[
                    Math.floor(j / (1 / ((freq + (Math.sin(j * (0.0001 * speed)) / (10 / depth)))
                        / (ctx.sampleRate / 8)))) % 8
                ]
            } else {
                amplitude = 0.1 * pulse0[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            }
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start + j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start + j] = amplitude / (500 / (duration - j))
            } else {
                buf[start + j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

export function _pulse1(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse1[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

export function pulse1_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.1 * pulse1[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start + j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start + j] = amplitude / (500 / (duration - j))
            } else {
                buf[start + j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

export function _pulse2(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse2[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

export function pulse2_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.1 * pulse2[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start + j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start + j] = amplitude / (500 / (duration - j))
            } else {
                buf[start + j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

export function _pulse3(note, dur) {
    const freq = midiToFreq(note)
    var bufferSize = ctx.sampleRate * dur;
    var buf = []
    for (let i = 0; i < bufferSize; i++) {
        buf.push(0.1 * pulse3[Math.floor(i / (1 / (freq / (ctx.sampleRate / 8)))) % 8])
    }
    return audioBuffer(buf)
}

export function pulse3_seq(notes) {
    const lastNote = notes.reduce(
        (prev, current) => {
            return prev.get("ʞtime") > current.get("ʞtime") ? prev : current
        }
    );
    const bufferLength = Math.ceil(ctx.sampleRate * lastNote.get("ʞtime") + lastNote.get("ʞlength"))
    // initialize buffer of proper length filled with zeros
    let buf = Array(bufferLength).fill(0)
    // loop through notes
    for (let i = 0; i < notes.length; i++) {
        // loop through the note's samples
        const start = Math.floor(notes[i].get("ʞtime") * ctx.sampleRate)
        for (let j = 0; j < Math.ceil(notes[i].get("ʞlength") * ctx.sampleRate); j++) {
            const freq = midiToFreq(notes[i].get("ʞpitch"))
            const amplitude = 0.1 * pulse3[Math.floor(j / (1 / (freq / (ctx.sampleRate / 8)))) % 8]
            const duration = ctx.sampleRate * notes[i].get("ʞlength")
            if (j < 150) {
                buf[start + j] = amplitude / (500 / j)
            } else if (j > duration - 200) {
                buf[start + j] = amplitude / (500 / (duration - j))
            } else {
                buf[start + j] = amplitude
            }
        }
    }
    return audioBuffer(buf)
}

function addSemitone(rate) {
    return rate * Math.pow(2, 1 / 12)
}

function subSemitone(rate) {
    return rate * Math.pow(2, -1 / 12)
}

function incRate(semis) {
    return Array(semis).fill(1).reduce(addSemitone)
}

function decRate(semis) {
    return Array(semis).fill(1).reduce(subSemitone)
}

export function pitchToRate(midiNum) {
    if (midiNum > 66) {
        return incRate(midiNum - 66)
    } else {
        return decRate(68 - midiNum)
    }
}

export function midiToFreq(n) {
    return 440 * Math.pow(2, (n - 69) / 12)
}

export function playBufferAt(buffer, pitch, time) {
    ctx.resume()
    const buf = new AudioBufferSourceNode(ctx, {
        buffer: buffer,
    });
    buf.playbackRate.setValueAtTime(pitchToRate(pitch), ctx.currentTime)
    buf.connect(ctx.destination);
    buf.start(time);
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
    console.log("calling bufferToWave")
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
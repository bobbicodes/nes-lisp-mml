let banked
let origBanks
let loadAdr
let banks = new Uint8Array(8);
let data
let romData
let maxBanks = 1;

let prgRam = new Uint8Array(0x2000);

export function set_data(nsf) {
    data = nsf
}

export function set_loadAdr(adr) {
    loadAdr = adr
}

export function set_banked(bool) {
    banked = bool
}

export function set_banks(initBanks) {
    banks = initBanks
    origBanks = initBanks
}

function log(text) {
    el("log").innerHTML += text + "<br>";
    el("log").scrollTop = el("log").scrollHeight;
}

function el(id) {
    return document.getElementById(id);
}

function getWordRep(val) {
    return ("000" + val.toString(16)).slice(-4).toUpperCase();
}

export function reset() {
    for (let i = 0; i < prgRam.length; i++) {
        prgRam[i] = 0;
    }
    for (let i = 0; i < 8; i++) {
        banks[i] = origBanks[i];
    }
    if (banked) {
        loadAdr &= 0xfff;
        let totalData = (data.length - 0x80) + loadAdr;
        maxBanks = Math.ceil(totalData / 0x1000);
        romData = new Uint8Array(maxBanks * 0x1000);
        // fill the romdata
        for (let i = loadAdr; i < romData.length; i++) {
            if (0x80 + (i - loadAdr) >= data.length) {
                // we reached the end of the file
                break;
            }
            romData[i] = data[0x80 + (i - loadAdr)];
        }
    } else {
        romData = new Uint8Array(0x8000);
        // fill the romdata
        for (let i = loadAdr; i < 0x10000; i++) {
            if (0x80 + (i - loadAdr) >= data.length) {
                // we reached the end of the file
                break;
            }
            romData[i - 0x8000] = data[0x80 + (i - loadAdr)];
        }
    }
}

export function read(adr) {
    if (adr < 0x6000) {
        return 0;
    }
    if (adr < 0x8000) {
        return prgRam[adr & 0x1fff];
    }
    if (banked) {
        let bankNum = (adr >> 12) - 8;
        return romData[banks[bankNum] * 0x1000 + (adr & 0xfff)];
    } else {
        return romData[adr & 0x7fff];
    }
}

export function write(adr, val) {
    if (adr < 0x5ff8) {
        return;
    }
    if (adr < 0x6000) {
        banks[adr - 0x5ff8] = val % maxBanks;
        return;
    }
    if (adr < 0x8000) {
        prgRam[adr & 0x1fff] = val;
        return;
    }
    // rom not writable
    return;
}
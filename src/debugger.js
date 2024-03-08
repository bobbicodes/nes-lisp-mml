import * as cpu from "./cpu";
import * as apu from "./apu";
import * as mapper from "./nsfmapper";
import { ram } from "../main";

function el(id) {
    return document.getElementById(id);
}

function getWordRep(val) {
    return ("000" + val.toString(16)).slice(-4).toUpperCase();
}

function getByteRep(val) {
    if (val) {
        return ("0" + val.toString(16)).slice(-2).toUpperCase();
    } else {
        return "00"
    }
}

export function updateDebugView() {
    drawRam();
}

function drawRam() {
    let ev = el("memory");
    ev.textContent = "";
    let ramBasePos = 0x1000
    let reg = 0
    for (let r = ramBasePos; r < ramBasePos + 0x5; r++) {
        let str = `${getWordRep(r * 4)}: `;
        for (let c = 0; c < 4; c++) {
            str += `${getByteRep(apu.registers[reg])} `;
            reg++
        }
        ev.textContent += str + "\n";
    }
}

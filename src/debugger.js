import * as cpu from "./cpu";
import * as apu from "./apu";
import * as mapper from "./nsfmapper";
import { ramCdl, romCdl } from "../main";

function el(id) {
    return document.getElementById(id);
}

function getRomAdr(adr) {
    return adr & 0x3fff;
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
    drawDissasembly();
}

let disScroll = 0;
let ramScroll = 0;
const opLengths = [1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 0, 3, 2, 2, 3, 3];

const opNames = [
    "brk", "ora", "kil", "slo", "nop", "ora", "asl", "slo", "php", "ora", "asl", "anc", "nop", "ora", "asl", "slo", //0x
    "bpl", "ora", "kil", "slo", "nop", "ora", "asl", "slo", "clc", "ora", "nop", "slo", "nop", "ora", "asl", "slo", //1x
    "jsr", "and", "kil", "rla", "bit", "and", "rol", "rla", "plp", "and", "rol", "anc", "bit", "and", "rol", "rla", //2x
    "bmi", "and", "kil", "rla", "nop", "and", "rol", "rla", "sec", "and", "nop", "rla", "nop", "and", "rol", "rla", //3x
    "rti", "eor", "kil", "sre", "nop", "eor", "lsr", "sre", "pha", "eor", "lsr", "alr", "jmp", "eor", "lsr", "sre", //4x
    "bvc", "eor", "kil", "sre", "nop", "eor", "lsr", "sre", "cli", "eor", "nop", "sre", "nop", "eor", "lsr", "sre", //5x
    "rts", "adc", "kil", "rra", "nop", "adc", "ror", "rra", "pla", "adc", "ror", "arr", "jmp", "adc", "ror", "rra", //6x
    "bvs", "adc", "kil", "rra", "nop", "adc", "ror", "rra", "sei", "adc", "nop", "rra", "nop", "adc", "ror", "rra", //7x
    "nop", "sta", "nop", "sax", "sty", "sta", "stx", "sax", "dey", "nop", "txa", "uni", "sty", "sta", "stx", "sax", //8x
    "bcc", "sta", "kil", "uni", "sty", "sta", "stx", "sax", "tya", "sta", "txs", "uni", "uni", "sta", "uni", "uni", //9x
    "ldy", "lda", "ldx", "lax", "ldy", "lda", "ldx", "lax", "tay", "lda", "tax", "uni", "ldy", "lda", "ldx", "lax", //ax
    "bcs", "lda", "kil", "lax", "ldy", "lda", "ldx", "lax", "clv", "lda", "tsx", "uni", "ldy", "lda", "ldx", "lax", //bx
    "cpy", "cmp", "nop", "dcp", "cpy", "cmp", "dec", "dcp", "iny", "cmp", "dex", "axs", "cpy", "cmp", "dec", "dcp", //cx
    "bne", "cmp", "kil", "dcp", "nop", "cmp", "dec", "dcp", "cld", "cmp", "nop", "dcp", "nop", "cmp", "dec", "dcp", //dx
    "cpx", "sbc", "nop", "isc", "cpx", "sbc", "inc", "isc", "inx", "sbc", "nop", "sbc", "cpx", "sbc", "inc", "isc", //ex
    "beq", "sbc", "kil", "isc", "nop", "sbc", "inc", "isc", "sed", "sbc", "nop", "isc", "nop", "sbc", "inc", "isc", //fx
];

function peek(adr) {
    adr &= 0xffff;
    if (adr < 0x2000) {
        // ram
        return ram[adr & 0x7ff];
    }
    if (adr < 0x4020) {
        return apu.peek(adr);
    }
    return mapper.read(adr);
}

function instrStr(adr) {
    let pc = adr;
    let opcode = peek(pc);
    let i1 = peek((pc + 1) & 0xffff);
    let i2 = i1 | (peek((pc + 2) & 0xffff) << 8);
    let adrMode = cpu.addressingModes[opcode];
    let opName = opNames[opcode];
    let relVal = i1 > 0x7f ? i1 - 0x100 : i1;
    relVal += pc + 2;
    switch (adrMode) {
        case 0: return `${opName}`;
        case 1: return `${opName} #$${getByteRep(i1)}`;
        case 2: return `${opName} $${getByteRep(i1)}`;
        case 3: return `${opName} $${getByteRep(i1)},x`;
        case 4: return `${opName} $${getByteRep(i1)},y`;
        case 5: return `${opName} ($${getByteRep(i1)},x)`;
        case 6: return `${opName} ($${getByteRep(i1)}),y`;
        case 7: return `${opName} $${getWordRep(i2)}`;
        case 8: return `${opName} $${getWordRep(i2)},x`;
        case 9: return `${opName} $${getWordRep(i2)},y`;
        case 10: return `?`; // apparently this ended up being skipped?
        case 11: return `${opName} ($${getWordRep(i2)})`;
        case 12: return `${opName} $${getWordRep(relVal)}`;
        case 13: return `${opName} ($${getByteRep(i1)}),y`;
        case 14: return `${opName} $${getWordRep(i2)},x`;
        case 15: return `${opName} $${getWordRep(i2)},y`;
    }
}

function drawDissasembly() {
    let ev = el("disassembly");
    ev.textContent = "";
    let adr = disScroll;
    let lines = 0;
    let firstData = true;
    while (adr < 0x10000) {
        let op = peek(adr);
        let length = opLengths[cpu.addressingModes[op]];
        let isOpcode;
        if (adr < 0x8000) {
            isOpcode = ramCdl[adr];
        } else {
            let prgAdr = getRomAdr(adr);
            isOpcode = romCdl[prgAdr];
        }
        let pcP = adr === cpu.br[0] ? ">" : " ";
        if (isOpcode) {
            ev.textContent += `${pcP} ${getWordRep(adr)}: ${instrStr(adr)}\n`;
            adr += length;
            firstData = true;
            lines++;
        } else {
             ev.textContent += `${pcP} ${getWordRep(adr)}: .db $${getByteRep(op)}\n`;
             adr++;
            if (firstData) {
                ev.textContent += `  ${getWordRep(adr)}: -- UNIDENTIFIED BLOCK --\n`;
                firstData = false;
                lines++;
            }
            adr++;
        }
        if (lines === 32) {
            break;
        }
    }
    for (let i = lines; i < 32; i++) {
        ev.textContent += "\n";
    }
}

function drawRam() {
    let ev = el("ram");
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
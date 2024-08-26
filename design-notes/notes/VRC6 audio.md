- So, I guess the first thing would be how do we even play it? Implementing it in the player seems like a logical first step.
- ## NSF player support
- From the wiki:
- Uses registers $9000-9003, $A000-A002, and $B000-B002, write only.
- These are pulse 1, pulse 2 and saw.
- $x000 is volume, and duty for the pulses.
- $x001 is period low
- $x002 is period high
- $x003 is listed as frequency scaling... but it doesn't show on famistudio's register viewer, so I'm not sure if it's relevant.
- ## Added register write stubs to APU
- So now our APU can write to the VRC6 registers. How this fits into everything else... will take some learning since I didn't actually write this APU, but I picked it because it's very well written. Therefore, I think I can piece it together by looking at the other channels and reading their wiki pages.
- For example, here is the write function for $4000, pulse 1:
- ```js
          case 0x4000: {
              // DDlc.vvvv
              // Pulse 1 Duty cycle, length counter halt,
              // constant volume/envelope flag,
              // volume/envelope divider period 
              registers[0] = value
              p1Duty = (value & 0xc0) >> 6;
              p1Volume = value & 0xf;
              p1CounterHalt = (value & 0x20) > 0;
              p1ConstantVolume = (value & 0x10) > 0;
              break;
          }
  ```
- `registers[0] = value` is just for my debugger, so we can observe the value.
- `p1Duty`, `p1Volume`, `p1CounterHalt`, and `p1ConstantVolume` are the channel's variables. We need to figure them out and add the relevant VRC6 variables. Once that is done for all of them, we will have completed the register writes
- I see, so there's a bitfield for each value written:
- `DDlc.vvvv` **Pulse 1** **D**uty cycle, [length counter halt](https://www.nesdev.org/wiki/APU_Length_Counter), **c**onstant volume/[envelope](https://www.nesdev.org/wiki/APU_Envelope) flag, and **v**olume/envelope divider period
- So we can see how we use `&` to read each of the bits and modify each variable. Simple!
- Alright, I have the variables initialized.
- ## Registers need to modify variables
- So... why does regular P1 do `p1Duty = (value & 0xc0) >> 6;`?
- What is & 0xc0, and >> 6?
- oh. 0xc0 is 1 for bits 6-7. So we & those 2 bits and shift it right 6 because `DDlc.vvvv`
- So say we want duty 0. Well, that one is easy because it's 0. But let's say we want duty 1. That's 0x80 (bit 7 high). 0x80 & 0xc0 = 0x80. Shifting it right 6 gives us 2, because it's dividing it 6 times.
- So p1Duty becomes 2. Hmm, not sure I understand why.
- It's because its value is stored as 0, 1, 2, or 3 depending on those register bits. I guess that makes sense. That's how we look up the duty sequence.
- So this means we're also going to need a `vrc6p1DutyIndex` variable for the duty sequencer.
- Cool! Registers are implemented, now the actual hard part, the cycling
- ## Cycling the VRC6 channels
- For the duty cycles, I don't think it's gonna be like the regular pulses, which use a table. Instead, the cycle generator works like a counter:
- > The duty cycle generator takes 16 steps, counting down from 15 to 0. 
  When the current step is less than or equal to the given duty cycle **D**, the channel volume **V** is output, otherwise 0 is output.
- Here's the regular P1 cycle:
- ```js
  function cyclePulse1() {
      if (p1TimerValue !== 0) {
          p1TimerValue--;
      } else {
          p1TimerValue = (p1Timer * 2) + 1;
          p1DutyIndex++;
          p1DutyIndex &= 0x7;
      }
      let output = dutyCycles[p1Duty][p1DutyIndex];
      if (output === 0 || p1SweepMuting || p1Counter === 0) {
          p1Output = 0;
      } else {
          p1Output = p1ConstantVolume ? p1Volume : p1Decay;
      }
  }
  ```
- I think the vrc6 is considerably simpler, actually.
- I think we just want one value for the pulse timer, rather than freqHi and freqLo. Yup, that's how it shall work
- The other channels all have a Timer as well as a TimerValue. The latter is the one that is clocked when cycled, and the former is the actual register value. So I guess I'll add those.
- I feel alright about this:
- ```js
  function cycleVrc6Pulse1() {
    if (vrc6P1TimerValue !== 0) {
      vrc6P1TimerValue--
    } else {
      vrc6P1TimerValue = (vrc6P1Timer * 2) + 1;
      vrc6P1DutyIndex--
      vrc6P1DutyIndex &= 0xf
    }
    let output = vrc6P1Vol
    if (vrc6P1DutyIndex <= vrc6P1Duty && !vrc6P1Mode) {
      output = 0
    }
  }
  ```
- I got it working! Amazing! I had to consult the Mesen code but with that I actually got it. I'm totally shocked.
- Ugh, (or maybe a little excited?) now I get to make a [[VRC6 driver]]
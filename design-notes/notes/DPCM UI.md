- So I've got a button. What it needs is like a place where it will show the file name and which number the sample is mapped to so they can be referred to in the code.
  id:: 66817d1b-d979-4728-a133-2ee636b6f237
- There also must be a way to delete a sample, I guess we can have a button that will appear next to its filename
- Cool, so I accessed the `File` object and extracted the name without the .dmc extension. It only allows those files anyway.
- So I've got a div with the id of "samples". I want to render into it each sample name in the samples array, with a delete button after each one.
- So we need a function that will add a sample to the array
- ok I've got something:
- ```js
  let samples = ["kick", "snare"]
  
  function renderSamples() {
    samples.forEach((name) => {
      var samplespan = document.createElement('span')
      samplespan.innerHTML = name + " "
      var buttonspan = document.createElement('span')
      var deleteButton = document.createElement('button')
      var br = document.createElement('br')
      deleteButton.innerHTML = "x"
      buttonspan.appendChild(deleteButton)
      samplespan.appendChild(buttonspan)
      samplespan.appendChild(br)
      el("samples").appendChild(samplespan)
    })
  }
  
  renderSamples()
  ```
- ![sample-ui.png](../assets/sample-ui_1719768131230_0.png)
- The "x" buttons obviously need to be given unique IDs so they can be associated with its correct sample
- And actually it shouldn't just be an array, it should be a `samples` object with the filename and bytes as properties
- er... an array of objects, rather... done.
- Ok, so now to actually get the bytes
- gave the "x" buttons IDs starting with "button-0"
- Actually, I don't think we need to. It can just be given the appropriate click event handler to remove...
- you know, fuck this. I don't care about this rn
- I didn't like the way the buttons looked anyway. And at this point I don't see myself using them, I'd just refresh the page and reload the ones I want, lol
- Alright. Now to try building a dpcm stream.
- ## Can we get sound?
- At first, I'll just make the stream assembler take literal bytecode, then I can improve it organically.
- So `assembleDriver` will get called with the raw bytecode as the last array.
- So the nsf module needs to import the samples array... otherwise it would need to send them as well
- Now the fun part. I need to put the sample in the right spot. This is going to take a lot of messing around but it's pretty simple in concept
- I'm gonna cut a file with ca65 with just the one sample to compare
- We need to put the sample name in the bytecode to tell it which one to use.
- So it will look like this:
- ```clojure
  (play {:dpcm ["growl-a" 0xf0]})
  ```
- Now, I need to append the 0xA0 in the calling function... done.
- In the driver assembly function, we need to find all the samples located in the dpcm bytecode array, and stick them in with the proper amount of padding. Sounds simple. Hahaha
- So like... do I really want strings in the bytecode? Well, it will be replaced by the sample address, so I guess it's fine. So we'll just filter the array for all the strings.
- ```js
  const samplesUsed = d.filter((x) => typeof x === 'string')
  ```
- Oh, we want only the unique ones, so I guess we'll make it a set
- Now for each of those, we look it up in the samples array.
- Have to use filter again because it's an array of objects
- Cool, this does the trick:
- ```js
  let dpcmArrays = []
    samplesUsed.forEach((sample) => {
      dpcmArrays.push(samples.filter(x => x.name = sample)[0]["bytes"])
    })
  ```
- Now we have an array of arrays of bytes to include in the right places. And that's it.
- So... let's first start by getting the first sample in the right place.
- We need to insert a whole bunch of zeros or something, it doesn't matter.
- Let's see, I need to configure it to export the nsf so I can check it against the working one
- omg, it works!
- That is, for a single sample. There does still seem to be something funny going on... Like, it will play the wrong one for some reason. Need to get to the bottom of it.
- If sample A is loaded, and you play sample b, it will happily do it even though it should actually be an error because you're trying to play a sample that isn't loaded.
- omg, I figured it out! the mistake is right above us... I accidentally used an assignment (=) instead of an equality check!
- ## multiple samples
- Alright, now we just have a little bunny hop to get another one going.
- So... We need to keep track of how many bytes have been filled by samples so far, so we can put the next one in the right spot after the right amount of padding. Oh, and also...
- The amount of padding we're currently using (343 bytes) is dependent upon the number of bytes in the other music streams (which is 0 rn). So we need to take a tiny step back and calculate the first one too.
- Let's assemble the driver by itself, then the data streams, and then the samples. That will make the whole thing clearer too!
- The driver + data right now is 1065 bytes. We need to calculate the actual sample addresses, so wee need to take that and subtract 0x80 for the header, and add 0x8000 to get the cpu address.
- That's $83a9, for the last byte of the driver.
- The first sample, currently, is addressed at 0x14, which times 64 + 0xc000 = $c500.
- Oh yeah, bank switching. It could be that's what makes it make sense, because atm I have no idea how  it does.
- $83a9 + 343 = $8500.
- Oh...
- Could it be because the first 5 banks are 0, which is the first block, i.e. $8000-8FFF?
- I guess that would make sense, because $c500, which is in bank 5 ($C000-CFFF), would in fact be located at $8500.
- Then the sample at $D500 (bank 6) needs to be set to block 1, or $9500. I'm just trying to rationalize this because it seems like the only thing that makes sense.
- then sample $E500 gets set to bank 2 ($A500),
- but then this might all fall apart when we have sample...
- oh wait... that's when we switch! So maybe it does make sense!
- The final sample address is... back to $D500. Bank 6 and into 7, which we change to 3 and 4 respectively. So that it increases it by 2 blocks! Holy shit! It makes sense!
- Alright... so now that I think I understand... what were we doing?
- Well, for now let's just keep these sample addresses, and it will just be limited to 4 samples or something. Whatever, I don't care. Most of the time it's just like, a kick and a snare anyway.
- So we calculate the right amount of padding. Right now it's 1065 + 343 = 1408.
- So the padding is 1408 - (driver+data). Of course... this won't work once we have enough music, so... hmmm. We'll have to move it up in that case. We knew this would be the most difficult part.
- So yeah... when we have a bunch of music data (even just the amount of this short demo), we run out of space, and therefore need to move the samples back.
- So then how many 00s do we use?
- Well if it was 0x580 - length to get to $8500, I guess it will be 0x1580 - length for $9500.
- Alright, so now I'm unhardcoding the dpcm stream, and, what I need to do is remove the string from the bytecode before using it. so the opposite of the filter that finds the string.
- This is what I'm trying to play
- ```clojure
  (play
    {:square1 (concat [{:volume 3 :duty 0}] arps)
     :square2 (concat [{:volume 1 :duty 0 :length 9 :pitch 160}]
                (detune arps))
     :triangle (concat tri2 tri3 tri2 tri4)
     :noise (concat (loop1 3 drums1) drums2)
     :dpcm [0xAB "growl-e" 0x54 0xf0]})
  ```
- Alright, so that little example works. Now we need to get...
- We've been trying to get multiple samples all night, but I was jumping the gun because I barely just got one calculated, it was hardcoded before, and we had to push them back in order to leave reasonable room for music data.
- When building the sample segment, we're currently only including 1:
- ```js
  let sampleSegment = [].concat(new Array(0x1580 - nsfDriver.length).fill(0),
                                Array.from(dpcmArrays[0] || []))
  ```
- So... the sensible thing to do is to count how big the samples are. In this case... they're as big as they can be, so they're spaced an entire page apart. But if we were doing like a kick and snare that would be wasting a lot of space. Then again... who really cares. The famistudio driver has lots of empty space.
- So our first sample was at $54, or $d500. In the file, it's $1580
- I'm using the same addresses as before, but now the second sample is getting cut off.
- Oh! I got it to work by moving it up to the next one, and switching banks!
- ## But there's a problem...
- The old modules don't work anymore.
- You know... it might be because there's too much data and so we're gonna need to fix it or switch banks.
- This shit is fucking hard.
- Yeah I think it's just a data space issue. Because if I play just some of the parts it works fine.
- ## I got some sleep
- So it would be good to tackle this... though I've kind of lost the plot I think
- I need to take a step back and figure out why my previous stuff is failing. I think it's a matter of space
- I should be able to not only make them all work, but the ones that had to be split should be made to work with bank switching. You know... let's go to [[NSF bank switching]]
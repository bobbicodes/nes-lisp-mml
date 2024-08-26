- It's not even currently intuitive, though if you know how to use them, they work perfectly:
- ```clojure
  (concat
       [{:envelope [14 11 9 7 6 6 6 6 5 5 5 5 4]
         :volume 18 :duty 0}]
       [[12 72] [6 72] [6 72] [6 72] [66 160]])
  ```
- It's the `:volume 18` part that makes no sense, and should be unnecessary. All we need to do is have a map of envelopes and their numbers, and simply look it up. It already checks whether the envelope already exists so that it doesn't create duplicates, so it could just go the extra mile and look up the number for you.
- So, it doesn't actually remove duplicate envelopes. There's this:
- ```js
  function containsEnvelope(env, envs) {
    for (var i = 0; i < envs.length; i++) {
       if (arraysEqual(env, envs[i])) {
         return true
       }
    }
    return false
  }
  ```
- And this is where it is used:
- ```js
  if (notes[i].has("ʞenvelope")) {
    if (!containsEnvelope(notes[i].get("ʞenvelope"), currentEnvelopes)) {
      console.log("not found")
    }
    addEnvelope(notes[i].get("ʞenvelope"))
  }
  ```
- Yeah this seems half-baked, actually. It should *only* add it if it doesn't contain it, i.e. that call to `addEnvelope` should be where the console.log is
- omg, that worked!
- Great, so now we just need our lookup logic, so that when one is used, it will insert the correct volume command corresponding to the envelope number
- So... yeah. That's all.
- Basically, we want `containsEnvelope` to simply return the index instead of `true`.
- Great, that works. Now we should be able to do it from there
- So before, the `:envelope` command would conditionally add the envelope, then the user would refer to it with the `:volume` command. But now, they will just use the envelope command, and it will insert the volume command implicitly.
- ok, I've got the code reworked the way I want it to work, but I'm getting an error that the envelopes are undefined
- oh, silly mistake. I wasn't passing the envs, hahaha
- omg, it works!
- got it pushed to main and documented in the readme. Now I can get back to [[wave]]
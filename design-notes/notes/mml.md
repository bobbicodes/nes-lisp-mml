- great, it's even a shorter name, can't beat that
- So... let's see if we can implement the web worker
- nope. Won't work on codeberg at all. fuck. well, that's kind of what I figured anyway.
- wait... no, it doesn't even work without the worker...
- fuck, this is bullshit. And this same thing has happened several times and it's fucked again.
- I guess I have no choice but to use github.
- Alright, I finally have the gh-pages site with the worker, but it has to be in the public directory.
- Why is this? could it be a path issue? It's a fucking source file
- No, it's specifically a security thing. Fucking assholes. But I guess serving it in public does work
- Holy shit, I finally did it.
- I just needed to use Vite's special syntax to import it as a worker
- ```js
  import Worker from './lisp-worker.js?worker'
  ```
- And the worker goes in src, not public.
- wtf, now I have the worker running on Codeberg, and I have no idea what changed!
- Now the only issue is the audio worklet, which is imported differently so idk how to make it work. Sigh... at least it runs on github...
- oh wait... I might have gotten it... yes!
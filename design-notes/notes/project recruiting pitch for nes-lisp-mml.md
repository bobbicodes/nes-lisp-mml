- This probably ought to be posted in the forum as well as the project recruiting channel
- ### Accessibility-focused NES music editor
- I've been slowly building this project for several years and it is starting to take shape in an unexpected way, and at this point I'd like to try to fish for collaborators because it has become rather obvious that its potential utility is greater than my ability to accomplish it in a timely fashion without help.
  
  It's a program for making NES chiptune much like FamiTracker or FamiStudio, except that the interface is a text editor, and music is written in a dialect of the Lisp programming language. This might bring to mind MML (Music Macro Language), and indeed, this project is very much a response to a [thread on the forum](https://forums.nesdev.org/viewtopic.php?t=16913) that both raises serious problems with the state of programmatic music composition, as well as highlights a large potential use case which had not fully occurred to me until I read it.
  
  This use case is accessibility, in particular for composers with impaired vision or who otherwise struggle with the use of graphical user interfaces. As blind user raygrote describes regarding the dominant paradigm:
- > Once you're in the tracking grid, you're pretty much on your own. Going 
  through rows with keystrokes and aural feedback is pretty much all I can
   do, which is doable if I personally put everything down and I remember 
  what I did, but that only takes me so far. I know that with enough 
  determination I'm sure I could do a lot more than I believe I can now, 
  but I sadly don't possess the patience required and it would still leave
   me dealing with almost impossible problems like quickly knowing what's 
  already in a module. What is most tormenting is that I can set the 
  instruments up the way I want. It's just getting the sequence down 
  that's painful.
- Then, regarding MML:
- > With MML the concentration goes the other way. I'm in a  common text 
  editor which screen readers feel right at home in, so I have to focus on
   making the sound I want, and then when I want to try something, I 
  compile and play. My MML chops aren't scary by any means but I am 
  getting better, and I know that at least some of the pain I feel at the 
  arduous process is shared among MML enthusiasts. I really need to talk 
  to more of them, because I could use a few tips for making the workflow 
  easier.
- The way my project aims to solve these issues is by using a custom text editor that is connected to a live interpreter, a running program which is audio-enabled and aware of the contents and cursor position. This also solves the main complaints discussed in the thread regarding lack of interactivity, not only by way of the live interpreter but through the use of Lisp, which features a highly structured syntax which particularly lends itself to a style of programming involving interactive evaluation.
- ## What I'm looking for
- A program like this necessarily involves several moving parts, all the way from language design to driver assembly to UI design, I am looking for help in these specific areas as well as with their coordination, i.e. architectural planning.
- ## What's in it for you
- At this point, just the pleasure of making chiptune production more accessible and fun. In the future, possible avenues for funding the project may be explored.
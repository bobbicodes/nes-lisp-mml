- We will learn about periods and build a period lookup table that spans 8 octaves.
- This one has a `note_table.i` file. Here, I think everything is fine. But in the main code there are a few things I don't know about, which are likely different. Like, immediately after the header, we have this:
- ```
  .rsset $0000
  joypad1 .rs 1           ;button states for the current frame
  joypad1_old .rs 1       ;last frame's button states
  joypad1_pressed .rs 1   ;current frame's off_to_on transitions
  current_note .rs 1      ;used to index into our note_table
  note_value .rs 1        ;there are 12 possible note values. (A-G#, represented by $00-$0B)
  note_octave .rs 1       ;what octave our note is in (1-9)
  sleeping .rs 1          ;main program sets this and waits for the NMI to clear it.  Ensures the main program is run only once per frame.  
                          ;   for more information, see Disch's document: URL HERE
  ptr1 .rs 2              ;a pointer
  ```
- As explained earlier in the main tutorial, .rs and .rsset are just variables:
- > As covered in week 1, variables are data stored in RAM that you can change any time.  The sprite data in RAM is all variables.  You will need more variables for keeping track of things like the score in the game.  To do that you first need to tell NESASM where in RAM to put the variable.  This is done using the .rsset and .rs directives.  First .rsset is used to set the starting address of the variable.  Then .rs is used to reserve space.  Usually just 1 byte is reserved, but you can have as much as you want.  Each time you do a .rs the address gets incremented so you don't need to do .rsset again.
- ```
   .rsset $0000    ;put variables starting at 0
    score1   .rs 1  ;put score for player 1 at $0000
    score2   .rs 1  ;put score for player 2 at $0001
    buttons1 .rs 1  ;put controller data for player 1 at $0002
    buttons2 .rs 1  ;put controller data for player 2 at $0003
  ```
- So... I don't know if ca65 has that...
- Oh wait... look at this https://github.com/ddribin/nerdy-nights/blob/master/sound/03-periods/periods.asm
- omg, it works! ok then...
- [[Nerdy Nights Sound: Part 4: sound engine skeleton]]
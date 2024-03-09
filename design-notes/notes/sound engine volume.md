- The sound engine already has a system of opcodes to change the volume envelope I think. But I'm thinking maybe... we could control it more directly? Let's try to dig in a little.
- ```z80
  sound_opcodes:
  	.word	se_op_endsound	    	 ; $A0
  	.word	se_op_infinite_loop 	 ; $A1
  	.word	se_op_change_ve	    	 ; $A2
  	.word	se_op_duty	    	 ; $A3
  ```
- So apparently we write $A2 in the note stream to change volume envelope? How does that work? To be honest I didn't really read the opcode part! Let's take a look.
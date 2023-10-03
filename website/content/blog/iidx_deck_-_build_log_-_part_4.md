+++
title = "IIDX Deck - Build Log - Part 4"
date = "2018-05-28 18:36:00"
slug = "iidx_deck_-_build_log_-_part_4"

[extra]
image = "/files/iidx_deck_-_build_log_-_part_4/2018-05-28-12.37.55.jpg"
blurb = "This part covers the programming and lighting modes Source code is down at the bottom for download as well as on githubWith everything wired up I just had to program basic joystick functionality using the teensy as well as some simple code to read from the digital encoders for the spindles Its all covered in the source code pretty well so I wont get into that too much here What I will cover are the  different lighting modes I programmed for the controller Not covered in the source code all the arcade buttons will light up when pressed I did this by routing the LED power through the button The button is grounded when pressed completing the circuit for the LED to light up and open when not pressed preventing current from flowingSome basic thoughts on how the lighting modes function I have a colorsh file which contains several color sets which I refer to as Rainbows in the source code You can swap between rainbows by turning on modifier mode and using the P start and select buttons to cycle through rainbows The rainbows give the various lighting modes below the choices of color to switch to They go from one to the next skipping the off color as needed depending on mode Find below a video showing the various rainbows Most of the videos of particular modes below will use the standard ROYGBIV type rainbow Sorry on the video quality here I have no idea what Im doing with recording bright lights in a dark roomTo change to a lighting mode toggle the MOD button to the on position and press one of the  LM keys as shown in this handy diagram R and R will switch rainbows when the MOD key is engaged The Esc button sends an escape keyboard button press when the mod button is engaged so I can exit the program with the controller as needed and the Go button sends Windows Key   as that is where I have my shortcut to launch Lunatic Rave  in my taskbar If you want to map them to something else its easy to edit in the source code To resume normal play disengage the MOD buttonLighting Mo..."
+++

This part covers the programming and lighting modes. Source code is down at the bottom for download, as well as [on github](https://github.com/kiyoshigawa/IIDX_Deck).


With everything wired up, I just had to program basic joystick functionality using the teensy, as well as some simple code to read from the digital encoders for the spindles. It's all covered in the source code pretty well, so I won't get into that too much here. What I will cover are the 14 different lighting modes I programmed for the controller. Not covered in the source code: all the arcade buttons will light up when pressed. I did this by routing the LED power through the button. The button is grounded when pressed, completing the circuit for the LED to light up, and open when not pressed, preventing current from flowing.


Some basic thoughts on how the lighting modes function. I have a colors.h file which contains several color sets which I refer to as 'Rainbows' in the source code. You can swap between rainbows by turning on modifier mode and using the P1 start and select buttons to cycle through rainbows. The rainbows give the various lighting modes below the choices of color to switch to. They go from one to the next, skipping the 'off' color as needed depending on mode. Find below a video showing the various rainbows. Most of the videos of particular modes below will use the standard 'ROYGBIV' type rainbow. Sorry on the video quality here, I have no idea what I'm doing with recording bright lights in a dark room.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/jbcMVnGK1jU?rel=0" width="560"></iframe>


To change to a lighting mode, toggle the MOD button to the on position, and press one of the 14 LM keys as shown in this handy diagram. R+ and R- will switch rainbows when the MOD key is engaged. The 'Esc' button sends an escape keyboard button press when the mod button is engaged (so I can exit the program with the controller as needed), and the 'Go' button sends Windows Key + 5, as that is where I have my shortcut to launch Lunatic Rave 2 in my taskbar. If you want to map them to something else, it's easy to edit in the source code. To resume normal play, disengage the MOD button.


[![](/files/iidx_deck_-_build_log_-_part_4/lighting-control-buttons.png)](/files/iidx_deck_-_build_log_-_part_4/lighting-control-buttons.png)


**Lighting Mode 1: Solid Color**


This lighting mode will simply cycle through the colors of the current rainbow one by one, skipping the 'off' color, and set the entire deck to this single color. You can cycle to a specific color by pressing the LM1 button repeatedly while the MOD button is engaged. The color will remain constant when the MOD button is disengaged.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/KDwbUnO-o2c?rel=0" width="560"></iframe>


**Lighting Mode 2: Slow Fade**


This lighting mode will cycle through the colors of the current rainbow slowly fading from one to the next, and set the entire deck to that color. Repeatedly pressing the LM2 button will cycle to the next color of the rainbow from the current fade state. When the MOD button is disengaged the colors will cycle on their own indefinitely.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/GIeDqKPRzSM?rel=0" width="560"></iframe>


**Lighting Mode 3: Marquee**


This lighting mode will show a marquee that marches around the wheel at a steady rate. The direction the marquee animation is traveling depends on the last direction the disk was turned. Repeatedly pressing the LM3 button while the MOD button is engaged will cycle through the rainbow colors. The color will remain unchanged when the MOD button is disengaged.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/JJznQX1bBH8?rel=0" width="560"></iframe>


**Lighting Mode 4: Slow Fade Marquee**


This lightning mode is the same as the marquee type above, but the color will continuously fade through the entire rainbow slowly. Repeated pressing of the LM4 button will cycle to the next color of the rainbow from the current fade state. When the MOD button is disengaged the colors will cycle on their own indefinitely.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/eEJGKgOnd9M?rel=0" width="560"></iframe>


**Lighting Mode 5: Wiki**


The wiki lighting more will populate the deck with a solid color marquee style pattern, but unlike the marquee mode, it will remain stationary until the disk is moved. The lighting pattern will then move (more or less) with the disk as it rotates. As with the solid color option, repeatedly pressing the LM5 button while the MOD button is engaged will cycle through the rainbow colors. The color will remain unchanged when the MOD button is disengaged.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/AMZ53nqOELA?rel=0" width="560"></iframe>


**Lighting Mode 6: Slow Fade Wiki**


The slow fade wiki mode is the same as the wiki mode, but the color fades slowly through all the rainbow colors. Repeated pressing of the LM6 button will cycle to the next color of the rainbow from the current fade state. When the MOD button is disengaged the colors will cycle on their own indefinitely.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/zwd-XPc0fG4?rel=0" width="560"></iframe>


**Lighting Mode 7: Rainbow Wiki**


The rainbow wiki mode populated a smoothly transitioned version of the rainbow to the disk for each player. The rainbow will then move to follow the movement of the disks (roughly) as they are rotated.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/UxbvPyGKHIA?rel=0" width="560"></iframe>


**Lighting Mode 8: Slow Rotate Rainbow**


The slow rotate mode populates the disk lighting with the smoothly faded rainbow pattern, but it rotates freely without input from the player in the direction the disk was last rotated. If the direction fo the disk changes, the direction of rotation changes as well.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/kAf1MVp\_5Xk?rel=0" width="560"></iframe>


**Lighting Mode 9: Random Rainbow**


The random rainbow mode will populate the disk with a randomly positioned smooth-fade rainbow pattern every time any button is pressed while the MOD key is disengaged. This one can be a bit distracting, honestly.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/-hdt7WlVTf8?rel=0" width="560"></iframe>


**Lighting Mode 10: Random Color**


This lighting mode has been nicknamed 'seizure mode' by those who have used it. Every time any button is pressed while the MOD button is disengaged, a random color from the rainbow will be displayed as a solid color for the whole disk.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/ipMtOE5cmK4?rel=0" width="560"></iframe>


**Lighting Mode 11: Off**


This lighting mode shows no colors on the disks at all, but the power for lighting is still on, and the buttons will still light up when pressed.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/gq\_EYaebht4?rel=0" width="560"></iframe>


**Lighting Mode 12: Color Pulse**


This mode displays a solid single color of the rainbow at the bottom of the disk. Repeatedly pressing the LM12 button while the MOD button is engaged will cycle through the rainbow colors. The color will remain unchanged when the MOD button is disengaged. Once the MOD button is disengaged, every time you press a button, a pulse of the color at the bottom of the disk is 'shot' up one side towards the top of the disk, until it vanishes.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/2wnMeCvU-Zo?rel=0" width="560"></iframe>


**Lighting Mode 13: Slow Fade Color Pulse**


This mode is similar to the Color Pulse mode above, but the color at the bottom of the disk will slowly fade through the rainbow. Repeatedly pressing the LM13 button will cycle to the next color of the rainbow from the current fade state. When the MOD button is disengaged the colors will cycle on their own indefinitely. Once the MOD button is disengaged, every time you press a button, a pulse of the color at the bottom of the disk is 'shot' up one side towards the top of the disk, until it vanishes.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/GXArSiZ4Ras?rel=0" width="560"></iframe>


**Lighting Mode 14: Rainbow Color Pulse**


This mode is very similar to the slow fade color pulse, and it will behave identically until a button is pressed. When the button is pressed, it will send a pulse of the next color in the rainbow, and change immediately to that color at the bottom of the disk. Basically, it is like the slow fade color pulse mode, but color changes are instant and quicker.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/HUi5bA8QE9U?rel=0" width="560"></iframe>

<div class="post-files">
<h3>Download Files:</h3>
<div class="post-file">
<a href="/files/iidx_deck_-_build_log_-_part_4/colors.h" target="_blank">colors.h</a>
</div>
<div class="post-file">
<a href="/files/iidx_deck_-_build_log_-_part_4/1527532983_iidx-controller.pde" target="_blank">IIDX Controller.pde</a>
</div>
</div>

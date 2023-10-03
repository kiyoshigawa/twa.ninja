+++
title = "oMIDItone - Part 1"
date = "2018-12-20 14:06:00"
slug = "omiditone_-_part_1"

[extra]
image = "/files/omiditone_-_part_1/2018-03-10-19.36.01.jpg"
blurb = "I recently received an Otamatone as a gift I quickly found out I lack the training to accurately hit notes by ear As a solution to my lack of skill I decided to modify my Otamatone into a MIDIcontrolled instrument This is the story of my first attempt at doing soMy first step was to disassemble the device and figure out how to replace the softpot style potentiometer that controlled the device with a digital potentiometer of my ownThis prooved to be pretty straight forward I used a couple of digital potentiometers I had as well as a solid state relay I had laying around to control when the sound was turned on and off and adjust the resistance to the k value range the original softpot hadIn doing that I was able to control the pitch and get some sounds out of it by sending MIDI commands to a Teensy board See video below for one of the earliest testsOnce I had basic MIDI control I set out to map a resistancetopitch map so I could adjust to a specific resistance and get a specific pitch out reliably It turns out that this was not going to work as I had envisioned Not only were there some anaomolous spikes in output frequency but the pitch mapped to specific resistances seemed to vary wildly depending on unknown variables presumably temperature related but it also seemed to be effected by the last notes played as wellYou can see a graph of the anomolous pitch readings below in the images for the post I tried adding jitter to the resistance and having it randomly oscilate around a resistance but the anomolous pitch changes were still present and never in the same place twice when I ran tests I decided that I would need to do more than just replace the softpot with digital pots I would also need to read the frequency of the output sound and be able to adjust towards a specific frequency on the flyThat led to me adding another two wires tied to the speaker outputs so I could measure the actual output frequency of the sound I was playing Now that this was done I was able to ..."
+++

I recently received an Otamatone as a gift. I quickly found out I lack the training to accurately hit notes by ear. As a solution to my lack of skill, I decided to modify my Otamatone into a MIDI-controlled instrument. This is the story of my first attempt at doing so.


My first step was to disassemble the device and figure out how to replace the soft-pot style potentiometer that controlled the device with a digital potentiometer of my own.This prooved to be pretty straight forward. I used a couple of digital potentiometers I had, as well as a solid state relay I had laying around to control when the sound was turned on and off, and adjust the resistance to the ~100k value range the original soft-pot had.


In doing that, I was able to control the pitch, and get some sounds out of it by sending MIDI commands to a Teensy board. See video below for one of the earliest tests.


<iframe allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/Q1Neo-n6\_t0" width="560"></iframe>


Once I had basic MIDI control, I set out to map a resistance-to-pitch map so I could adjust to a specific resistance and get a specific pitch out reliably. It turns out that this was not going to work as I had envisioned. Not only were there some anaomolous spikes in output frequency, but the pitch mapped to specific resistances seemed to vary wildly depending on unknown variables (presumably temperature related, but it also seemed to be effected by the last notes played as well).


You can see a graph of the anomolous pitch readings below in the images for the post. I tried adding jitter to the resistance, and having it randomly oscilate around a resistance, but the anomolous pitch changes were still present, and never in the same place twice when I ran tests. I decided that I would need to do more than just replace the soft-pot with digital pots, I would also need to read the frequency of the output sound, and be able to adjust towards a specific frequency on the fly.


That led to me adding another two wires tied to the speaker outputs so I could measure the actual output frequency of the sound I was playing. Now that this was done, I was able to map the range of available frequencies on startup, adjust to the correct frequency quickly by starting at the closest resistance previously measured at that frequency, and shifting as needed. You'll find the code from my single oMIDItone below.


You'll note that this is labeled part 1. Once I had basic functionality, and I was able to actually hit notes consistently, I realized that the range of the oMIDItone was limited to about one octave per each setting (Low, Mid, and High, controlled via switch on the back), and that if I was going to be able to play entire songs at once, I would need to control more than one. Part 2 of this series will cover my work on making a terrible circuit board that can control up to 6 of these oMIDItones with a Teensy LC, as well as making a class object that will run the oMIDItones and can be called via MIDI commands.

<div class="post-images">
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2018-03-15-20.41.16.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2018-03-15-20.41.16.jpg" title="Original Board for a Single oMIDItone" alt="Original Board for a Single oMIDItone"></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2018-12-20-15.02.48.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2018-12-20-15.02.48.jpg" title="Speaker Wire Connections - B Positive, BW GND." alt="Speaker Wire Connections - B Positive, BW GND."></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2018-12-20-15.04.04.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2018-12-20-15.04.04.jpg" title="Soft Pot Replacement Connections - O Positive, OW Negative (I think)" alt="Soft Pot Replacement Connections - O Positive, OW Negative (I think)"></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2018-12-20-15.01.34.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2018-12-20-15.01.34.jpg" title="Disassembled Circuit with Speaker and Battery Connections." alt="Disassembled Circuit with Speaker and Battery Connections."></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2019-03-23-07.41.06.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2019-03-23-07.41.06.jpg" title="Mostly Assembled oMIDItone with wire routing" alt="Mostly Assembled oMIDItone with wire routing"></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/2019-03-23-07.44.03.jpg">
<img class="post-image" src="/files/omiditone_-_part_1/2019-03-23-07.44.03.jpg" title="Hot Glue for Strain Relief" alt="Hot Glue for Strain Relief"></a>
</div>
<div class="post-image-holder">
<a class="image_link" target="_blank" href="/files/omiditone_-_part_1/jitter-sample-chart.png">
<img class="post-image" src="/files/omiditone_-_part_1/jitter-sample-chart.png" title="Jitter and Frequency Anomaly Chart" alt="Jitter and Frequency Anomaly Chart"></a>
</div>
</div>
<div class="post-files">
<h3>Download Files:</h3>
<div class="post-file">
<a href="/files/omiditone_-_part_1/omiditone.ino" target="_blank">oMIDItone.ino</a>
</div>
</div>

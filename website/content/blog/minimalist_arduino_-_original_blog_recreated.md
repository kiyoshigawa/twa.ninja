+++
title = "Minimalist Arduino - Original Blog Recreated"
date = "2010-02-02 21:33:00"
slug = "minimalist_arduino_-_original_blog_recreated"

[extra]
image = "/files/minimalist_arduino_-_original_blog_recreated/img-0703-web.jpg"
blurb = "This is another blog post from the early tT days I wanted to preserve for posterity We were selling kits of the bareminimum components to make an arduino board Im leaving all the links in this one to the wayback machine because Im lazy Even without the links working you ought to be able to make one of these given the fairly generic parts listOverviewHere at the Transistor we love the Arduino platform so we decided to make our own Arduino Clone The Minimalist Arduino is designed for use in permanent or custom circuits on solderless breadboards stripboard or custom PCBs It contains only the bare minimum parts required for building the Arduino platform The schematic for the board can be downloaded here pdf Please read all instructions on this page before assembly The parts list is as follows with linked manufacturer datasheets when availableParts List ATMegaP   Pin DIP Socket   LM A V Positive Voltage Regulator   MHz Clock Crystal   pF Capacitor   uF Capacitor   nF Capacitor   kOhm Resistor    Ohm Resistor   Green mm LEDThese parts consist of two main components The power supply circuit and the ATMegaP and supporting circuitry The power supply circuit is made of of the LM voltage regulator uF capacitors   Ohm resistor and  green mm LED Circuit power can be supplied using these components and a  to V input voltage or via a separate regulated voltage source such as power over a USB to Serial FTDI converter Only use one power source to drive the P chip or you may damage itThe remainder of the components are part of the ATMegaP circuit and support This includes  clock crystal  pF capacitors   kOhm resistor  mm Green LED   Ohm Resistor and  nF capacitor The kit contains no wires jumpers or reset switch as the applications of this kit are intended to be openended and we did not wish to include unnecessary componentsCommunicating with the Minimalist ArduinoIn order for this kit to be fully functional you must have a means by which to program and communicate with it We did not..."
+++

This is another blog post from the early tT days I wanted to preserve for posterity. We were selling kits of the bare-minimum components to make an arduino board. I'm leaving all the links in this one to the wayback machine because I'm lazy. Even without the links working you ought to be able to make one of these given the fairly generic parts list.


***Overview***


Here at the Transistor, we love the Arduino platform, so we decided to make our own Arduino Clone. The Minimalist Arduino is designed for use in permanent or custom circuits on solderless breadboards, stripboard, or custom PCBs. It contains only the bare minimum parts required for building the Arduino platform. The schematic for the board can be downloaded [here](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/Minimalist-Arduino-Rev01-Schematic.pdf) (pdf). **Please read all instructions on this page before assembly.** The parts list is as follows, with linked manufacturer datasheets when available:


***Parts List***


(1) [ATMega328P](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/ATMega328P-Summary.pdf)  

(1) 28-Pin DIP Socket  

(1) [LM7805 1A 5V Positive Voltage Regulator](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/LM7805-VREG.pdf)  

(1) 16.000MHz Clock Crystal  

(2) [22pF Capacitor](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/22pF-Cap.pdf)  

(2) [10uF Capacitor](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/10uF-Cap.pdf)  

(2) 100nF Capacitor  

(1) [10kOhm Resistor](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/10kOhm-Resistor.pdf)  

(2) [150 Ohm Resistor](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/150-Ohm-Resistor.pdf)  

(2) [Green 3mm LED](https://web.archive.org/web/20160330094714/http://thetransistor.com/wp-content/uploads/2010/02/Green-LED-Info.txt)


These parts consist of two main components: The power supply circuit, and the ATMega328P and supporting circuitry. The power supply circuit is made of of the LM7805 voltage regulator, (2)10uF capacitors, (1) 150 Ohm resistor and (1) green 3mm LED. Circuit power can be supplied using these components and a 7 to 18V input voltage, or via a separate regulated voltage source such as power over a USB to Serial FTDI converter. Only use one power source to drive the 328P chip, or you may damage it.


The remainder of the components are part of the ATMega328P circuit and support. This includes (1) clock crystal, (2) 22pF capacitors, (1) 10 kOhm resistor, (1) 3mm Green LED, (1) 150 Ohm Resistor, and (1) 100nF capacitor. The kit contains no wires, jumpers, or reset switch as the applications of this kit are intended to be open-ended and we did not wish to include unnecessary components.


***Communicating with the Minimalist Arduino***


In order for this kit to be fully functional, you must have a means by which to program and communicate with it. We did not include any means to do this in the kit, though our schematic shows the two most common methods for programming or sommunicating with a standalone ATMega328P: A USB to Serial FTDI dongle, and an ICSP Programmer header pinout.


We recommend using the USB to Serial FTDI chip as the primary method of programming and communicating with the Minimalist Arduino in conjunction with the [Arduino IDE](https://web.archive.org/web/20160330094714/http://arduino.cc/en/Main/Software). Note that the second 100nF capacitor is used on the reset line for this method. The USB to Serial FTDI converter you use may not require this capacitor to function properly. Be sure to check your documentation. There are many places which sell USB to Serial FTDI chips. We recommend the [USB-BUB](http://www.moderndevice.com/products/usb-bub) from Modern Device. They are also available from [Sparkfun](https://web.archive.org/web/20160330094714/http://www.sparkfun.com/commerce/product_info.php?products_id=9115) and probably many other locations which we have not used. Since this chip has a reset pin and will automatically reset the 328P when programming, there is no need to include a physical reset switch in this kit. Also, a single USB to Serial FTDI board will be able to program as many kits as you want, as long as continued serial communication with the board is not required.


Another method for programming the ATMega328 is to use an AVR programmer over the ICSP header. This step is required for changing the bootloader, but since all of our chips come preprogrammed with the Arduino bootloader, this step should be unnecessary. The ICSP header should always be connected to the +5V source from your LM7805, as it relies on external power to function. It also has a reset pin, which negates the need for a manual switch to be included in this kit.


A third option for programming your Minimalist Arduino is to use another Arduino you own (Such as a Duemilanove, a Bare Bones Board, or any other working Arduino which uses a DIP socket to hold its chip) to program the chip. Once the chip is programmed, you can remove it and plug it into your custom circuit, assuming it will not need to be programmed again.


***Assembling the Arduino***


In order to create a working Arduino, we suggest that you begin by building and testing the power supply, which includes only (1) LM7805, (2) 10uF Capacitors, (1) Green 3mm LED and (1) 150 Ohm resistor. See the attached schematic for wiring instructions. Be sure to check the direction of the capacitors, as they will be destroyed if wired backwards, and we did not include spare parts in the kits. Also confirm that you put the 7805 in facing the correct direction or the circuit will not work properly, even though the LED may light. Connect an external voltage source (7V-18V) across the ground pin to the Vin pin, and ensure that the LED lights properly and that you have a steady +5V signal using a voltage meter before continuing.


Depending on if you’re using a solderless breadboard, some stripboard or a custom homemade PCB, you may not need the 28-PIN DIP header. Next you should wire up the ATMEGA328P chip ignoring all optional components. Keep the power disconnected and wait 15-30 seconds between disconnecting the power and connecting any wires to your Atmega328P chip to be sure all capacitors have discharged. We suggest you wire up all included components before wiring the optional ICSP Header, FTDI header or reset switch. It is recommended that you start by connecting wires, and work your way up from small to large components. Double check that everything is wired correctly and that the ‘U’ mark at the top of the chip is in the correct location and that the wires all go to the correct pins. If your chip is damaged due to failure to follow the wiring diagrams, we are not responsible. If everything is wired correctly, reconnect the external power source and the Arduino should boot up and run the default ‘blink’ program on the green LED connected to Digital Pin 13.


Once you have successfully gotten the LED to blink, you are now the owner of a working Minimalist Arduino. At this point you can connect your FTDI or ICSP headers, or plug your ATMega328P into another Arduino board and program the chip to do your bidding. **Only connect the +5V source from the FTDI chip if you are not connected to the 7805 chip +5V source.** If you wish to use external power, then do not connect the +5V pin from the FTDI board to the 328. The rest is up to you. Good luck, we’re all counting on you.


***References and Sources***


This design was based on several standalone Arduino projects found on the web. The following is a list of sites which unknowingly contributed to this design.


[http://www.arduino.cc/playground/Learning/AtmegaStandalone](https://web.archive.org/web/20160330094714/http://www.arduino.cc/playground/Learning/AtmegaStandalone) – This is a page in the Arduino Playground which links to a number of tutorials and guides for creating a standalone Arduino, though most only used an ATMega8 or ATMega168 chip, and not an ATMega328.


[http://itp.nyu.edu/physcomp/Tutorials/ArduinoBreadboard](https://web.archive.org/web/20160330094714/http://itp.nyu.edu/physcomp/Tutorials/ArduinoBreadboard) – This page from ITP PhysComp has step-by-step instructions for assembling an Arduino using an ATMega168 on a breadboard complete with FTDI and ICSP pinouts and bootloader instructions. The Minimalist Arduino design is based mostly on the guide at this page, though we added the 100nF Filter capacitor to the design.


[http://www.moderndevice.com/Docs/RBBB\_Instructions\_04.pdf](https://web.archive.org/web/20160330094714/http://www.moderndevice.com/Docs/RBBB_Instructions_04.pdf) – The schematic for the RBBB was helpful in determining where to include the 100nF capacitor to the ITP PhysComp design, as well as confirming the other components as outlined in that tutorial.  
  
<http://arduino.cc/en/Hacking/PinMapping168> – This is the official Pin Mapping for an Arduino from the official Arduino site. This was essential in designing our schematic drawing which shows the chip pinouts.


***Questions or Comments***


If you have any questions, corrections or comments, please direct them to tim (at) thetransistor (dot) com. (Yeah, I'm tim (at) thisdomain now.)

<div class="post-files">
<h3>Download Files:</h3>
<div class="post-file">
<a href="/files/minimalist_arduino_-_original_blog_recreated/minimalist-arduino-rev01-schematic.pdf" target="_blank">2018-05/minimalist-arduino-rev01-schematic</a>
</div>
</div>

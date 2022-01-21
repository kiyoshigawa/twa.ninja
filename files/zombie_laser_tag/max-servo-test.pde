#include <Servo.h>

Servo myservo;  // create servo object to control a servo 

int potpin = 0;  // analog pin used to connect the potentiometer
int val;    // variable to read the value from the analog pin 

void setup() 
{ 
  myservo.attach(9);  // attaches the servo on pin 2 to the servo object 
} 

void loop() 
{ 
	for(int i=80; i<100; i++){
		myservo.write(i);
		delay(3);
	}
} 

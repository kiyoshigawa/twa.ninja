// Arduino-Based Laser Gun Code
// Written by: Tim Anderson
// Date: 2010-08-10

//this code will fire PWMed laser shots a set number of times before a reload action needs to be completed.
#include <Bounce.h>

//player variables for referencing arrays of values
#define NUM_PLAYERS 4
#define G1 0
#define G2 1
#define G3 2
#define G4 3

//current player definition: set to G1, G2, G3 or G4 then upload the code to the gun control arduino.
#define CP G2

//these define the duration of the laser blast.
#define G1_SHOT_TIME 200
#define G2_SHOT_TIME 150
#define G3_SHOT_TIME 150
#define G4_SHOT_TIME 300

//these are delays to differentiate the different guns by player.
#define G1_PWM_DELAY 10
#define G2_PWM_DELAY 13
#define G3_PWM_DELAY 16
#define G4_PWM_DELAY 19
#define PWM_OFF_TIME 6

//these are the number of shots each gun gets before reloading. They are reset by a reload switch trigger.
#define G1_SHOTS 6
#define G2_SHOTS 20
#define G3_SHOTS 2
#define G4_SHOTS 1

//these are reload times for each player
#define G1_RELOAD_TIME 5000
#define G2_RELOAD_TIME 2000
#define G3_RELOAD_TIME 3000
#define G4_RELOAD_TIME 4000

//assorted #define parameters
#define MIN_TIME_BETWEEN_SHOTS 100 //this is the number of miliseconds between the actual laser burst and the next shot, mostly to add a bit of visual sense to the shots being seperate.
#define MAX_BULLET_LEDS 10 //max number of bullet LEDs on a gun
#define NO_SLOP -1 //if there is no slop bullet use a value that should never come up in the current_bullet variable
#define RELOAD_BLINK_TIME 250 //symmetrical time for reload blink rate

//define pins
//Pin 1 and 2 are for xbee serial in the future
int relay_pin = 2;
int laser_pin = 3;
int reload_sensor_pin = 4;
int speaker_pin = 5;
int trigger_sensor_pin = 6;
int led_pin_1 = 19;
int led_pin_2 = 18;
int led_pin_3 = 17;
int led_pin_4 = 16;
int led_pin_5 = 15;
int led_pin_6 = 14;
int led_pin_7 = 13;
int led_pin_8 = 12;
int led_pin_9 = 11;
int led_pin_10 = 10;

//arrays of delay and shots variables for ease of use in functions below:
unsigned long shot_time[NUM_PLAYERS] = {G1_SHOT_TIME, G2_SHOT_TIME, G3_SHOT_TIME, G4_SHOT_TIME};
unsigned long pwm_delay[NUM_PLAYERS] = {G1_PWM_DELAY, G2_PWM_DELAY, G3_PWM_DELAY, G4_PWM_DELAY};
int shots[NUM_PLAYERS] = {G1_SHOTS, G2_SHOTS, G3_SHOTS, G4_SHOTS};
unsigned long reload_time[NUM_PLAYERS] = {G1_RELOAD_TIME, G2_RELOAD_TIME, G3_RELOAD_TIME, G4_RELOAD_TIME};
bool has_laser_sight[NUM_PLAYERS] = {false, false, false, true};
bool has_automatic_fire[NUM_PLAYERS] = {false, true, false, false};
int led_pins[MAX_BULLET_LEDS] = {led_pin_1, led_pin_2, led_pin_3, led_pin_4, led_pin_5, led_pin_6, led_pin_7, led_pin_8, led_pin_9, led_pin_10}; 

bool has_fired = true; //sets to false after a certain ammount of time has passed and the gun has been cocked
int shots_remaining = 0; //counts shots remaining. is set to shots[CP] upon reloading.
unsigned long last_shot_time = 0; //the last time the gun was fired.

//trigger and reload button bounce objects
Bounce trigger_button = Bounce( trigger_sensor_pin, 5 );
Bounce reload_button = Bounce( reload_sensor_pin, 5 );

//stuff for bullet display:
int num_bullet_leds; //defined in setup
int num_bullets_per_led; //defined in setup
int num_slop_bullets; //defined in setup
int current_bullet_led; //defined in setup, reset in reload();
int slop_bullet_led; //defined in setup
int current_led_bullets_fired; //defined in setup

void setup(){
	//setup pins and serial
	Serial.begin(115200);
	pinMode(relay_pin, OUTPUT);
	pinMode(laser_pin, OUTPUT);
	pinMode(reload_sensor_pin, INPUT);
	digitalWrite(reload_sensor_pin, HIGH);
	pinMode(trigger_sensor_pin, INPUT);
	digitalWrite(trigger_sensor_pin, HIGH);
	pinMode(speaker_pin, OUTPUT);
	pinMode(led_pin_1, OUTPUT);
	pinMode(led_pin_2, OUTPUT);
	pinMode(led_pin_3, OUTPUT);
	pinMode(led_pin_4, OUTPUT);
	pinMode(led_pin_5, OUTPUT);
	pinMode(led_pin_6, OUTPUT);
	pinMode(led_pin_7, OUTPUT);
	pinMode(led_pin_8, OUTPUT);
	pinMode(led_pin_9, OUTPUT);
	pinMode(led_pin_10, OUTPUT);
	
	//definitions for bullet display
	if(shots[CP] <= MAX_BULLET_LEDS){
		num_bullet_leds = shots[CP]; //only use as many LEDs as there are bullets.
		num_bullets_per_led = 1; //1:1 Bullet ratio if less max bullets than LEDs.
		current_bullet_led = num_bullet_leds; //set current bullet to highest numeral lit bullet
	}
	else{
		num_slop_bullets = shots[CP] % MAX_BULLET_LEDS; //remainder of bullets when dividing by number of LEDs.
		if(num_slop_bullets == 0){
			num_bullets_per_led = shots[CP]/MAX_BULLET_LEDS;
			num_bullet_leds = shots[CP]/num_bullets_per_led; //no remainder, no slop-bullet
			slop_bullet_led = NO_SLOP; //flag to see if there is a slop bullet
			current_bullet_led = num_bullet_leds; //set current bullet to highest numeral lit bullet
		}
		else{
			num_bullets_per_led = shots[CP]/MAX_BULLET_LEDS+1; //+1 is to roof instead of floor the division
			num_bullet_leds = shots[CP]/num_bullets_per_led +1; //+1 is for slop bullet to take up remainder
			slop_bullet_led = num_bullet_leds; //the slop bullet will always be the first bullet led to turn off
			current_bullet_led = num_bullet_leds; //set current bullet to highest numeral lit bullet
		}
		
	}
	current_led_bullets_fired = 0; //number for the current led, not overall total
	Serial.print("num_bullets_per_led: ");
	Serial.println(num_bullets_per_led);
	Serial.print("num_bullet_leds: ");
	Serial.println(num_bullet_leds);
	Serial.print("slop_bullet_led: ");
	Serial.println(slop_bullet_led);
}

void loop(){
	//turn on laser sight
	if(has_laser_sight[CP]){
		digitalWrite(laser_pin, HIGH);
	}
	//manual reload button check
	if(reload_button.update() && reload_button.read() == LOW){
		reload();
	}
	//rebounce for automatic firing on weapons which support it.
	if(has_automatic_fire[CP]){
		trigger_button.rebounce(MIN_TIME_BETWEEN_SHOTS + shot_time[CP] + 10);
	}
	//auto-reload function when gun is empty.
	if(shots_remaining < 1){
		reload();
	}
	//check for trigger sensor change and fire when it has changed
	if(trigger_button.update() && trigger_button.read() == LOW){
		fire_bullet();
	}
	if(has_fired){
		display_remove_bullet();
	}
	
}

void reload(){
	//turn off laser sight while reloading
	if(has_laser_sight[CP]){
		digitalWrite(laser_pin, LOW);
	}
	unsigned long reload_begin_time = millis();
	while(reload_begin_time + reload_time[CP] > millis()){
		display_bullets_all_off();
		delay(RELOAD_BLINK_TIME);
		display_bullets_all_on();
		delay(RELOAD_BLINK_TIME);
	}
	//No action may be performed while this is occurring
	//update display after all bullets are loaded to show total number of bullets.
	display_bullets_all_off();
	display_reset_bullets();
	shots_remaining = shots[CP];
	//update to reset switches
	trigger_button.update();
	reload_button.update();
}

void fire_bullet(){
	last_shot_time = millis();
	//begin PWM pulsing at the appropriate rate.
	//nothing else can happen while firing
	
	//click relay on
	digitalWrite(relay_pin, HIGH);
	while(last_shot_time + shot_time[CP] > millis()){
		digitalWrite(laser_pin, HIGH);
		delayMicroseconds(pwm_delay[CP]*1000-PWM_OFF_TIME*1000);
		digitalWrite(laser_pin, LOW);
		delayMicroseconds(PWM_OFF_TIME*1000);
	}
	//click relay off
	digitalWrite(relay_pin, LOW);
	shots_remaining--;
	//delay an additional MIN_TIME_BETWEEN_SHOTS before returning to the loop to add to the visual aspects of the game
	delay(MIN_TIME_BETWEEN_SHOTS);
	has_fired = true;
	//update to reset switches
	trigger_button.update();
	reload_button.update();
}

void display_bullets_all_on(){
	for(int i=0; i<MAX_BULLET_LEDS; i++){
		digitalWrite(led_pins[i], HIGH);
	}
}

void display_bullets_all_off(){
	for(int i=0; i<MAX_BULLET_LEDS; i++){
		digitalWrite(led_pins[i], LOW);
	}
}

void display_remove_bullet(){
	if(current_bullet_led == slop_bullet_led){
		if(current_led_bullets_fired >= num_slop_bullets){
			digitalWrite(led_pins[current_bullet_led-1], LOW);
			current_bullet_led--;
			current_led_bullets_fired = 0;
		}
	}
	else{
		if(current_led_bullets_fired >= num_bullets_per_led){
			digitalWrite(led_pins[current_bullet_led-1], LOW);
			current_bullet_led--;
			current_led_bullets_fired = 0;
		}
	}
	current_led_bullets_fired++; //increase number of bullets fired on current LED
	has_fired = false;
}

void display_reset_bullets(){
	current_bullet_led = num_bullet_leds; //set current bullet to highest numeral lit bullet
	current_led_bullets_fired = 0;
	for(int i=current_bullet_led-1; i>=0; i--){
		digitalWrite(led_pins[i], HIGH);
	}
	//make the display reset all bullets for the current gun to on.
	
}
//Arduino Laser Receiver interrupt code
//Written By: Tim Anderson
//Date: 2010-08-20

//player variables for referencing arrays of values
#define NUM_PLAYERS 4
#define G1 0
#define G2 1
#define G3 2
#define G4 3
#define NO_PLAYER -1

//these are delays to differentiate the different guns by player.
#define G1_PWM_DELAY 10
#define G2_PWM_DELAY 13
#define G3_PWM_DELAY 16
#define G4_PWM_DELAY 19

#define NUM_LASER_TIMES 4

//assorted variables
unsigned long pwm_delay[NUM_PLAYERS] = {G1_PWM_DELAY, G2_PWM_DELAY, G3_PWM_DELAY, G4_PWM_DELAY}; //easy referencing array
unsigned long laser_times[NUM_LASER_TIMES] = {0,0,0,0}; //array for averages
unsigned long laser_average = 0; //the average time between the last 3 recorded laser hits
bool is_new_laser_time = false; //flag for telling when the optical sensor goes high
bool is_hit = false;
int last_hit_by = NO_PLAYER;


//pin assignment
int interrupt_pin = 0; //actually pin 2, but uses variable 0.

void setup(){
	Serial.begin(112500);
	pinMode(interrupt_pin+2, INPUT); //+2 for odd definition of interrupt pins
	attachInterrupt(interrupt_pin, log_interrupt_time, RISING);
	
	//debug below
	pinMode(13, OUTPUT);
	digitalWrite(13, LOW);
}

void loop(){
	if(is_new_laser_time){
		add_laser_time();
		laser_average = calc_laser_average();
		is_hit = calc_hit();
		Serial.println(laser_average);
	}
	if(is_hit){
		//do whatever it is you do when hit:
		digitalWrite(13, HIGH);
		delay(1000+(last_hit_by*1000));
		digitalWrite(13, LOW);
		
		//reset variables
		is_hit = false;
		last_hit_by = NO_PLAYER;
	}
	
}

void log_interrupt_time(){
	is_new_laser_time = true;
}

void add_laser_time(){
	for(int i=NUM_LASER_TIMES; i>0; i--){
		laser_times[i] = laser_times[i-1];
	}
	laser_times[0] = millis();
}

unsigned long calc_laser_average(){
	int running_total = 0;
	for(int i=NUM_LASER_TIMES-1; i>0; i--){
		running_total = running_total + (laser_times[i-1]-laser_times[i]);
	}
	int average = running_total / (NUM_LASER_TIMES-1);
	is_new_laser_time = false;
	return average;
}

bool calc_hit(){
	for(int i=0; i<NUM_PLAYERS; i++){
		if(laser_average == pwm_delay[i] || laser_average == pwm_delay[i]-1 || laser_average == pwm_delay[i]+1){
			last_hit_by = i;
			return true;
		}
	}
	return false;
}

//Elefu MC32u4 Rock band Guitar Code
//Written By: Tim Anderson
//Date: 2013.06.09

#include <FastSPI_LED2.h>
#include <Bounce.h>

//uncomment this to turn on debug serial messages.
//#define DEBUG

#define BOUNCE_TIME 3
#define NUM_KEYS 9

#define NUM_LEDS 15
#define LED_PIN 2
#define NUM_REPEATS 3
#define DELAY_TIME 10

#define G_PIN 9
#define R_PIN 10
#define Y_PIN 11
#define B_PIN 12
#define O_PIN 13
#define S_UP_PIN 6
#define S_DN_PIN 7
#define START_PIN 4
#define SELECT_PIN 5

struct CRGB leds[NUM_LEDS];

Bounce g_db = Bounce(G_PIN, BOUNCE_TIME);
Bounce r_db = Bounce(R_PIN, BOUNCE_TIME);
Bounce y_db = Bounce(Y_PIN, BOUNCE_TIME);
Bounce b_db = Bounce(B_PIN, BOUNCE_TIME);
Bounce o_db = Bounce(O_PIN, BOUNCE_TIME);
Bounce s_up_db = Bounce(S_UP_PIN, BOUNCE_TIME);
Bounce s_dn_db = Bounce(S_DN_PIN, BOUNCE_TIME);
Bounce start_db = Bounce(START_PIN, BOUNCE_TIME);
Bounce select_db = Bounce(SELECT_PIN, BOUNCE_TIME);

//Default key config for Phase Shift:
int g_key = KEY_F1;
int r_key = KEY_F2;
int y_key = KEY_F3;
int b_key = KEY_F4;
int o_key = KEY_F5;
int s_up_key = KEY_RIGHT_SHIFT;
int s_dn_key = KEY_RETURN;
int start_key = KEY_TAB;
int select_key = KEY_BACKSPACE;

int keys[NUM_KEYS] = {G_PIN, R_PIN, Y_PIN, B_PIN, O_PIN, S_UP_PIN, S_DN_PIN, START_PIN, SELECT_PIN};
Bounce keys_debounce[NUM_KEYS] = {g_db, r_db, y_db, b_db, o_db, s_up_db, s_dn_db, start_db, select_db};
int keys_press[NUM_KEYS] = {g_key, r_key, y_key, b_key, o_key, s_up_key, s_dn_key, start_key, select_key};

//this is for the 'breathing' effect
float bright_factor = 1.0;
float bright_variance = 0.8;
float bright_slew = 0.01;
bool trending_up = true;

void setup(){
  //Default all pins to GND unless being actively used later
  for(int i=0; i<20; i++){
    pinMode(i, OUTPUT);
    digitalWrite(i, LOW);
  }
  #ifdef DEBUG
    Serial.begin(9600);
  #endif
  delay(2000);
  //Init LED strip
  LEDS.setBrightness(64);
  LEDS.addLeds<WS2811, 2, GRB>(leds, NUM_LEDS);
  //Set used keys as inputs
  for(int i=0; i<NUM_KEYS; i++){
    pinMode(keys[i], INPUT_PULLUP);
  }
  //begin Keyboard and Print Serial update
  Keyboard.begin();
  #ifdef DEBUG
    //Wait for Serial to finish initializing
    while(!Serial){};
    Serial.println("Init Complete");
  #endif
}

void loop(){
  //This is the prime functionality. Everything else should be really fast and not interfere with this
  for(int i=0; i<NUM_KEYS; i++){
    keys_debounce[i].update();
    if(keys_debounce[i].read() == LOW){
      Keyboard.press(keys_press[i]);
      if(i < 5){ //when the button is one of the 5 colored buttons
        if(i == 0){//green
          leds[i] = CRGB(0, 128*bright_factor, 0);
          leds[i+5] = CRGB(0, 255*bright_factor, 0);
          leds[i+10] = CRGB(0, 255*bright_factor, 0);
        }
        if(i == 1){//red
          leds[i] = CRGB(128*bright_factor, 0, 0);
          leds[i+5] = CRGB(255*bright_factor, 0, 0);
          leds[i+10] = CRGB(255*bright_factor, 0, 0);
        }
        if(i == 2){//yellow
          leds[i] = CRGB(128*bright_factor, 100*bright_factor, 0);
          leds[i+5] = CRGB(255*bright_factor, 200*bright_factor, 0);
          leds[i+10] = CRGB(255*bright_factor, 200*bright_factor, 0);
        }
        if(i == 3){//blue
          leds[i] = CRGB(0, 0, 128*bright_factor);
          leds[i+5] = CRGB(0, 0, 255*bright_factor);
          leds[i+10] = CRGB(0, 0, 255*bright_factor);
        }
        if(i == 4){//orange
          leds[i] = CRGB(128*bright_factor, 32*bright_factor, 0);
          leds[i+5] = CRGB(255*bright_factor, 64*bright_factor, 0);
          leds[i+10] = CRGB(255*bright_factor, 64*bright_factor, 0);
        }
      }
      #ifdef DEBUG
        Serial.println(keys_press[i]);
      #endif
    }
    if(keys_debounce[i].read() == HIGH){
      Keyboard.release(keys_press[i]);
      if(i < 5){ //when the button is one of the 5 colored buttons
        leds[i] = CRGB(0, 0, 0);
        leds[i+5] = CRGB(0, 0, 0);
        leds[i+10] = CRGB(0, 0, 0);
      }
    }
  }
  //Everything else is below here:
  breathe();
  LEDS.show();
}

void breathe(){
  if(trending_up){
    if(bright_factor >= 1.0){//if it has reached full brightness
      bright_factor = 1.0;
      trending_up = false;
    }
    else{
      bright_factor = bright_slew + bright_factor;
    }
  }
  else{
    if(bright_factor <= 1.0-bright_variance){//if it has reached min brightness
      bright_factor = 1.0-bright_variance;
      trending_up = true;
    }
    else{
      bright_factor = bright_factor - bright_slew;
    }
  }
}

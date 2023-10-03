/*
Author: kiyoshigawa
Start Date: 2018-03-18
Description: 
Took an Otamatone, and replaced the pressure-sensitive variable resistor strip with some MCP4151 50kohm variable pots (2 in series) with a 220Ohm fixed resistor.
Then used a teensy LC MIDI library to control the resistance from the chips over SPI, and connected it to the otamatone, making a oMIDItome.

THINGS TO DO IN THE FUTURE:
Interpret MIDI velocity signals and PWM the relay_pin for volume control
Interpret pitch shift messages and adjust frequency accordingly

*/

#include <SPI.h>

//comment this to disable serial functions for testing notes.
#define DEBUG

//This is a non-valid note number for MIDI to designate no note should be played.
#define NO_NOTE 128

//This is a non-valid resistance value to denote that the note should not be played.
#define NO_RESISTANCE -1

//This is the frequency of the note A - typically 440 Hz.
#define NOTE_A 440

//This is how many MIDI notes there are. It should always be 127
#define NUM_MIDI_NOTES 128

//this is how many resistance steps can be used with the digital pots. The current hardware has 2 digital pots with 256 steps each, for a total of 512.
#define NUM_RESISTANCE_STEPS 512

//This is the number of rising edges to read before computing a new current average frequency.
#define NUM_FREQ_READINGS 4

//This is the analog read threshold for a rising edge to count the frequency.
#define RISING_EDGE_THRESHOLD 200

//this is a jitter value to randomize the resistance in an attempt to counter the frequency variation around a specific resistance value. it is measured in resistance steps
#define JITTER 10

//this is the % difference that a note can be off to trigger correction, as a number from 0-100
#define ALLOWABLE_NOTE_ERROR 2

//this is to make sure that the rising edge isn't measured too often (in us):
#define MIN_TIME_BETWEEN_RISING_EDGE_MEASUREMENTS 20

//this is to make sure frequency corrections are not too frequent (in us):
#define TIME_BETWEEN_FREQUENCY_CORRECTIONS 10

int relay_pin = 26;
int CS0_pin = 14;
int CS1_pin = 15;
int analog_feedback_pin = A2;
//Using SPI0 on board, MOSI0 = 11, MISO0 = 12, and SCK0 = 13, which will blink the LED as it sends.

//global variables:

//This is a variable that tells the program when to check for a note value when the note is on.
bool check_note_value = false;

//current_note is the number of the MIDI note value that is being played.
int current_note = NO_NOTE;

//this will be set during the startup test to the lowest note registered.
int min_note = 0;

//this will be set during the startup test to the highest note registered.
int max_note = NUM_MIDI_NOTES;

//This is an array of MIDI notes and the frequency they correspond to. Turns out it is not needed.
//float midi_Hz_freqs[NUM_MIDI_NOTES] = {8.176, 8.662, 9.177, 9.723, 10.301, 10.913, 11.562, 12.25, 12.978, 13.75, 14.568, 15.434, 16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.5, 25.957, 27.5, 29.135, 30.868, 32.703, 34.648, 36.708, 38.891, 41.203, 43.654, 46.249, 48.999, 51.913, 55, 58.27, 61.735, 65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.826, 110, 116.541, 123.471, 130.813, 138.591, 146.832, 155.563, 164.814, 174.614, 184.997, 195.998, 207.652, 220, 233.082, 246.942, 261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305, 440, 466.164, 493.883, 523.251, 554.365, 587.33, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609, 880, 932.328, 987.767, 1046.502, 1108.731, 1174.659, 1244.508, 1318.51, 1396.913, 1479.978, 1567.982, 1661.219, 1760, 1864.655, 1975.533, 2093.005, 2217.461, 2349.318, 2489.016, 2637.02, 2793.826, 2959.955, 3135.963, 3322.438, 3520, 3729.31, 3951.066, 4186.009, 4434.922, 4698.636, 4978.032, 5274.041, 5587.652, 5919.911, 6271.927, 6644.875, 7040, 7458.62, 7902.133, 8372.018, 8869.844, 9397.273, 9956.063, 10548.08, 11175.3, 11839.82, 12543.85};

//This is an array that has converted the midi_freqs_Hz array into an array of integers representing us between rising edges for the note frequencies
int midi_freqs[NUM_MIDI_NOTES] = {122309, 115446, 108968, 102848, 97077, 91633, 86490, 81632, 77053, 72727, 68643, 64792, 61154, 57723, 54484, 51427, 48538, 45814, 43243, 40816, 38525, 36363, 34322, 32396, 30578, 28861, 27242, 25712, 24270, 22907, 21622, 20408, 19262, 18181, 17161, 16198, 15289, 14430, 13621, 12856, 12134, 11453, 10810, 10204, 9631, 9090, 8580, 8099, 7644, 7215, 6810, 6428, 6067, 5726, 5405, 5102, 4815, 4545, 4290, 4049, 3822, 3607, 3405, 3214, 3033, 2863, 2702, 2551, 2407, 2272, 2145, 2024, 1911, 1803, 1702, 1607, 1516, 1431, 1351, 1275, 1203, 1136, 1072, 1012, 955, 901, 851, 803, 758, 715, 675, 637, 601, 568, 536, 506, 477, 450, 425, 401, 379, 357, 337, 318, 300, 284, 268, 253, 238, 225, 212, 200, 189, 178, 168, 159, 150, 142, 134, 126, 119, 112, 106, 100, 94, 89, 84, 79};

//This is an array for storing the most recently read resistance that is closest to a midi note frequency. It will be initialized at startup, and adjust as notes are played
int midi_to_resistance[NUM_MIDI_NOTES];

//this is an array of the most recent measured rising edge average times in us that correspond to a resistance
unsigned long measured_freqs[NUM_RESISTANCE_STEPS];

//This is an array of the last NUM_FREQ_READINGS frequency readings for averaging purposes.
unsigned long recent_freqs[NUM_FREQ_READINGS];

//this is an index that will count up to NUM_FREQ_READINGS and reset to 0, triggering a frequency measurement average.
int freq_reading_index = 0;

//This is a variable for storing the most recent frequency reading based on the average of the last NUM_FREQ_READINGS readings
unsigned long current_freq = 0;

//this is to measure the frequency of rising edges produced by the output sound wave
elapsedMicros last_rising_edge;

//this is to make sure the frequency correction isn't happening faster than the digital pots can be set
elapsedMillis last_adjust_time;

//this is a variable for globally storing the most recent analog reading
int last_analog_read = 1024;


//This function will set the resistors to the note, the pwm on the relay_pin to a velocity (not sure if this will work).
//The most recent note will always override, since the otamatone only has one output.
//the channel should be 1 for low mode, 2 for mid mode, and 3 for high mode.
void OnNoteOn(byte channel, byte note, byte velocity){
  check_note_value = true;
  if(note < min_note){
    digitalWrite(relay_pin, LOW);
    current_note = NO_NOTE;
  }
  else if(note > max_note){
    digitalWrite(relay_pin, LOW);
    current_note = NO_NOTE;
  }
  else{
    current_note = note;
    digitalWrite(relay_pin, HIGH);
    #ifdef DEBUG
      Serial.print("Note ");
      Serial.print(current_note);
      Serial.println(" playing.");
    #endif
  }
}

//This resets everything so it is ready for the next note:
void OnNoteOff(byte channel, byte note, byte velocity){
  digitalWrite(relay_pin, LOW);
  check_note_value = false;
  current_note = NO_NOTE;
  //reset the frequency measurement values for a clean start on the next note:
  for(int i=0; i<NUM_FREQ_READINGS; i++){
    recent_freqs[i] = 0;
  }
  freq_reading_index = 0;
  #ifdef DEBUG
    Serial.println("Current note ended.");
  #endif
}

//this will set the CS_pin digital pot's wiper to a value based on byte 1 and byte 2
void set_pot(int CS_pin, uint16_t command_byte){
  digitalWrite(CS_pin, LOW); //select chip
  uint8_t byte_high = command_byte >> 8;
  uint8_t byte_low = command_byte & 0xff;
  SPI.transfer(byte_high); //send command first
  SPI.transfer(byte_low); //send value second
  digitalWrite(CS_pin, HIGH); //de-select chip when done
}

//this will take a uint16_t number and set the total resistance value to between 0 and 512 on the board.
void set_resistance(uint16_t resistance){
  if(resistance >= 0 && resistance <= NUM_RESISTANCE_STEPS/2){
    set_pot(CS0_pin, resistance);
    set_pot(CS1_pin, 0);
  }
  else if(resistance > NUM_RESISTANCE_STEPS/2 && resistance <= NUM_RESISTANCE_STEPS){
    set_pot(CS0_pin, NUM_RESISTANCE_STEPS/2);
    set_pot(CS1_pin, resistance-NUM_RESISTANCE_STEPS/2);
  }
  else if(resistance < 0){
    set_pot(CS0_pin, 0);
    set_pot(CS1_pin, 0);
  }
  else{
    set_pot(CS0_pin, NUM_RESISTANCE_STEPS/2);
    set_pot(CS1_pin, NUM_RESISTANCE_STEPS/2);
  }
}

unsigned long average(unsigned long * array, int num_elements){
  unsigned long total = 0;
  for(int i=0; i<num_elements; i++){
    total = total + array[i];
  }
  return total/num_elements;
}

//this introduces jittered resistance settings, and should be called every loop to keep the jitter working:
void set_jitter_resistance(uint16_t resistance, int jitter){
  int current_jitter = random(jitter);
  int positive = random(1);
  if(positive){
    set_resistance(resistance + current_jitter);
  }
  else{
    set_resistance(resistance - current_jitter);
  }
}

//This will constantly read the analog input and return true when it detects a rising edge signal.
//It also updates the current and last rising edge time values.
bool is_rising_edge(){
  int current_analog_read = analogRead(analog_feedback_pin);
  if(last_rising_edge > MIN_TIME_BETWEEN_RISING_EDGE_MEASUREMENTS){
    if( current_analog_read > RISING_EDGE_THRESHOLD && last_analog_read < RISING_EDGE_THRESHOLD){
      last_analog_read = current_analog_read;
      return true;
    }
    else{
      last_analog_read = current_analog_read;
      return false;
    }
  }
  else{
    return false;
  }
}

//This will play from 0 resistance value to 512 resistance value and note which resistances
//correspond to which notes in the note matrix:
void startup_test(){
  #ifdef DEBUG
    Serial.println("Startup Test Measured Frequencies Below:");
  #endif

  //Turn on the relay to generate sounds:
  digitalWrite(relay_pin, HIGH);
  //Start counting microseconds since a rising edge to calculate frequencies:
  last_rising_edge = 0;
  //iterate through all frequencies with jitter to determine the average frequency for that resistance.
  for(uint16_t resistance = JITTER; resistance <= NUM_RESISTANCE_STEPS-JITTER; resistance++){
    set_jitter_resistance(resistance, JITTER);
    //measure the frequency NUM_FREQ_READINGS times:
    //wait for at least one rising edge before beginning:
    while(1){
      if(is_rising_edge){
        break;
      }
    }
    freq_reading_index = 0;
    while(1){
      set_jitter_resistance(resistance, JITTER);
      if(is_rising_edge()){
        recent_freqs[freq_reading_index] = last_rising_edge;
        last_rising_edge = 0;
        freq_reading_index++;
      }
      if(freq_reading_index >= NUM_FREQ_READINGS){
        measured_freqs[resistance] = average(recent_freqs, NUM_FREQ_READINGS);
        #ifdef DEBUG
          Serial.println(measured_freqs[resistance]);
        #endif
        break;
      }
    }
  }
  digitalWrite(relay_pin, LOW);
  //Set the max_note and min_note variables based on the frequencies measured:
  unsigned long max_measured_freq = midi_freqs[0]; //set default to longest time in us, and adjust below:
  unsigned long min_measured_freq = midi_freqs[NUM_MIDI_NOTES-1]; //set default to shortest time in us, and adjust below:
  for(uint16_t i = JITTER; i <= NUM_RESISTANCE_STEPS-JITTER; i++){
    if(measured_freqs[i] < max_measured_freq){
      max_measured_freq = measured_freqs[i];
    }
    if(measured_freqs[i] > min_measured_freq){
      min_measured_freq = measured_freqs[i];
    }
  }
  #ifdef DEBUG
    Serial.print("Min Measured Freq in us: ");
    Serial.println(min_measured_freq);
    Serial.print("Max Measured Freq in us: ");
    Serial.println(max_measured_freq);
  #endif

  //set min_note:
  for(int i=0; i<NUM_MIDI_NOTES; i++){
    if(midi_freqs[i] < min_measured_freq){
      //should go to the next note to leave room for variance
      min_note = i+1;
      break;
    }
  }

  //set max_note:
  for(int i=NUM_MIDI_NOTES; i>0; i--){
    if(midi_freqs[i] > max_measured_freq){
      //should go to the next note to leave room for variance
      max_note = i-1;
      break;
    }
  }

  #ifdef DEBUG
    Serial.print("Min MIDI note is: ");
    Serial.println(min_note);
    Serial.print("Max MIDI note is: ");
    Serial.println(max_note);
  #endif

  //Assign midi notes to a resistance based on the frequency and store in the midi_to_resistance array
  //This is to iterate through the valid notes as it finds a match:
  int current_midi_note_to_set = min_note;
  //iterate through the measured resistance step readings
  for(int i=JITTER; i<NUM_RESISTANCE_STEPS-JITTER; i++){
    //If the frequency if higher than the current note (less us) then set the midi_to_resistance value and increment the note:
    if(measured_freqs[i] < midi_freqs[current_midi_note_to_set]){
      midi_to_resistance[current_midi_note_to_set] = i;
      #ifdef DEBUG
        Serial.print("MIDI note ");
        Serial.print(current_midi_note_to_set);
        Serial.print(" set to ");
        Serial.print(i);
        Serial.println(" resistance.");
      #endif
      current_midi_note_to_set++;
    }

  }
}

//This function will set the current note to the most recent 
void play_note(int note){
  //this will only try to read for frequencies if the check_note_value is true, to keep it from getting bad readings when no note is being played:
  if(check_note_value){
    //this first bit is calculating the average continuously and storing it in current_freq
    if(is_rising_edge()){
      recent_freqs[freq_reading_index] = last_rising_edge;
      last_rising_edge = 0;
      freq_reading_index++;
    }
    if(freq_reading_index >= NUM_FREQ_READINGS){
      //calculate a new average frequency
      current_freq = average(recent_freqs, NUM_FREQ_READINGS);
      //and reset the counter
      freq_reading_index = 0;
    }

    //the next bit will adjust the current jittered resistance value up or down depending on how close the current_freq is to the desired frequency of the current_note, and store it in the midi_to_resistance array
    if(last_adjust_time > TIME_BETWEEN_FREQUENCY_CORRECTIONS){
      //this determines the allowable range that the frequency can be in to avoid triggering a retune:
      unsigned long max_allowable_freq = midi_freqs[current_note]*(100-ALLOWABLE_NOTE_ERROR)/100;
      unsigned long min_allowable_freq = midi_freqs[current_note]*(100+ALLOWABLE_NOTE_ERROR)/100;
      if(current_freq < max_allowable_freq){
        midi_to_resistance[current_note] = midi_to_resistance[current_note] - 1;
        last_adjust_time = 0;
        #ifdef DEBUG
          Serial.print("Note ");
          Serial.print(current_note);
          Serial.print(" resistance adjusted to ");
          Serial.println(midi_to_resistance[current_note]);
        #endif
      }
      if(current_freq > min_allowable_freq){
        midi_to_resistance[current_note] = midi_to_resistance[current_note] + 1;
        last_adjust_time = 0;
        #ifdef DEBUG
          Serial.print("Note ");
          Serial.print(current_note);
          Serial.print(" resistance adjusted to ");
          Serial.println(midi_to_resistance[current_note]);
        #endif
      }
    }

    //finally, the resistance will be set based on the most current value of the midi_to_resistance array:
    set_jitter_resistance(midi_to_resistance[current_note], JITTER);
  }
}


void setup(){
  //start a timer for tracking rising edges.
  last_rising_edge = 0;
  #ifdef DEBUG
    //init Serial to allow for manual note setting in debug mode:
    Serial.begin(9600);
    delay(5000); //wait for serial
    Serial.println("Debug is enabled, printing note values.");
  #endif

  //set pin modes
  pinMode(CS0_pin, OUTPUT);
  pinMode(CS1_pin, OUTPUT);
  pinMode(relay_pin, OUTPUT);
  pinMode(analog_feedback_pin, INPUT);

  //turn off relay and all CS pins
  digitalWrite(CS0_pin, HIGH);
  digitalWrite(CS1_pin, HIGH);
  digitalWrite(relay_pin, LOW);

  //call out MIDI functions
  usbMIDI.setHandleNoteOff(OnNoteOff);
  usbMIDI.setHandleNoteOn(OnNoteOn);

  //init SPI  
  SPI.begin();

  //Play startup tone and save initial resistance to note values.
  startup_test();
}

void loop(){
  //If debug is on, this will let you manually set a tone via serial:
  #ifdef DEBUG
    uint16_t command_in;
    if(Serial.available()){
      command_in = Serial.parseInt();
      set_resistance(command_in);
    }
  #endif
  //This will read for MIDI notes and start/stop the notes based on MIDI input:
  usbMIDI.read();

  //If a MIDI note is on, this will play the note, and update based on feedback.
  if(current_note != NO_NOTE){
    play_note(current_note);
  }
}

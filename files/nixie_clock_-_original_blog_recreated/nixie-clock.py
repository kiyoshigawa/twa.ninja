#This is a simple script to send the current time in an HH.MM.SS format to a serial port, so it can be displayed on my nixie clock
#Author: Kiyoshigawa
#Date: 2018-05-26

#For best functionality, add to your sudo crontab a line to run this script every minute.

import time
import serial
import datetime
from dateutil import tz
from threading import Barrier

#configure the serial connections for the Arduino defaults
ser = serial.Serial(
    #Port is done by ID for the FTDI chip I currently have on my clock. Will need to be changed if I ever replace it.
    port='/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_A4006DbG-if00-port0',
    baudrate=9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS
)

#variables to convert from the server UTC time to my local time:
from_tz = tz.gettz('UTC')
to_tz = tz.gettz('America/Denver')

def update_time(current_time_local):
    #the bit below will generate the string to be sent to the nixie clock
    #if seconds is even, use . as a spacer, otherwse use no spacer
    seconds = int(current_time_local.strftime("%S"))
    if seconds%2 == 0:
        time_string = current_time_local.strftime("A%I.%M.%SZ")
    else:
        time_string = current_time_local.strftime("A%I%M%SZ")

    #encode the string to ASCII for use with serial
    time_string_bytes = str.encode(time_string)

    #send serial string to clock
    ser.write(time_string_bytes)

#onto the main function:
#Get a start time so it can kill itself once the next cronjob has run.
start_time = datetime.datetime.now()

while True:
    #this bit gets the actual time and converts it to the right timezone.
    current_time = datetime.datetime.now()
    current_time_utc = current_time.replace(tzinfo=from_tz)
    current_time_local = current_time_utc.astimezone(to_tz)

    update_time(current_time_local)
    
    #if 120 seconds have passed, break and end the script:
    if current_time.timestamp() - start_time.timestamp() > 60:
        break

    #sleep for a second, because that's as often as a clock needs to update
    time.sleep(1)

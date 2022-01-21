#!/bin/sh
IP_ADDRESS=$(curl -s https://twa.ninja/ip.php)
ip=$(echo $IP_ADDRESS | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b")
COMMAND_FRONT='ssh -i ~/keyfiles/Time-Pi_rsa tim@'
COMMAND_END=' -p 27515'
echo $IP_ADDRESS > /home/tim/ip/current_ip.txt
echo $COMMAND_FRONT$ip$COMMAND_END > /home/tim/ip/Time-Pi-login.ps
scp -P 27514 -i ~/keyfiles/ip_twa.ninja_rsa /home/tim/ip/current_ip.txt ip@twa.ninja:/home/ip/tp_ip.txt
scp -P 27514 -i ~/keyfiles/ip_twa.ninja_rsa /home/tim/ip/Time-Pi-login.ps ip@twa.ninja:/home/ip/tplogin.ps

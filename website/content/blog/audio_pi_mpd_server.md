+++
title = "Audio Pi - MPD Server"
date = "2025-09-13"
slug = "audio_pi_mpd_server"

[extra]
image = "/files/audio_pi_mpd_server/pimpd.png"
blurb = "I recently (alright, fine, it was over 2 years ago, and I'm just now getting around to setting it up) decided I wanted to add a Music Player Daemon (MPD) server on a rapberry Pi to my whole-home Audio setup. I'm feeding the Pi's audio into a [Monoprice 6-Zone Home Audio Multizone Controller and Amplifier Kit](https://www.monoprice.com/product?p_id=10761) (which was only $600 when I bought one a few years back, crazy). I had a Raspberry Pi 4B lying around, and I also purchased an [Allo Boss DAC audio hat](https://www.amazon.com/dp/B07D13QWV9) for the Pi. I'm just going to write a blog post of the things I had to modify and work through to get everything set up and working, so if anyone else wants to do the same (or I want to remember how this thing works in a few years) there's some more recent data out there to help out."
+++

I recently (alright, fine, it was over 2 years ago, and I'm just now getting around to setting it up) decided I wanted to add a Music Player Daemon (MPD) server on a rapberry Pi to my whole-home Audio setup. I'm feeding the Pi's audio into a [Monoprice 6-Zone Home Audio Multizone Controller and Amplifier Kit](https://www.monoprice.com/product?p_id=10761) (which was only $600 when I bought one a few years back, crazy). I had a Raspberry Pi 4B lying around, and I also purchased an [Allo Boss DAC audio hat](https://www.amazon.com/dp/B07D13QWV9) for the Pi. I'm just going to write a blog post of the things I had to modify and work through to get everything set up and working, so if anyone else wants to do the same (or I want to remember how this thing works in a few years) there's some more recent data out there to help out.

I opted to use a headless OS with no desktop environment, and I Installed Raspberry Pi OS Lite (64 Bit) onto the Pi using the [Raspberry Pi Imager](https://www.raspberrypi.com/software/). I'm going to skip over the RPi setup, as there are planty of other guides on hwo to connect to your headless Pi via ssh. Once I was logged in, I first updated packages and installed `mpd` using apt.

```bash
sudo apt update
sudo apt upgrade
sudo apt install mpd
```

Once that was installed, I then set up firewall rules to only allow inbound connections from my local subnet to ports 22 (ssh), 80 (web gui), and 6600 (mpd server) and drop all other incoming traffic. Now I just had to get the audio hat set up and working with the OS so it could output sound. I added the following to the `/boot/firmware/config.txt` file:

```ini
[all]
dtoverlay=allo-boss-dac-pcm512x-audio
```

Other guides I found still referred to this file as `/boot/config.txt`, but RPOS has moved it to the new location above. Once that was updated, I rebooted, and ran `aplay -L` which had new entries for the BossDAC as follows:

```
$ aplay -L
...
hw:CARD=BossDAC,DEV=0
    BossDAC, Boss DAC HiFi [Master] pcm512x-hifi-0
    Direct hardware device without any conversions
plughw:CARD=BossDAC,DEV=0
    BossDAC, Boss DAC HiFi [Master] pcm512x-hifi-0
    Hardware device with all software conversions
sysdefault:CARD=BossDAC
    BossDAC, Boss DAC HiFi [Master] pcm512x-hifi-0
    Default Audio Device
dmix:CARD=BossDAC,DEV=0
    BossDAC, Boss DAC HiFi [Master] pcm512x-hifi-0
    Direct sample mixing device
...
```

Once the BossDAC shows up in aplay, you can `cat /proc/asound/cards` and you should see something like the following. Note the device number as you'll need it for the next step. In my case it was `1`.

```
$ cat /proc/asound/cards
 0 [Headphones     ]: bcm2835_headpho - bcm2835 Headphones
                      bcm2835 Headphones
 1 [BossDAC        ]: BossDAC - BossDAC
                      BossDAC
 2 [vc4hdmi0       ]: vc4-hdmi - vc4-hdmi-0
                      vc4-hdmi-0
 3 [vc4hdmi1       ]: vc4-hdmi - vc4-hdmi-1
                      vc4-hdmi-1
```

Next I had to edit (or possible create, I don't remember) `/etc/asound.conf` to contain the following line of text:

```
pcm.!default { type hw card 1 } ctl.!default { type hw card 1 }
```

Note there were 2 places where I had to input the number from `/proc/asound/cards` above, in my case `1`. Once this is done, reboot once more, and then run `sudo raspi-config` and select `System Options` then `Audio`, and finallt select `BossDAC` as your default output device, and reboot yet again. At this point, you need to add the sound card to the mpd config file. Edit `/etc/mpd.conf` to include the following:

```
audio_output {
        type            "alsa"
        name            "pcm512x-hifi-0"
        device          "plughw:CARD=BossDAC,DEV=0" 
        mixer_type      "software"
        mixer_device    "dmix:CARD=BossDAC,DEV=0"   
        mixer_control   "Digital"
#       mixer_index     "0"             # optional
}
```

I used the device names instead of the hardware numbers, as it worked even if the devices loaded in a different order on subsequent reboots. You should now be ready to fire up the mpd daemon. If you want it to start on boot and remain on all the time (I did) you can `sudo systemctl enable mpd`, or you can manually start and stop it using `sudo systemctl start mpd` and `sudo systemctl stop mpd`. For mpd to play songs, you need to add them to the `music` folder from your config. The default is `/var/lib/mpd/music/`, but I ended up just mounting my music folder from my NAS in that location rather than keep the files locally on the Pi. `mpd` is also just the back end, so it will need another program to control it and tell it what to play. For initial testing, I used mpc, a command line tool for exactly this purpose, which was installed via `sudo apt install mpc`. You can run `mpc update` to get it to update mpd's database to include the song files in your `music` folder and subdirectories. Once that is done, you can `mpc add /` to add all the songs to a playlist, and then all you need to do is `mpc play` to start playing the songs.

At this point, I was finally able to hear songs play through the audio hat, so it was time to install a web gui to allow me to control the music playing from any web browser on my home network. I tested a few options, but I settled on myMPD for my web gui of choice. To set this up, I just used their docker container. I installed docker per the [instructions on the docker website](https://docs.docker.com/engine/install/debian/), and once it was running I set up the following compose file at `~/mympd/compose.yml`:

```yaml
services:
  mympd:
    image: ghcr.io/jcorporation/mympd/mympd
    container_name: mympd
    ports:
      - 80:8080
    user: 1000:1000
    environment:
      - UMASK_SET=022
      - MYMPD_SSL=false
      - MYMPD_HTTP_PORT=8080
    volumes:
      - /run/mpd:/run/mpd
      ## Optional for myGPIOd support
      ## - /run/mygpiod:/run/mygpiod
      - /docker/mympd/workdir:/var/lib/mympd
      - /docker/mympd/cachedir:/var/cache/mympd
      - /var/lib/mpd/music:/var/lib/mpd/music:ro
      - /var/lib/mpd/playlists:/var/lib/mpd/playlists:ro
    restart: unless-stopped
 ```

 Then all I had to do was run `docker compose up -d` in the `~/mympd/` directory, and I was able to see my entire song library, edit playlists and the play queue, and control all my audio from any web browser. I also found I prefered the [MPDCtrl](https://github.com/torum/MPDCtrl) player to the web gui when I was on my desktop, but I still use myMPD on my phones and tablets.

 I did notice one shortcoming with all of the implementations I'd tried, and that was that they expected you to manually update the queue for anything you wanted to play. Prior to this, my preferred setup was to always have an 'all songs' playlist available, but myMPD's interface was unable to add over 10,000 songs to the queue at once when I selected every album manually, and mpc could add everything to the playlist, but it was sorted by file path and not in any coherent way according to the tags on the song files. No worries, this is why god invented Python and LLMs. I fired up assistant.kagi.com and managed to bungle together a script that would automatically generate a playlist file containing all of my songs sorted as I preferred them (see attached script below). I then set this script up as a cron along with an `mpc update` cron that ran an hour after it so it would automatically ingest any new songs added to the `music` folder every night and update the playlist in mpd to the new file, and update my all songs playlist to include them. It can, of course, be run manually as well, if you just can't wait. Though it does take a while if you've got a lot of song files.

 ```
0 3 * * * python /home/tim/playlist_generator.py /var/lib/mpd/nas_music/ /var/lib/mpd/playlists/all_songs.m3u
0 4 * * * mpc update
 ```

 ### Addendum 2025-11-08:

 I ended up having some trouble with the mpd service starting before the NAS song files were mounted whent he device rebooted, so I changed the mount point to a new folder that doesn't exist on the base filesystem in the config (`/var/lib/mpd/nas_music/`) and I also had to add the following to the `[Unit]` section of my mpd service config file at `/lib/systemd/system/mpd.service` to make sure that it would not try to run the mpd service until the network mount was up. This makes sure that mpd will not try to start before the song file mount is available.

 ```
After=network.target sound.target
RequireMountsFor=/var/lib/mpd/nas_music/
 ```

<h3>Download Files:</h3>
<div class="post-file">
<a href="/files/audio_pi_mpd_server/playlist_generator.py" target="_blank">playlist_generator.py</a>
</div>
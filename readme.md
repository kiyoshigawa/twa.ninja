# twa.ninja Website
This is a repo where I store the twa.ninja website code, as well as the docker server config files that I use to host it on my server.

To see the live website, just go to https://twa.ninja/

In order to run this website on the server, you'll first need to have a server with docker, and appropriate firewall and port forwarding rules for ports 80 and 443 that direct web traffic to the server. The server is currently set up for the domains `twa.ninja` and `www.twa.ninja` and should automatically renew letsencrypt certificates once initially configured using the instructions below.

I used https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71 and https://github.com/gilyes/docker-nginx-letsencrypt-sample/ as the basis for this setup, and adjusted it to fit my specific situation.

First, you'll need to set up some files on the host server so that the docker container can access them to host the website and set up certbot for letsencrypt. I've opted to place all the relevant files in `~/twa.ninja/`, which can be easily accomplished by cloning this repo into that directory. The `docker-compose.yml` and `init-letsencrypt.sh` files in the server_config folder of this repo reflect that file path explicitly. If you want to use different paths, then you'll need to update all path references in those files to match. It's also a good idea to read through the `init-letsencrypt.sh` file and make sure that all the options are correct. It's a good idea to set the staging variable to 1 in the init script, so you don't go over the letsencrypt rate limits until you've got everything else configured properly.

Once the files are in place and paths are updated as needed, you will need to generate some dummy certificates in order to start the nginx docker container, which will then need to be replaced with the actual letsencrypt certs. To do this simply run the `init-letsencrypt.sh` script. I'm using non-relative file paths, so where you run it won't matter, as long as you properly updated all the file paths as noted above.

Once you've initialized everything using the script, you can then use whatever method you prefer to spin up the docker containers at will going forward. The config has the docker containers automatically renew and update the certs while the containers are running. If you run `docker-compose up` in the server_config directory, it will manually start them, however I prefer to use Portainer to manage the stack by feeding it the docker-compose.yml file after everything is initialized. You may need to kill the server instances after the init script runs in order to get them to work in Portainer. 

# Automatic Server Config with Terraform and Ansible

The files in this folder will be able to automatically set up a web server for my website on my proxmox server. In order to get it to actually work, there's a couple steps you will need to do first. The first step is to save a copy of the `example.tfvars` file as a new file names `local.tfvars` and provide valid credentials for the variables within. Note that you will need to have the ssh keys used in the `local.tfvars` file properly set up on your host computer for ansible to work as currently configured.

Once you've got a valid `local.tfvars` file, you need to run `terraform init` in the `/server_config/tf/` directory to install the proxmox plugin required to make terraform work.

After that, you need to run the following commands to set up the lxc containers on proxmox. Note that this will install the ssh keys in `local.tfvars` onto the lxc, which will be required for ssh authentication. If that key is not valid, you won't be able to provision the lxc using ansible in the future.

### Terraform Setup Commands
```bash
terraform init
terraform validate
terraform plan -out local.plan -var-file local.tfvars
terraform apply local.plan
```

After the LXC has been set up by terraform, you can use ansible to provision the server. You will need to have ansible installed on the host, and then you can run the following commands in the `/server_config/ansible/` to verify that you can connect to the new web server lxc, and then to provision the server and set up the website, including nginx, and letsencrypt.

If you are using WSL as the ansible host, the default configuration is for the ansible directory to be world-writable when mounted. This causes ansible to ignore the `ansible.cfg` file by default for security reasons. In order to get the `ansible.cfg` file to be read (allowing the default user to match the configs), you will need to manually add an environment variable to allow use of the file before running commands: `export ANSIBLE_CONFIG=ansible.cfg`

### Ansible Setup Commands
```bash
ansible all -i inventory -m ping
ansible-playbook provision.yaml -i inventory
```

With this done, the web server should be configured and running, and assuming that the firewall is correctly allowing access to the server, the website should be accessible from any browser.

### Updating the Website Using Ansible
If you've made a new commit to this website repo, you can automatically update the website with ansible using the following commands.
```bash
ansible-playbook update.yaml -i inventory
```

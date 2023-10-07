# Automatic Server Configuration using Terraform and Ansible

The files in this folder will be able to automatically set up a web server for my website on my proxmox server. In order to get it to actually work, there's a couple steps you will need to do first. The first step is to save a copy of the `example.tfvars` file as a new file names `local.tfvars` and provide valid credentials for the variables within. Note that you weill need to have the ssh keys used in the `local.tfvars` file properly set up on your host computer for ansible to work as configured in this repo.

Once you've got a valid local.tfvars file, you need to run `terraform init` in the `/server_config/tf/` directory to install the proxmox plugin required to make all of this work.

After that, you need to run the following commands to set up the lxc containers on proxmox.

```bash
terraform validate
terraform plan -out local.plan -var-file local.tfvars
terraform apply local.plan
```
After the LXC has been set up by terraform (assuming your ssh keys are correctly installed on the host system), you can use ansible to provision the server. You will need to have ansible installed on the host, and then you can run the following commands in the `/server_config/ansible/` to verify that you can connect to the new web server lxc, and then to provision the server and set up the website, including nginx, and letsencrypt.

```bash
ansible all -i inventory -m ping
ansible-playbook provision.yaml -i inventory
```

With this done, the web server should be configured and running, and assuming your firewall is correctly allowing access, the website should be accessible from any browser.

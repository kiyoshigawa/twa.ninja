# Automatic Server Configuration using Terraform

The files in this folder will be able to automatically set up a web server for my website on my proxmox server. In order to get it to actually work, there's a couple steps you will need to do first. The first step is to save a copy of the `example.tfvars` file as a new file names `local.tfvars` and provide valid credentials for the variables within.

Once you've got a valid local.tfvars file, you need to run `terraform init` to install the proxmox plugin required to make all of this work.

After that, you need to run the following commands to set up the lxc containers on proxmox, and assuming the firewall is correctly configured to allow incoming connections, the website will then be available immediately.

```bash
terraform validate
terraform plan -out local.plan -var-file local.tfvars
terraform apply local.plan
```

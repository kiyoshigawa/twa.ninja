# Automatic Server Config

This directory contains everything needed to set up and maintain the web server for twa.ninja on a Proxmox host. The setup runs on a local machine and uses:

- **OpenTofu** — provisions the LXC container on Proxmox
- **Ansible** — configures the container (nginx, certbot, firewall, Zola, etc.)

## Prerequisites

These steps need to be done once per local machine and once per Proxmox host.

### 1. Install mise

[mise](https://mise.jdx.dev) is a dev tools version manager used to manage all the tools needed for this project.

Check if mise is already installed:

```bash
mise --version
```

If not installed, download and run the install script, then follow the post-install instructions it prints:

```bash
curl https://mise.jdx.dev/install.sh | sh
```

Add mise to your shell (the installer will print the exact line needed), then restart your shell or run `eval "$(~/.local/bin/mise activate)"`.

### 2. Install project tools

From the root of this repository, run the following to install Python, pipx, Ansible, and OpenTofu as project-local tools:

```bash
cd /path/to/twa.ninja
mise use python@3.12
mise use pipx@latest
mise use ansible@latest
mise use opentofu@latest
```

This creates a `mise.toml` file in the repo root so the tools auto-activate whenever you `cd` into this directory. Verify everything installed correctly:

```bash
python3 --version
pipx --version
ansible --version
tofu --version
```

You should see Python 3.12.x, pipx 1.x, Ansible 14.x, and OpenTofu 1.11.x (versions may differ).

### 3. Generate SSH key pair

Ansible connects to the LXC via SSH. Generate an ed25519 key pair:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/your_key_name_here -N "" -C "your@email.com"
```

Choose a descriptive filename (e.g. `proxmox_id_ed25519`). The public key (`your_key_name.pub`) will be added to the LXC during OpenTofu provisioning so Ansible can log in.

### 4. Proxmox host setup

These steps are run in the Proxmox host's root shell (via web UI console or SSH).

#### 4a. Create API token for OpenTofu

OpenTofu needs an API token to manage LXCs. Create a dedicated user, role, and token:

```bash
# Add a service user
pveum user add terraform@pve

# Create a role with the privileges needed for LXC management
pveum role add Terraform -privs "VM.Allocate VM.Audit VM.Clone VM.Config.Disk VM.Config.CPU VM.Config.Memory VM.Config.Network VM.Config.Options VM.PowerMgmt Datastore.Allocate Datastore.AllocateSpace Datastore.AllocateTemplate Datastore.Audit Pool.Allocate Sys.Audit Sys.Console Sys.Modify SDN.Use"

# Grant the role to the user at the root level
pveum acl modify / -user terraform@pve -role Terraform

# Generate a token (save the output — it won't be shown again)
pveum user token add terraform@pve provider --privsep=0
```

If a command later fails with a permission error, update the role to add the missing privilege and retry.

#### 4b. Download the Debian LXC template

```bash
# Check available templates
pveam available | grep debian-13

# Download the template to the correct storage
pveam download storage debian-13-standard_13.1-2_amd64.tar.zst
```

### 5. Create local.tfvars

Copy `server_config/tf/example.tfvars` to `server_config/tf/local.tfvars` and fill in:

- **Proxmox API URL** and **API token** (from step 4a)
- **LXC root password** (for emergency console access)
- **SSH public key** (from step 3)
- **Proxmox node name**, **storage pool**, and **network bridge**

```bash
cp server_config/tf/example.tfvars server_config/tf/local.tfvars
```

Edit `local.tfvars` with your values. This file is gitignored and must never be committed.

## Creating the LXC Container

All OpenTofu commands are run from the `server_config/tf/` directory.

### Initialize OpenTofu

Downloads the bpg/proxmox provider plugin and sets up the backend:

```bash
cd server_config/tf
tofu init
```

### Validate the configuration

Checks that the config files are syntactically correct:

```bash
tofu validate
```

### Preview the changes

Shows what resources will be created without actually making them:

```bash
tofu plan -var-file local.tfvars
```

Review the output. It should show one resource to add: `proxmox_virtual_environment_container.twa_web`.

### Create the LXC

```bash
tofu apply -var-file local.tfvars
```

Type `yes` when prompted. If creation hangs for a long time, ctrl-C to end it and check the error. I ran into permission errors on the api user, which can be added/updated with the role add command above from step 4a.

### Verify the LXC

From the Proxmox host, check the container is running and has network access:

```bash
pct enter 201
ip addr show veth0   # should show 192.168.2.7/24 (or whatever you set it to in local.tfvars and the ansible inventory file)
ping -c 3 192.168.2.1 # this is the gateway IP
```

Exit the container with `exit` or Ctrl+D.

### Cleanup (if something goes wrong)

If OpenTofu times out or errors during create, clean up on the Proxmox host first:

```bash
pct stop <VMID>
pct destroy <VMID>
```

Then locally, delete the broken state and retry:

```bash
rm -f terraform.tfstate*
tofu apply -var-file local.tfvars
```

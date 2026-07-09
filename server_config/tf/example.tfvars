# Copy this file to local.tfvars and replace the values with your actual credentials.
# Never commit local.tfvars to git.

# Proxmox API endpoint (your Proxmox host IP)
pm_api_url    = "https://192.168.1.4:8006"

# API token in the format: user@realm!tokenid=secret
pm_api_token  = "terraform@pve!provider=your-token-secret"

# Set to true if using a self-signed Proxmox TLS certificate
pm_tls_insecure = true

# LXC root password (for emergency console access)
lxc_password = "your-password"

# SSH public key for Ansible to authenticate to the LXC
ssh_keys     = "ssh-ed25519 AAAA... your-public-key"

# Proxmox node name
pm_node_name = "your-proxmox-node"

# Storage pool for the LXC root disk
pm_storage   = "your-storage-pool"

# LXC network bridge
pm_bridge    = "vmbr1"

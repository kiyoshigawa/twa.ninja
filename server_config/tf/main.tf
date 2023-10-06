terraform {
  required_providers {
    proxmox = {
      source  = "Telmate/proxmox"
      version = "2.9.14"
    }
  }
}

provider "proxmox" {
  pm_api_url      = var.pm_url
  pm_tls_insecure = true
  pm_user         = var.pm_user
  pm_password     = var.pm_password
  pm_log_file     = "terraform_proxmox.log"
  pm_log_enable   = false
  pm_debug        = false
  pm_log_levels   = {
    _default      = "false"
    _capturelog   = ""
  }
}

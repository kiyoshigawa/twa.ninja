resource "proxmox_virtual_environment_container" "twa_web" {
  node_name     = var.pm_node_name
  vm_id         = 201
  unprivileged  = true
  start_on_boot = true

  features {
    nesting = true
  }

  initialization {
    hostname = "twa-web"

    dns {
      domain  = "timternet.local"
      servers = ["192.168.1.1"]
    }

    ip_config {
      ipv4 {
        address = "192.168.2.7/24"
        gateway = "192.168.2.1"
      }
    }

    user_account {
      password = var.lxc_password
      keys     = [var.ssh_keys]
    }
  }

  network_interface {
    name   = "veth0"
    bridge = var.pm_bridge
  }

  disk {
    datastore_id = var.pm_storage
    size         = 20
  }

  memory {
    dedicated = 2048
  }

  operating_system {
    template_file_id = "storage:vztmpl/debian-13-standard_13.1-2_amd64.tar.zst"
    type             = "debian"
  }
}

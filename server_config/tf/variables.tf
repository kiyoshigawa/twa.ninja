variable "lxc_debian_12" {
  default = "hddpool-zfs:vztmpl/debian-12-standard_12.0-1_amd64.tar.zst"
}

variable "pm_url" {}
variable "pm_user" {}
variable "pm_password" {}

variable "lxc_password" {}
variable "ssh_keys" {}

variable "datastore_name" {
  default     = "hddpool-zfs"
  description = "name of datastore for storing images and local data"
}

variable "lxcs" {
  type = map(object(
    {
      hostname        = string
      vmid            = string
      searchdomain    = string
      nameserver      = string
      node_name       = string
      cores           = string
      memory          = string
      keyctl          = optional(bool, null)
      unprivileged    = optional(bool, true)
      nesting         = optional(bool, null)
      mount           = optional(string, null)
      storage         = string
      rootfs_size     = string
      password        = optional(string, null)
      network         = optional(list(object({
        name   = string
        bridge = string
        ip     = string
        gw     = optional(string)
        hwaddr = optional(string)
      })), [])
      mountpoint  = optional(list(object({
        slot    = string
        key     = string
        storage = string
        mp      = string
        size    = string
      })), [])
      inline          = list(string)
    }
  ))
  default = {
    "twa-web" = {
      hostname     = "twa-web"
      vmid         = "201"
      searchdomain = "timternet.local"
      nameserver   = "192.168.1.1"
      node_name    = "TimeMox"
      cores        = "0"
      memory       = "2048"
      keyctl       = true
      unprivileged = true
      nesting      = true
      storage      = "hddpool-zfs"
      rootfs_size  = "20G"
      network      = [{
        name   = "eth0"
        bridge = "vmbr0"
        ip     = "dhcp"
        hwaddr = "22:c6:ad:f5:1d:fd"
      }]
      inline   = [
        "apt update",
        "apt install software-properties-common",
        "apt-add-repository ppa:ansible/ansible",
        "apt update && sudo apt install -y ansible",
        "apt upgrade -y"
      ]
    },
  }
}

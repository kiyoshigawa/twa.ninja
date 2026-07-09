variable "pm_api_url" {}
variable "pm_api_token" {}
variable "pm_tls_insecure" {
  default = true
}
variable "lxc_password" {}
variable "ssh_keys" {}
variable "pm_node_name" {
  default = "time-proxmox"
}
variable "pm_storage" {
  default = "zfs-2x2-stripe"
}
variable "pm_bridge" {
  default = "vmbr1"
}

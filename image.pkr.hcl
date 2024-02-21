packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "my-custom-image" {
  project_id              = "dev-alijahh"
  source_image_family     = "centos-stream-8"
  zone                    = "us-central1-a"
  disk_size               = 100
  disk_type               = "pd-standard"
  image_name              = "csye6225-{{timestamp}}"
  image_description       = "CSYE 6225 APP Custom Image at {{timestamp}}"
  image_family            = "csye6225-app-image"
  image_project_id        = "dev-alijahh"
  image_storage_locations = ["us"]
  ssh_username            = "packer"
}


build {

  sources = ["sources.googlecompute.my-custom-image"]

   provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }
  provisioner "shell" {
    script = "setup.sh"
  }
 
}




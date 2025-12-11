variable "region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Existing EC2 Key Pair Name"
}

variable "docker_image" {
  default = "aksah22/hospital-app:latest"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas URI"
}

variable "session_secret" {
  default = "mysecretkey"
}

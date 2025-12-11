provider "aws" {
  region = var.region
}

# ✔ 1. Fetch latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# ✔ 2. Create Key Pair from your local hospital-key.pub
resource "aws_key_pair" "hospital_key" {
  key_name   = "hospital-key"
  public_key = file("hospital-key.pub")
}

# ✔ 3. Create Security Group
resource "aws_security_group" "hospital_sg" {
  name = "hospital-app-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ✔ 4. Create EC2 Instance
resource "aws_instance" "hospital_ec2" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.hospital_key.key_name   # FIXED
  vpc_security_group_ids = [aws_security_group.hospital_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    amazon-linux-extras install docker -y
    systemctl start docker
    systemctl enable docker

    docker pull ${var.docker_image}

    docker run -d -p 80:3000 \
      -e MONGODB_URI="${var.mongodb_uri}" \
      -e SESSION_SECRET="${var.session_secret}" \
      --name hospital-app \
      ${var.docker_image}
  EOF

  tags = {
    Name = "Hospital-App-Server"
  }
}

# ✔ 5. OUTPUTS
output "public_ip" {
  value = aws_instance.hospital_ec2.public_ip
}

output "public_dns" {
  value = aws_instance.hospital_ec2.public_dns
}

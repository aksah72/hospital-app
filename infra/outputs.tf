output "public_ip" {
  value = aws_instance.hospital_ec2.public_ip
}

output "public_dns" {
  value = aws_instance.hospital_ec2.public_dns
}

# Auto-discover subnets from the VPC
data "aws_subnets" "selected" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
}

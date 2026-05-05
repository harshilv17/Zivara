variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  default     = "zivara"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
  default     = "vpc-052a63be97f1d6ed8"
}

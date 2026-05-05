variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  default     = "zivara"
}

variable "subnet_ids" {
  description = "List of subnet IDs for EKS and ECS"
  type        = list(string)
  default     = ["subnet-xxxxxx", "subnet-yyyyyy"]
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
  default     = "vpc-xxxxxx"
}

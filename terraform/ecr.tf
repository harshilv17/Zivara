# Use data sources to reference existing ECR repos (idempotent)
data "aws_ecr_repository" "backend" {
  name = "${var.project_name}-backend"
}

data "aws_ecr_repository" "frontend" {
  name = "${var.project_name}-frontend"
}

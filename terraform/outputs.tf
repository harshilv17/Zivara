output "s3_bucket_name" {
  value = aws_s3_bucket.app_assets.bucket
}

output "ecr_repository_url_backend" {
  value = data.aws_ecr_repository.backend.repository_url
}

output "ecr_repository_url_frontend" {
  value = data.aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "eks_cluster_name" {
  value = aws_eks_cluster.main.name
}

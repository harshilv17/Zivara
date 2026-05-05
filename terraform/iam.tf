# Reference the existing AWS Academy LabRole instead of creating custom roles.
# AWS Academy lab accounts do not have iam:CreateRole permissions.
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

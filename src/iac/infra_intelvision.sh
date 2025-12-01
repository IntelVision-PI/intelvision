#!/bin/bash
KEY_NAME="servicekey123"
SECURITY_GROUP_NAME="launch-wizard-42"
INSTANCE_NAME="web-server-01"
IMAGE_ID="ami-0360c520857e3138f"
INSTANCE_TYPE="t2.small"
REGION="us-east-1"
export AWS_ACCESS_KEY_ID="[Seu Access Key Aqui]"
export AWS_SECRET_ACCESS_KEY="[Seu Secret Access Key Aqui]"
export AWS_SESSION_TOKEN="[Seu Session Token aqui]"
export AWS_DEFAULT_REGION="$REGION"
export AWS_DEFAULT_OUTPUT="json"

echo "** Inicializando Infra IntelVision **"

VPC_ID=$(aws ec2 describe-vpcs --query "Vpcs[0].VpcId" --output text --region $REGION)
echo "VPC: $VPC_ID"

SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[0].SubnetId" --output text --region $REGION)
echo "Subnet: $SUBNET_ID"

if (aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region $REGION > /dev/null 2>&1)
then
  echo "Não é necessário criar uma nova chave com nome '$KEY_NAME'."
else
  echo "Criando nova chave SSH"
  aws ec2 create-key-pair --key-name "$KEY_NAME" --region $REGION --query 'KeyMaterial' --output text > "${KEY_NAME}.pem"
  chmod 400 "${KEY_NAME}.pem"
  echo "Chave criada e salva como ${KEY_NAME}.pem"
fi

SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SECURITY_GROUP_NAME" --query "SecurityGroups[0].GroupId" --output text --region $REGION 2>/dev/null)

if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]
then
  echo "Criando SG: '$SECURITY_GROUP_NAME'"
  SG_ID=$(aws ec2 create-security-group --group-name "$SECURITY_GROUP_NAME" --vpc-id "$VPC_ID" --description "Grupo de Seguranca IntelVision" --region $REGION --query "GroupId" --output text)
  
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $REGION
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 3333 --cidr 0.0.0.0/0 --region $REGION
else
  echo "Usando SG: $SG_ID"
fi

echo "Criando buckets S3"

for s3 in raw trusted client
do
  BUCKET_NAME="$s3-$(date +%Y%m%d%H%M%S)"
  echo "Criando bucket: $BUCKET_NAME"
  
  if aws s3 mb "s3://$BUCKET_NAME" --region $REGION > /dev/null 2>&1
  then
    echo "Bucket $BUCKET_NAME criado com sucesso"
  else
    echo "Falha ao criar bucket $BUCKET_NAME"
  fi
done

echo "Buckets criados com sucesso!"


aws ec2 run-instances --image-id "$IMAGE_ID" --instance-type "$INSTANCE_TYPE" --count 1 --key-name "$KEY_NAME" --security-group-ids "$SG_ID" --subnet-id "$SUBNET_ID" --block-device-mappings "[{\"DeviceName\":\"/dev/sda1\",\"Ebs\":{\"VolumeSize\":20,\"VolumeType\":\"gp3\",\"DeleteOnTermination\":true}}]" --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" --region $REGION --no-cli-pager

echo "** Infra IntelVision finalizado **"
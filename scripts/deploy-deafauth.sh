#!/bin/bash

# DeafAUTH Deployment Script
# GCP Project: mbtq.dev

set -e

echo "🚀 Deploying DeafAUTH Universal Authentication System"

# Set GCP project
gcloud config set project mbtq.dev

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t gcr.io/mbtq.dev/deafauth-api:latest services/deafauth-api/
docker push gcr.io/mbtq.dev/deafauth-api:latest

# Apply Terraform infrastructure
echo "🏗️ Provisioning GCP infrastructure..."
cd gcp-infrastructure/terraform
terraform init
terraform plan
terraform apply -auto-approve

# Deploy to GKE
echo "☸️ Deploying to Kubernetes..."
gcloud container clusters get-credentials deafauth-cluster --zone=us-central1

kubectl apply -f ../deafauth-deployment.yaml

# Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/deafauth-api

# Get external IP
EXTERNAL_IP=$(kubectl get service deafauth-api-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "🌐 DeafAUTH API available at: http://$EXTERNAL_IP"

# Update DNS records
echo "🔗 Updating DNS records..."
gcloud dns record-sets transaction start --zone=deafauth-zone
gcloud dns record-sets transaction add $EXTERNAL_IP --name=api.deafauth.mbtq.dev. --ttl=300 --type=A --zone=deafauth-zone
gcloud dns record-sets transaction execute --zone=deafauth-zone

echo "✅ DeafAUTH deployment complete!"
echo "🔗 API Endpoint: https://api.deafauth.mbtq.dev"
echo "📊 Admin Panel: https://admin.deafauth.mbtq.dev"
echo "🌐 CDN: https://cdn.deafauth.mbtq.dev"

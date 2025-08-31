#!/bin/bash

# Deploy MBTQ Deaf-First AI Ecosystem
# GCP Project: mbtq.dev

echo "🚀 Deploying MBTQ Deaf-First AI Ecosystem..."

# Set GCP project
gcloud config set project mbtq.dev

# Enable required APIs
echo "📡 Enabling GCP APIs..."
gcloud services enable \
  container.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  pubsub.googleapis.com \
  storage.googleapis.com \
  aiplatform.googleapis.com \
  redis.googleapis.com

# Create GKE cluster for the ecosystem
echo "☸️ Creating GKE cluster..."
gcloud container clusters create mbtq-ecosystem \
  --zone=us-central1-a \
  --num-nodes=5 \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=10 \
  --machine-type=e2-standard-4

# Get cluster credentials
gcloud container clusters get-credentials mbtq-ecosystem --zone=us-central1-a

# Create namespaces
echo "🏗️ Creating namespaces..."
kubectl create namespace deafauth
kubectl create namespace magicians360
kubectl create namespace pinksync
kubectl create namespace mbtq-platform
kubectl create namespace mbtquniverse

# Deploy DeafAUTH Universal Identity
echo "🔐 Deploying DeafAUTH..."
kubectl apply -f gcp-infrastructure/deafauth-deployment.yaml -n deafauth

# Deploy 360magicians Vertex AI Hub
echo "🎨 Deploying 360magicians..."
kubectl apply -f gcp-infrastructure/360magicians-deployment.yaml -n magicians360

# Deploy PinkSync Accessibility Middleware
echo "🔄 Deploying PinkSync..."
kubectl apply -f gcp-infrastructure/pinksync-deployment.yaml -n pinksync

# Deploy MBTQ Platform (v0 + Gemini)
echo "🏠 Deploying MBTQ Platform..."
kubectl apply -f gcp-infrastructure/mbtq-platform-deployment.yaml -n mbtq-platform

# Deploy MBTQ Universe (DAO + Web3)
echo "🌌 Deploying MBTQ Universe..."
kubectl apply -f gcp-infrastructure/mbtquniverse-deployment.yaml -n mbtquniverse

# Set up Firestore databases
echo "🔥 Setting up Firestore..."
gcloud firestore databases create --database=deafauth-profiles --location=us-central1
gcloud firestore databases create --database=accessibility-cache --location=us-central1
gcloud firestore databases create --database=dao-governance --location=us-central1

# Set up Redis for caching
echo "⚡ Setting up Redis..."
gcloud redis instances create deafauth-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_6_x

# Set up Pub/Sub topics
echo "📡 Setting up Pub/Sub..."
gcloud pubsub topics create deafauth-events
gcloud pubsub topics create accessibility-transforms
gcloud pubsub topics create dao-governance
gcloud pubsub topics create ai-processing

# Set up Cloud Storage buckets
echo "📦 Setting up Cloud Storage..."
gsutil mb gs://mbtq-deafauth-assets
gsutil mb gs://mbtq-accessibility-cache
gsutil mb gs://mbtq-ai-models
gsutil mb gs://mbtq-showcase-projects

# Set up SSL certificates
echo "🔒 Setting up SSL certificates..."
gcloud compute ssl-certificates create deafauth-ssl \
  --domains=deafauth.mbtq.dev,api.deafauth.mbtq.dev,admin.deafauth.mbtq.dev

gcloud compute ssl-certificates create ecosystem-ssl \
  --domains=360magicians.com,pinksync.io,mbtq.dev,mbtquniverse.com

# Set up load balancers
echo "⚖️ Setting up load balancers..."
kubectl apply -f gcp-infrastructure/ingress-config.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment --all -n deafauth
kubectl wait --for=condition=available --timeout=300s deployment --all -n magicians360
kubectl wait --for=condition=available --timeout=300s deployment --all -n pinksync
kubectl wait --for=condition=available --timeout=300s deployment --all -n mbtq-platform
kubectl wait --for=condition=available --timeout=300s deployment --all -n mbtquniverse

# Get external IPs
echo "🌐 Getting external IPs..."
kubectl get services --all-namespaces -o wide

echo "✅ MBTQ Deaf-First AI Ecosystem deployed successfully!"
echo ""
echo "🔗 Access URLs:"
echo "   DeafAUTH: https://deafauth.mbtq.dev"
echo "   360magicians: https://360magicians.com"
echo "   PinkSync: https://pinksync.io"
echo "   MBTQ Platform: https://mbtq.dev"
echo "   MBTQ Universe: https://mbtquniverse.com"
echo ""
echo "🤟 Your deaf-first AI ecosystem is now live!"

# DeafAUTH GCP Infrastructure
# Project: mbtq.dev

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "mbtq.dev"
  region  = "us-central1"
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "container.googleapis.com",
    "cloudbuild.googleapis.com",
    "firestore.googleapis.com",
    "pubsub.googleapis.com",
    "storage.googleapis.com",
    "redis.googleapis.com",
    "cloudrun.googleapis.com",
    "dns.googleapis.com"
  ])
  
  service = each.value
  disable_on_destroy = false
}

# GKE Cluster for DeafAUTH
resource "google_container_cluster" "deafauth_cluster" {
  name     = "deafauth-cluster"
  location = "us-central1"
  
  remove_default_node_pool = true
  initial_node_count       = 1
  
  network    = google_compute_network.deafauth_network.name
  subnetwork = google_compute_subnetwork.deafauth_subnet.name
}

resource "google_container_node_pool" "deafauth_nodes" {
  name       = "deafauth-node-pool"
  location   = "us-central1"
  cluster    = google_container_cluster.deafauth_cluster.name
  node_count = 2
  
  node_config {
    preemptible  = false
    machine_type = "e2-medium"
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

# Firestore Database
resource "google_firestore_database" "deafauth_db" {
  project     = "mbtq.dev"
  name        = "deafauth-profiles"
  location_id = "us-central"
  type        = "FIRESTORE_NATIVE"
}

# Redis Instance
resource "google_redis_instance" "deafauth_cache" {
  name           = "deafauth-cache"
  memory_size_gb = 1
  region         = "us-central1"
  
  redis_version = "REDIS_6_X"
  display_name  = "DeafAUTH Cache"
}

# Cloud Storage Buckets
resource "google_storage_bucket" "deafauth_assets" {
  name     = "deafauth-assets-mbtq-dev"
  location = "US"
  
  cors {
    origin          = ["https://deafauth.mbtq.dev", "https://*.mbtquniverse.com"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Pub/Sub Topics
resource "google_pubsub_topic" "deafauth_events" {
  name = "deafauth-events"
}

resource "google_pubsub_topic" "deafauth_verifications" {
  name = "deafauth-verifications"
}

# Cloud DNS
resource "google_dns_managed_zone" "deafauth_zone" {
  name     = "deafauth-zone"
  dns_name = "deafauth.mbtq.dev."
}

# Network Configuration
resource "google_compute_network" "deafauth_network" {
  name                    = "deafauth-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "deafauth_subnet" {
  name          = "deafauth-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = "us-central1"
  network       = google_compute_network.deafauth_network.id
}

# Load Balancer
resource "google_compute_global_address" "deafauth_ip" {
  name = "deafauth-ip"
}

# SSL Certificate
resource "google_compute_managed_ssl_certificate" "deafauth_ssl" {
  name = "deafauth-ssl"
  
  managed {
    domains = [
      "deafauth.mbtq.dev",
      "api.deafauth.mbtq.dev",
      "admin.deafauth.mbtq.dev",
      "cdn.deafauth.mbtq.dev"
    ]
  }
}

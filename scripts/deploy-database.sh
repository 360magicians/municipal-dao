#!/bin/bash

# MBTQ Municipal DAO Database Deployment Script
# This script sets up the complete Supabase database for the Municipal DAO ecosystem

set -e  # Exit on any error

echo "🏛️ MBTQ Municipal DAO Database Deployment"
echo "=========================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if we're linked to a project
if [ ! -f .supabase/config.toml ]; then
    echo "🔗 Linking to Supabase project..."
    echo "Please run: supabase link --project-ref YOUR_PROJECT_REF"
    echo "Then run this script again."
    exit 1
fi

echo "📊 Checking Supabase status..."
supabase status

echo "🗄️ Pushing database schema..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database schema deployed successfully!"
else
    echo "❌ Failed to deploy database schema"
    exit 1
fi

echo "🌱 Seeding database with test data..."
supabase db seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > types/supabase.ts

if [ $? -eq 0 ]; then
    echo "✅ TypeScript types generated!"
else
    echo "❌ Failed to generate TypeScript types"
    exit 1
fi

echo "🧪 Running database tests..."
npm run test:database

if [ $? -eq 0 ]; then
    echo "✅ All database tests passed!"
else
    echo "⚠️ Some database tests failed, but deployment continues..."
fi

echo ""
echo "🎉 Municipal DAO Database Deployment Complete!"
echo "=============================================="
echo ""
echo "📋 What was deployed:"
echo "  ✅ Complete municipal DAO schema"
echo "  ✅ DeafAUTH profile system"
echo "  ✅ Accessibility transformation cache"
echo "  ✅ AI processing job tracking"
echo "  ✅ Municipal services catalog"
echo "  ✅ Civic engagement events"
echo "  ✅ Row Level Security policies"
echo "  ✅ Test data for development"
echo ""
echo "🔗 Next steps:"
echo "  1. Configure your environment variables"
echo "  2. Run: npm run test:all"
echo "  3. Start your development server: npm run dev"
echo "  4. Visit your Supabase dashboard to explore the data"
echo ""
echo "🌐 Your deaf-first municipal DAO platform is ready!"

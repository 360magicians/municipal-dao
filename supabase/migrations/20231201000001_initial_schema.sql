-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE proposal_status AS ENUM ('draft', 'active', 'passed', 'rejected', 'executed');
CREATE TYPE vote_type AS ENUM ('for', 'against', 'abstain');
CREATE TYPE member_role AS ENUM ('citizen', 'council_member', 'mayor', 'admin', 'moderator');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE municipality_type AS ENUM ('city', 'town', 'village', 'county', 'township');

-- DeafAUTH Profiles Table
CREATE TABLE deafauth_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'ASL',
    verification_status verification_status DEFAULT 'pending',
    verification_documents JSONB,
    reputation_score INTEGER DEFAULT 0,
    accessibility_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Municipalities Table
CREATE TABLE municipalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    municipality_type municipality_type NOT NULL,
    population INTEGER,
    area_sq_miles DECIMAL(10,2),
    website_url TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    zip_code VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    timezone VARCHAR(50),
    accessibility_rating INTEGER DEFAULT 0,
    deaf_population_estimate INTEGER DEFAULT 0,
    sign_language_services BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Municipal DAO Members Table
CREATE TABLE municipal_dao_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES deafauth_profiles(id) ON DELETE CASCADE,
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    role member_role DEFAULT 'citizen',
    voting_power INTEGER DEFAULT 1,
    tokens_staked DECIMAL(18,8) DEFAULT 0,
    civic_engagement_score INTEGER DEFAULT 0,
    verified_resident BOOLEAN DEFAULT FALSE,
    address_verification JSONB,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, municipality_id)
);

-- Municipal Proposals Table
CREATE TABLE municipal_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    proposer_id UUID NOT NULL REFERENCES municipal_dao_members(id),
    status proposal_status DEFAULT 'draft',
    voting_starts_at TIMESTAMP WITH TIME ZONE,
    voting_ends_at TIMESTAMP WITH TIME ZONE,
    execution_deadline TIMESTAMP WITH TIME ZONE,
    required_quorum INTEGER DEFAULT 100,
    required_majority DECIMAL(3,2) DEFAULT 0.51,
    budget_impact DECIMAL(15,2) DEFAULT 0,
    accessibility_impact_assessment JSONB,
    supporting_documents JSONB DEFAULT '[]',
    asl_video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Municipal Votes Table
CREATE TABLE municipal_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES municipal_proposals(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES municipal_dao_members(id) ON DELETE CASCADE,
    vote_type vote_type NOT NULL,
    voting_power INTEGER NOT NULL,
    reason TEXT,
    asl_reason_video_url TEXT,
    cast_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(proposal_id, voter_id)
);

-- Municipal Treasury Transactions Table
CREATE TABLE municipal_treasury_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    transaction_hash VARCHAR(66) UNIQUE,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    token_symbol VARCHAR(10) NOT NULL,
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    status transaction_status DEFAULT 'pending',
    block_number BIGINT,
    gas_used BIGINT,
    gas_price DECIMAL(18,8),
    proposal_id UUID REFERENCES municipal_proposals(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accessibility Transformations Table (for PinkSync integration)
CREATE TABLE accessibility_transformations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    municipality_id UUID REFERENCES municipalities(id),
    source_content TEXT NOT NULL,
    transformed_content JSONB NOT NULL,
    transformation_type VARCHAR(50) NOT NULL,
    source_domain VARCHAR(255),
    source_url TEXT,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- AI Processing Jobs Table (for 360magicians integration)
CREATE TABLE ai_processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    municipality_id UUID REFERENCES municipalities(id),
    job_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    model_used VARCHAR(100),
    processing_time_ms INTEGER,
    cost_credits INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Municipal Services Table
CREATE TABLE municipal_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    accessibility_rating INTEGER DEFAULT 0,
    deaf_accessible BOOLEAN DEFAULT FALSE,
    asl_interpreter_available BOOLEAN DEFAULT FALSE,
    online_portal_url TEXT,
    contact_info JSONB,
    hours_of_operation JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civic Engagement Events Table
CREATE TABLE civic_engagement_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    virtual_meeting_url TEXT,
    asl_interpreter_provided BOOLEAN DEFAULT FALSE,
    live_captions BOOLEAN DEFAULT FALSE,
    accessibility_accommodations JSONB DEFAULT '{}',
    max_participants INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES municipal_dao_members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_deafauth_profiles_user_id ON deafauth_profiles(user_id);
CREATE INDEX idx_deafauth_profiles_username ON deafauth_profiles(username);
CREATE INDEX idx_deafauth_profiles_verification_status ON deafauth_profiles(verification_status);

CREATE INDEX idx_municipalities_state_code ON municipalities(state_code);
CREATE INDEX idx_municipalities_type ON municipalities(municipality_type);
CREATE INDEX idx_municipalities_name ON municipalities(name);

CREATE INDEX idx_municipal_dao_members_profile_id ON municipal_dao_members(profile_id);
CREATE INDEX idx_municipal_dao_members_municipality_id ON municipal_dao_members(municipality_id);
CREATE INDEX idx_municipal_dao_members_role ON municipal_dao_members(role);

CREATE INDEX idx_municipal_proposals_municipality_id ON municipal_proposals(municipality_id);
CREATE INDEX idx_municipal_proposals_status ON municipal_proposals(status);
CREATE INDEX idx_municipal_proposals_proposer_id ON municipal_proposals(proposer_id);
CREATE INDEX idx_municipal_proposals_voting_dates ON municipal_proposals(voting_starts_at, voting_ends_at);

CREATE INDEX idx_municipal_votes_proposal_id ON municipal_votes(proposal_id);
CREATE INDEX idx_municipal_votes_voter_id ON municipal_votes(voter_id);

CREATE INDEX idx_treasury_transactions_municipality_id ON municipal_treasury_transactions(municipality_id);
CREATE INDEX idx_treasury_transactions_hash ON municipal_treasury_transactions(transaction_hash);

CREATE INDEX idx_accessibility_transformations_user_id ON accessibility_transformations(user_id);
CREATE INDEX idx_accessibility_transformations_municipality_id ON accessibility_transformations(municipality_id);

CREATE INDEX idx_ai_processing_jobs_user_id ON ai_processing_jobs(user_id);
CREATE INDEX idx_ai_processing_jobs_status ON ai_processing_jobs(status);

-- Row Level Security (RLS) Policies
ALTER TABLE deafauth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_dao_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_treasury_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_engagement_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deafauth_profiles
CREATE POLICY "Users can view all profiles" ON deafauth_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON deafauth_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON deafauth_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for municipalities
CREATE POLICY "Anyone can view municipalities" ON municipalities FOR SELECT USING (true);
CREATE POLICY "Only admins can modify municipalities" ON municipalities FOR ALL USING (
    EXISTS (
        SELECT 1 FROM municipal_dao_members mdm
        JOIN deafauth_profiles dp ON mdm.profile_id = dp.id
        WHERE dp.user_id = auth.uid() AND mdm.role IN ('admin', 'mayor')
    )
);

-- RLS Policies for municipal_dao_members
CREATE POLICY "Members can view all members in their municipality" ON municipal_dao_members FOR SELECT USING (true);
CREATE POLICY "Users can update own membership" ON municipal_dao_members FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM deafauth_profiles dp
        WHERE dp.id = profile_id AND dp.user_id = auth.uid()
    )
);

-- RLS Policies for municipal_proposals
CREATE POLICY "Anyone can view active proposals" ON municipal_proposals FOR SELECT USING (true);
CREATE POLICY "Members can create proposals" ON municipal_proposals FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM municipal_dao_members mdm
        JOIN deafauth_profiles dp ON mdm.profile_id = dp.id
        WHERE mdm.id = proposer_id AND dp.user_id = auth.uid()
    )
);

-- RLS Policies for municipal_votes
CREATE POLICY "Anyone can view votes" ON municipal_votes FOR SELECT USING (true);
CREATE POLICY "Members can cast votes" ON municipal_votes FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM municipal_dao_members mdm
        JOIN deafauth_profiles dp ON mdm.profile_id = dp.id
        WHERE mdm.id = voter_id AND dp.user_id = auth.uid()
    )
);

-- RLS Policies for accessibility_transformations
CREATE POLICY "Users can view own transformations" ON accessibility_transformations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transformations" ON accessibility_transformations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_processing_jobs
CREATE POLICY "Users can view own AI jobs" ON ai_processing_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own AI jobs" ON ai_processing_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_deafauth_profiles_updated_at BEFORE UPDATE ON deafauth_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_municipalities_updated_at BEFORE UPDATE ON municipalities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_municipal_proposals_updated_at BEFORE UPDATE ON municipal_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_municipal_services_updated_at BEFORE UPDATE ON municipal_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

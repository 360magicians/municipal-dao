-- Insert test data for development

-- Insert DeafAUTH profiles
INSERT INTO deafauth_profiles (id, user_id, username, display_name, bio, preferred_language, verification_status, reputation_score) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'alice_deaf', 'Alice Johnson', 'ASL interpreter and accessibility advocate', 'ASL', 'verified', 150),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'bob_signer', 'Bob Smith', 'Deaf developer passionate about inclusive tech', 'ASL', 'verified', 200),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'carol_coda', 'Carol Davis', 'CODA working in deaf education', 'ASL', 'pending', 75),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'david_hoh', 'David Wilson', 'Hard of hearing UX designer', 'PSE', 'verified', 120);

-- Insert DAO members
INSERT INTO dao_members (id, profile_id, role, voting_power, tokens_staked) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin', 5, 1000.50),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'moderator', 3, 750.25),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'member', 1, 100.00),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'member', 2, 500.75);

-- Insert test proposals
INSERT INTO proposals (id, title, description, proposer_id, status, voting_starts_at, voting_ends_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Improve ASL Video Quality', 'Proposal to upgrade video compression for better ASL clarity in all platform communications', '660e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Add Haptic Feedback Support', 'Integrate haptic feedback for better accessibility across mobile devices', '660e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '6 days 22 hours'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Community Grants Program', 'Establish a grants program to fund deaf-led accessibility projects', '660e8400-e29b-41d4-a716-446655440001', 'draft', NULL, NULL);

-- Insert test votes
INSERT INTO votes (proposal_id, voter_id, vote_type, voting_power, reason) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'for', 5, 'Critical for ASL communication quality'),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'for', 3, 'Strongly support this improvement'),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'for', 2, 'Will benefit the entire community'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'for', 3, 'Haptic feedback is essential for accessibility'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', 'for', 2, 'Great addition for mobile users');

-- Insert test treasury transactions
INSERT INTO treasury_transactions (transaction_hash, transaction_type, amount, token_symbol, from_address, to_address, status) VALUES
  ('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'stake', 1000.50, 'MBTQ', '0xuser1address', '0xdaotreasury', 'completed'),
  ('0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef1', 'stake', 750.25, 'MBTQ', '0xuser2address', '0xdaotreasury', 'completed'),
  ('0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef12', 'reward', 50.00, 'MBTQ', '0xdaotreasury', '0xuser1address', 'completed');

-- Insert test accessibility transformations
INSERT INTO accessibility_transformations (user_id, source_content, transformed_content, transformation_type, source_domain) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Welcome to our platform', '{"asl_video": "welcome_sign.mp4", "captions": "Welcome to our platform", "visual_indicators": true}', 'text_to_asl', 'example.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Click here to continue', '{"haptic_pattern": [100, 50, 100], "visual_highlight": true, "asl_description": "tap_continue.mp4"}', 'ui_enhancement', 'app.example.com');

-- Insert test AI processing jobs
INSERT INTO ai_processing_jobs (user_id, job_type, input_data, output_data, status, model_used, processing_time_ms, cost_credits) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'asl_translation', '{"text": "Hello world", "target_language": "ASL"}', '{"video_url": "hello_world_asl.mp4", "confidence": 0.95}', 'completed', 'vertex-ai-asl-v1', 2500, 10),
  ('550e8400-e29b-41d4-a716-446655440002', 'image_description', '{"image_url": "chart.png", "context": "financial_data"}', '{"description": "Bar chart showing quarterly revenue growth", "asl_description": "chart_explanation.mp4"}', 'completed', 'vertex-ai-vision-v2', 1800, 5),
  ('550e8400-e29b-41d4-a716-446655440003', 'content_simplification', '{"text": "Complex technical documentation", "reading_level": "elementary"}', NULL, 'processing', 'vertex-ai-text-v1', NULL, 8);

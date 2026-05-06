-- Seed data for Lawvanta
-- Demo users with hashed passwords (password: Judge@123, Lawyer@123, etc.)

-- Insert demo users
INSERT INTO users (id, email, password, name, role, phone, court_id, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'judge.sharma@court.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q8whW', 'Justice Rajesh Sharma', 'JUDGE', '+91-9876543210', 'DLH-HC-001', '{"language": "en", "theme": "light", "agentTone": "formal", "notificationsEnabled": true, "voiceInputEnabled": true}'::jsonb),
('550e8400-e29b-41d4-a716-446655440002', 'adv.mehta@lawfirm.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q8whW', 'Adv. Priya Mehta', 'LAWYER', '+91-9876543211', NULL, '{"language": "en", "theme": "dark", "agentTone": "conversational", "notificationsEnabled": true, "voiceInputEnabled": false}'::jsonb),
('550e8400-e29b-41d4-a716-446655440003', 'clerk.kumar@court.gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q8whW', 'Ramesh Kumar', 'CLERK', '+91-9876543212', 'DLH-DC-001', '{"language": "hi", "theme": "light", "agentTone": "concise", "notificationsEnabled": true, "voiceInputEnabled": false}'::jsonb),
('550e8400-e29b-41d4-a716-446655440004', 'pp.singh@gov.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxF6q8whW', 'PP Vikram Singh', 'PROSECUTOR', '+91-9876543213', 'DLH-SC-001', '{"language": "en", "theme": "light", "agentTone": "formal", "notificationsEnabled": true, "voiceInputEnabled": false}'::jsonb);

-- Update bar_council_id for lawyer
UPDATE users SET bar_council_id = 'BAR/DLH/2015/12345' WHERE email = 'adv.mehta@lawfirm.com';

-- Insert sample cases
INSERT INTO cases (id, case_number, case_type, status, title, description, filing_date, next_hearing_date, judge_id, court_id, metadata) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'CS/2024/001', 'CIVIL', 'PENDING', 'Ram Kumar vs. State Bank of India', 'Civil suit for recovery of money and damages', '2024-01-15', '2024-06-15', '550e8400-e29b-41d4-a716-446655440001', 'DLH-DC-001', '{"acts": ["CPC Section 9", "Contract Act Section 73"], "keywords": ["contract breach", "damages", "banking"], "priority": "MEDIUM", "complexity": "MODERATE"}'::jsonb),
('650e8400-e29b-41d4-a716-446655440002', 'CR/2024/045', 'CRIMINAL', 'HEARING', 'State vs. Ajay Verma', 'Criminal case under IPC Section 420 (Cheating)', '2024-02-20', '2024-05-20', '550e8400-e29b-41d4-a716-446655440001', 'DLH-SC-001', '{"acts": ["IPC Section 420", "CrPC Section 313"], "keywords": ["cheating", "fraud", "financial"], "priority": "HIGH", "complexity": "COMPLEX"}'::jsonb),
('650e8400-e29b-41d4-a716-446655440003', 'WP/2024/123', 'WRIT', 'FILED', 'Sunita Devi vs. Municipal Corporation', 'Writ petition for enforcement of fundamental rights', '2024-04-01', '2024-05-30', '550e8400-e29b-41d4-a716-446655440001', 'DLH-HC-001', '{"acts": ["Constitution Article 21", "Constitution Article 226"], "keywords": ["fundamental rights", "public interest", "municipal"], "priority": "URGENT", "complexity": "COMPLEX"}'::jsonb);

-- Insert case parties
INSERT INTO case_parties (case_id, name, type, lawyer_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Ram Kumar', 'PETITIONER', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440001', 'State Bank of India', 'RESPONDENT', NULL),
('650e8400-e29b-41d4-a716-446655440002', 'State of Delhi', 'COMPLAINANT', '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440002', 'Ajay Verma', 'ACCUSED', NULL),
('650e8400-e29b-41d4-a716-446655440003', 'Sunita Devi', 'PETITIONER', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'Municipal Corporation of Delhi', 'RESPONDENT', NULL);

-- Insert sample case events
INSERT INTO case_events (case_id, event_type, description, event_date, created_by) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'FILING', 'Case filed in District Court', '2024-01-15 10:30:00', '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440001', 'HEARING', 'First hearing conducted', '2024-02-20 11:00:00', '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440001', 'DOCUMENT_FILED', 'Written statement filed by respondent', '2024-03-10 14:30:00', '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440002', 'FILING', 'FIR registered and charge sheet filed', '2024-02-20 09:00:00', '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440002', 'HEARING', 'Arguments on bail application', '2024-03-15 10:00:00', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample order templates
INSERT INTO order_templates (name, category, template, variables, applicable_for, created_by, is_public) VALUES
('Bail Order', 'Criminal', 'IN THE COURT OF [COURT_NAME]\n\nCase No: [CASE_NUMBER]\n\nORDER\n\nThe accused [ACCUSED_NAME] has filed an application for bail under Section [SECTION] of CrPC.\n\nAfter hearing the arguments and considering the facts, this Court is of the opinion that [REASONING].\n\nAccordingly, the accused is [GRANTED/DENIED] bail on the following conditions:\n[CONDITIONS]\n\nDated: [DATE]\n\n[JUDGE_NAME]\n[DESIGNATION]', '["COURT_NAME", "CASE_NUMBER", "ACCUSED_NAME", "SECTION", "REASONING", "CONDITIONS", "DATE", "JUDGE_NAME", "DESIGNATION"]'::jsonb, '["CRIMINAL"]'::jsonb, '550e8400-e29b-41d4-a716-446655440001', true),
('Adjournment Order', 'General', 'IN THE COURT OF [COURT_NAME]\n\nCase No: [CASE_NUMBER]\n\nORDER\n\nOn the request of [PARTY_NAME] through counsel, and for reasons stated, the matter is adjourned to [NEXT_DATE].\n\n[ADDITIONAL_DIRECTIONS]\n\nDated: [DATE]\n\n[JUDGE_NAME]\n[DESIGNATION]', '["COURT_NAME", "CASE_NUMBER", "PARTY_NAME", "NEXT_DATE", "ADDITIONAL_DIRECTIONS", "DATE", "JUDGE_NAME", "DESIGNATION"]'::jsonb, '["CIVIL", "CRIMINAL", "FAMILY", "COMMERCIAL"]'::jsonb, '550e8400-e29b-41d4-a716-446655440001', true);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, action_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'INFO', 'New Case Assigned', 'Case WP/2024/123 has been assigned to you for hearing.', '/cases/650e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440002', 'WARNING', 'Hearing Tomorrow', 'Your case CS/2024/001 is scheduled for hearing tomorrow at 11:00 AM.', '/cases/650e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', 'SUCCESS', 'Document Filed', 'Written statement for Case CS/2024/001 has been successfully filed.', '/cases/650e8400-e29b-41d4-a716-446655440001');

-- Note: Passwords for demo accounts are all hashed versions of:
-- Judge@123, Lawyer@123, Clerk@123, Prosecutor@123
-- In production, users should change these immediately

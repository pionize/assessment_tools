-- Views sederhana untuk melihat hasil submission assessment

-- 1. View Utama - Hasil Submission dengan AI Detection
CREATE OR REPLACE VIEW submission_results AS
SELECT 
    -- Info Kandidat
    c.name as candidate_name,
    c.email as candidate_email,
    
    -- Info Assessment
    a.title as assessment_title,
    
    -- Info Challenge
    ch.title as challenge_title,
    ch.type as challenge_type,
    
    -- Info Submission
    cs.submitted_at,
    cs.score,
    cs.max_score,
    CASE 
        WHEN cs.max_score > 0 THEN ROUND((cs.score / cs.max_score) * 100, 1)
        ELSE NULL
    END as score_percentage,
    
    -- AI Detection Info
    cs.ai_detected,
    cs.ai_detection_score,
    CASE 
        WHEN cs.ai_detection_score IS NULL THEN 'Belum Dianalisis'
        WHEN cs.ai_detection_score >= 80 THEN 'Sangat Mencurigakan'
        WHEN cs.ai_detection_score >= 60 THEN 'Mencurigakan'
        WHEN cs.ai_detection_score >= 40 THEN 'Sedikit Mencurigakan'
        ELSE 'Tidak Mencurigakan'
    END as ai_suspicion_level,
    
    -- AI Feedback (feedback AI biasa)
    cs.ai_feedback,
    
    -- AI Detection Reason (alasan reasoning kenapa terdeteksi)
    cs.ai_detection_reason,
    
    -- Additional Info
    cs.time_spent_seconds,
    ROUND(cs.time_spent_seconds / 60.0, 1) as time_spent_minutes,
    cs.is_auto_submitted,
    cs.status as submission_status
    
FROM challenge_submissions cs
JOIN candidates c ON cs.candidate_id = c.id
JOIN challenges ch ON cs.challenge_id = ch.id
JOIN assessment_sessions s ON cs.session_id = s.id
JOIN assessments a ON s.assessment_id = a.id
ORDER BY cs.submitted_at DESC;
-- Developer Assessment System Database Schema
-- This schema supports multiple challenge types including multiple choice

-- Create database
CREATE DATABASE developer_assessment;
USE developer_assessment;

-- ========================================
-- Core Tables
-- ========================================

-- Assessments table - stores assessment information
CREATE TABLE assessments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    time_limit_minutes INT DEFAULT NULL, -- overall assessment time limit
    passing_score DECIMAL(5,2) DEFAULT NULL, -- minimum score to pass (percentage)
    instructions TEXT,
    INDEX idx_created_by (created_by),
    INDEX idx_is_active (is_active)
);

-- Challenges table - stores challenge information
CREATE TABLE challenges (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('code', 'open-ended', 'multiple-choice') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    time_limit_minutes INT DEFAULT NULL,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Challenge-specific data
    instructions LONGTEXT,
    language VARCHAR(50) DEFAULT NULL, -- for code challenges (javascript, python, etc.)
    initial_code LONGTEXT DEFAULT NULL, -- for code challenges
    test_cases JSON DEFAULT NULL, -- for code challenges
    
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_by (created_by),
    INDEX idx_is_active (is_active)
);

-- Code files for code challenges
CREATE TABLE challenge_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_content LONGTEXT,
    language VARCHAR(50),
    is_main_file BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    INDEX idx_challenge_id (challenge_id),
    UNIQUE KEY unique_challenge_file (challenge_id, file_name)
);

-- Multiple choice questions
CREATE TABLE multiple_choice_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id VARCHAR(50) NOT NULL,
    question_text LONGTEXT NOT NULL,
    explanation TEXT DEFAULT NULL, -- explanation for the correct answer
    display_order INT DEFAULT 0,
    points INT DEFAULT 1, -- points for this question
    
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    INDEX idx_challenge_id (challenge_id)
);

-- Multiple choice options
CREATE TABLE multiple_choice_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_id CHAR(1) NOT NULL, -- A, B, C, D, etc.
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    FOREIGN KEY (question_id) REFERENCES multiple_choice_questions(id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    UNIQUE KEY unique_question_option (question_id, option_id)
);

-- Assessment challenges mapping - links challenges to assessments
CREATE TABLE assessment_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL,
    challenge_id VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    weight DECIMAL(5,2) DEFAULT 1.0, -- weight for scoring
    
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assessment_challenge (assessment_id, challenge_id),
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_challenge_id (challenge_id)
);

-- ========================================
-- Candidate and Session Tables
-- ========================================

-- Candidates table - stores candidate information
CREATE TABLE candidates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Assessment sessions - tracks candidate sessions
CREATE TABLE assessment_sessions (
    id VARCHAR(50) PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL,
    candidate_id VARCHAR(50) NOT NULL,
    status ENUM('started', 'in_progress', 'completed', 'expired', 'abandoned') DEFAULT 'started',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    total_score DECIMAL(5,2) DEFAULT NULL,
    passing_score DECIMAL(5,2) DEFAULT NULL,
    is_passed BOOLEAN DEFAULT NULL,
    session_token VARCHAR(255) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_status (status),
    INDEX idx_session_token (session_token),
    UNIQUE KEY unique_candidate_assessment (candidate_id, assessment_id)
);

-- ========================================
-- Submission Tables
-- ========================================

-- Challenge submissions - stores candidate answers
CREATE TABLE challenge_submissions (
    id VARCHAR(50) PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    challenge_id VARCHAR(50) NOT NULL,
    candidate_id VARCHAR(50) NOT NULL,
    submission_type ENUM('code', 'open-ended', 'multiple-choice') NOT NULL,
    status ENUM('draft', 'submitted', 'graded') DEFAULT 'draft',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_seconds INT DEFAULT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    max_score DECIMAL(5,2) DEFAULT NULL,
    is_auto_submitted BOOLEAN DEFAULT FALSE, -- submitted due to timeout
    
    -- Generic submission data
    answer_text LONGTEXT DEFAULT NULL, -- for open-ended questions
    
    FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_submission_type (submission_type),
    INDEX idx_status (status),
    UNIQUE KEY unique_session_challenge (session_id, challenge_id)
);

-- Code submission files - for code challenges
CREATE TABLE code_submission_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_content LONGTEXT,
    language VARCHAR(50),
    
    FOREIGN KEY (submission_id) REFERENCES challenge_submissions(id) ON DELETE CASCADE,
    INDEX idx_submission_id (submission_id),
    UNIQUE KEY unique_submission_file (submission_id, file_name)
);

-- Multiple choice answers - for multiple choice challenges
CREATE TABLE multiple_choice_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id VARCHAR(50) NOT NULL,
    question_id INT NOT NULL,
    selected_option_id CHAR(1) NOT NULL, -- A, B, C, D, etc.
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned DECIMAL(5,2) DEFAULT 0,
    
    FOREIGN KEY (submission_id) REFERENCES challenge_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES multiple_choice_questions(id) ON DELETE CASCADE,
    INDEX idx_submission_id (submission_id),
    INDEX idx_question_id (question_id),
    UNIQUE KEY unique_submission_question (submission_id, question_id)
);

-- ========================================
-- Audit and Logging Tables
-- ========================================

-- Audit log for tracking changes
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON DEFAULT NULL,
    new_values JSON DEFAULT NULL,
    changed_by VARCHAR(100) DEFAULT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) DEFAULT NULL,
    
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
);

-- Session activity log
CREATE TABLE session_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    activity_type ENUM('login', 'challenge_start', 'challenge_save', 'challenge_submit', 'logout', 'timeout') NOT NULL,
    challenge_id VARCHAR(50) DEFAULT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    
    FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_timestamp (timestamp)
);

-- ========================================
-- Sample Data Inserts
-- ========================================

-- Sample assessment
INSERT INTO assessments (id, title, description, created_by, time_limit_minutes, passing_score) 
VALUES ('assessment-123', 'Frontend Developer Assessment', 'Complete assessment for frontend developer position', 'admin', 120, 70.00);

-- Sample challenges
INSERT INTO challenges (id, title, description, type, difficulty, time_limit_minutes, instructions, language) 
VALUES 
('challenge-1', 'React Component Implementation', 'Create a reusable React component that displays a list of users with search functionality.', 'code', 'medium', 60, 
'# React Component Challenge

Create a UserList component with the following requirements:
- Display a list of users from props
- Include search functionality
- Show user avatar, name, and email
- Handle loading and empty states

## Requirements:
- Use functional components with hooks
- Implement search filtering
- Add proper TypeScript types
- Include basic styling', 'javascript'),

('challenge-2', 'Algorithm Problem', 'Solve this algorithmic problem and explain your approach.', 'open-ended', 'medium', 30,
'# Two Sum Problem

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

## Requirements:
1. Provide the solution code
2. Explain your approach and time complexity
3. Discuss alternative solutions if any', NULL),

('challenge-3', 'JavaScript Fundamentals Quiz', 'Test your knowledge of JavaScript fundamentals and modern ES6+ features.', 'multiple-choice', 'easy', 25,
'Answer the following multiple-choice questions about JavaScript. Each question has only one correct answer.', NULL);

-- Sample code files for challenge-1
INSERT INTO challenge_files (challenge_id, file_name, file_content, language, is_main_file, display_order) 
VALUES 
('challenge-1', 'UserList.jsx', '// Implement your UserList component here

const UserList = ({ users }) => {
  return (
    <div>
      {/* Your implementation here */}
    </div>
  );
};

export default UserList;', 'javascript', TRUE, 1),

('challenge-1', 'App.jsx', 'import UserList from \'./UserList\';

const users = [
  { id: 1, name: \'John Doe\', email: \'john@example.com\', avatar: \'https://via.placeholder.com/40\' },
  { id: 2, name: \'Jane Smith\', email: \'jane@example.com\', avatar: \'https://via.placeholder.com/40\' }
];

function App() {
  return (
    <div className="App">
      <UserList users={users} />
    </div>
  );
}

export default App;', 'javascript', FALSE, 2);

-- Sample multiple choice questions for challenge-3
INSERT INTO multiple_choice_questions (challenge_id, question_text, explanation, display_order, points) 
VALUES 
('challenge-3', 'What is the output of the following code?

```javascript
console.log(typeof null);
```', 'In JavaScript, `typeof null` returns "object". This is a well-known quirk in the language that exists for historical reasons.', 1, 1),

('challenge-3', 'Which of the following is NOT a valid way to declare a variable in modern JavaScript?', '"variable" is not a valid JavaScript keyword for declaring variables. Use let, const, or var instead.', 2, 1),

('challenge-3', 'What does the spread operator (...) do when used with arrays?', 'The spread operator can create shallow copies, expand elements individually, and is commonly used in concatenation operations.', 3, 1),

('challenge-3', 'Which method is used to add elements to the end of an array?', 'The push() method adds one or more elements to the end of an array and returns the new length of the array.', 4, 1),

('challenge-3', 'What is the difference between == and === in JavaScript?', '== performs type coercion and compares values, while === compares both value and type without any coercion (strict equality).', 5, 1);

-- Sample multiple choice options
INSERT INTO multiple_choice_options (question_id, option_id, option_text, is_correct, display_order) 
VALUES 
-- Question 1 options
(1, 'A', '"null"', FALSE, 1),
(1, 'B', '"object"', TRUE, 2),
(1, 'C', '"undefined"', FALSE, 3),
(1, 'D', '"boolean"', FALSE, 4),

-- Question 2 options
(2, 'A', 'let myVar = 10;', FALSE, 1),
(2, 'B', 'const myVar = 10;', FALSE, 2),
(2, 'C', 'var myVar = 10;', FALSE, 3),
(2, 'D', 'variable myVar = 10;', TRUE, 4),

-- Question 3 options
(3, 'A', 'Creates a shallow copy of the array', FALSE, 1),
(3, 'B', 'Expands array elements individually', FALSE, 2),
(3, 'C', 'Can be used for array concatenation', FALSE, 3),
(3, 'D', 'All of the above', TRUE, 4),

-- Question 4 options
(4, 'A', 'append()', FALSE, 1),
(4, 'B', 'add()', FALSE, 2),
(4, 'C', 'push()', TRUE, 3),
(4, 'D', 'insert()', FALSE, 4),

-- Question 5 options
(5, 'A', 'No difference, they work exactly the same', FALSE, 1),
(5, 'B', '== compares values with type coercion, === compares values and types strictly', TRUE, 2),
(5, 'C', '== is for numbers only, === is for strings only', FALSE, 3),
(5, 'D', '=== is deprecated and should not be used', FALSE, 4);

-- Link challenges to assessment
INSERT INTO assessment_challenges (assessment_id, challenge_id, display_order, weight) 
VALUES 
('assessment-123', 'challenge-1', 1, 1.0),
('assessment-123', 'challenge-2', 2, 1.0),
('assessment-123', 'challenge-3', 3, 1.0);

-- ========================================
-- Views for easier querying
-- ========================================

-- View for assessment summary with challenge count
CREATE VIEW assessment_summary AS
SELECT 
    a.*,
    COUNT(ac.challenge_id) as total_challenges,
    COUNT(CASE WHEN c.type = 'code' THEN 1 END) as code_challenges,
    COUNT(CASE WHEN c.type = 'open-ended' THEN 1 END) as open_ended_challenges,
    COUNT(CASE WHEN c.type = 'multiple-choice' THEN 1 END) as multiple_choice_challenges
FROM assessments a
LEFT JOIN assessment_challenges ac ON a.id = ac.assessment_id
LEFT JOIN challenges c ON ac.challenge_id = c.id
WHERE a.is_active = TRUE AND (c.is_active IS NULL OR c.is_active = TRUE)
GROUP BY a.id;

-- View for session progress
CREATE VIEW session_progress AS
SELECT 
    s.*,
    COUNT(cs.id) as total_submissions,
    COUNT(CASE WHEN cs.status = 'submitted' THEN 1 END) as completed_challenges,
    COUNT(ac.challenge_id) as total_challenges,
    ROUND((COUNT(CASE WHEN cs.status = 'submitted' THEN 1 END) / COUNT(ac.challenge_id)) * 100, 2) as completion_percentage,
    AVG(cs.score) as average_score
FROM assessment_sessions s
JOIN assessment_challenges ac ON s.assessment_id = ac.assessment_id
LEFT JOIN challenge_submissions cs ON s.id = cs.session_id AND ac.challenge_id = cs.challenge_id
GROUP BY s.id;

-- View for multiple choice scoring
CREATE VIEW multiple_choice_scores AS
SELECT 
    cs.id as submission_id,
    cs.session_id,
    cs.challenge_id,
    COUNT(mca.id) as total_questions,
    COUNT(CASE WHEN mca.is_correct = TRUE THEN 1 END) as correct_answers,
    ROUND((COUNT(CASE WHEN mca.is_correct = TRUE THEN 1 END) / COUNT(mca.id)) * 100, 2) as score_percentage,
    SUM(mca.points_earned) as total_points,
    SUM(mcq.points) as max_points
FROM challenge_submissions cs
JOIN multiple_choice_answers mca ON cs.id = mca.submission_id
JOIN multiple_choice_questions mcq ON mca.question_id = mcq.id
WHERE cs.submission_type = 'multiple-choice'
GROUP BY cs.id;

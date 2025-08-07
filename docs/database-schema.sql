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

-- Additional sample assessments
INSERT INTO assessments (id, title, description, created_by, time_limit_minutes, passing_score, instructions) 
VALUES 
('assessment-fullstack', 'Full-Stack Developer Assessment', 'Comprehensive assessment for full-stack developer position covering React, Node.js, and databases', 'hr-manager', 180, 75.00,
'Welcome to the Full-Stack Developer Assessment. You will complete 4 challenges covering frontend, backend, and database skills. Please read each challenge carefully and manage your time wisely.'),

('assessment-junior', 'Junior Developer Assessment', 'Entry-level assessment for junior developer candidates', 'technical-lead', 90, 65.00,
'This assessment evaluates basic programming concepts and problem-solving skills. Take your time to understand each problem before implementing your solution.'),

('assessment-senior', 'Senior Developer Assessment', 'Advanced assessment for senior developer candidates with system design components', 'cto', 240, 80.00,
'Advanced assessment covering complex algorithms, system design, and architectural decisions. Demonstrate your experience and thought process in your solutions.');

-- Additional sample challenges
INSERT INTO challenges (id, title, description, type, difficulty, time_limit_minutes, instructions, language) 
VALUES 
('challenge-api', 'RESTful API Development', 'Build a complete REST API with authentication and CRUD operations', 'code', 'hard', 90,
'# REST API Challenge\n\nBuild a RESTful API for a task management system with the following endpoints:\n\n## Requirements:\n- POST /auth/login - User authentication\n- GET /tasks - List all tasks (authenticated)\n- POST /tasks - Create new task\n- PUT /tasks/:id - Update task\n- DELETE /tasks/:id - Delete task\n\n## Technical Requirements:\n- Use Express.js and Node.js\n- Implement JWT authentication\n- Include input validation\n- Add error handling middleware\n- Write unit tests', 'javascript'),

('challenge-database', 'Database Design & Queries', 'Design a database schema and write complex SQL queries', 'open-ended', 'medium', 45,
'# Database Design Challenge\n\n## Scenario\nDesign a database for an e-commerce platform that needs to handle:\n- Users (customers and admins)\n- Products with categories and inventory\n- Orders and order items\n- Reviews and ratings\n\n## Tasks\n1. Design the database schema (tables, relationships, indexes)\n2. Write SQL queries for common operations\n3. Optimize for performance\n4. Handle data integrity constraints\n\n## Deliverables\n- Entity Relationship Diagram\n- CREATE TABLE statements\n- Sample queries with explanations', NULL),

('challenge-react-advanced', 'Advanced React Patterns', 'Implement advanced React patterns and state management', 'code', 'hard', 75,
'# Advanced React Challenge\n\nCreate a dashboard application with the following features:\n\n## Requirements\n- Custom hooks for data fetching\n- Context API for global state\n- Higher-order components\n- Error boundaries\n- Performance optimizations\n- TypeScript integration\n\n## Components to build\n- DataTable with sorting/filtering\n- Chart components\n- Modal system\n- Loading states\n- Error handling', 'typescript'),

('challenge-algorithms', 'Advanced Algorithms', 'Solve complex algorithmic problems', 'multiple-choice', 'hard', 40,
'Test your knowledge of advanced algorithms, data structures, and computational complexity. Choose the best answer for each question.', NULL),

('challenge-system-design', 'System Architecture', 'Design scalable systems and explain architectural decisions', 'open-ended', 'hard', 60,
'# System Design Challenge\n\n## Problem\nDesign a URL shortening service (like bit.ly) that can handle:\n- 100M URLs shortened per day\n- 10:1 read/write ratio\n- Custom aliases support\n- Analytics tracking\n\n## Requirements\n1. High-level architecture diagram\n2. Database design\n3. API design\n4. Scalability considerations\n5. Caching strategy\n6. Monitoring and alerting', NULL),

('challenge-css', 'CSS & Frontend Styling', 'Advanced CSS techniques and responsive design', 'multiple-choice', 'medium', 20,
'Test your knowledge of modern CSS, responsive design, and frontend styling techniques.', NULL);

-- Additional code files for new challenges
INSERT INTO challenge_files (challenge_id, file_name, file_content, language, is_main_file, display_order) 
VALUES 
-- API Challenge files
('challenge-api', 'server.js', '// Express server setup\nconst express = require(\'express\');\nconst app = express();\n\n// TODO: Implement middleware\n// TODO: Add authentication routes\n// TODO: Add task routes\n// TODO: Add error handling\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});\n\nmodule.exports = app;', 'javascript', TRUE, 1),

('challenge-api', 'routes/auth.js', '// Authentication routes\nconst express = require(\'express\');\nconst router = express.Router();\n\n// TODO: Implement login endpoint\n// POST /auth/login\nrouter.post(\'/login\', (req, res) => {\n  // Your implementation here\n});\n\nmodule.exports = router;', 'javascript', FALSE, 2),

('challenge-api', 'routes/tasks.js', '// Task management routes\nconst express = require(\'express\');\nconst router = express.Router();\n\n// TODO: Implement CRUD operations\n// GET /tasks\nrouter.get(\'/\', (req, res) => {\n  // Your implementation here\n});\n\n// POST /tasks\nrouter.post(\'/\', (req, res) => {\n  // Your implementation here\n});\n\n// PUT /tasks/:id\nrouter.put(\'//:id\', (req, res) => {\n  // Your implementation here\n});\n\n// DELETE /tasks/:id\nrouter.delete(\'//:id\', (req, res) => {\n  // Your implementation here\n});\n\nmodule.exports = router;', 'javascript', FALSE, 3),

('challenge-api', 'middleware/auth.js', '// JWT Authentication middleware\nconst jwt = require(\'jsonwebtoken\');\n\nconst authenticateToken = (req, res, next) => {\n  // TODO: Implement JWT verification\n  // Extract token from Authorization header\n  // Verify token\n  // Add user info to request object\n};\n\nmodule.exports = { authenticateToken };', 'javascript', FALSE, 4),

('challenge-api', 'package.json', '{\n  "name": "task-api",\n  "version": "1.0.0",\n  "description": "Task management REST API",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js",\n    "test": "jest"\n  },\n  "dependencies": {\n    "express": "^4.18.2",\n    "jsonwebtoken": "^9.0.0",\n    "bcryptjs": "^2.4.3",\n    "express-validator": "^6.15.0"\n  },\n  "devDependencies": {\n    "nodemon": "^2.0.22",\n    "jest": "^29.5.0",\n    "supertest": "^6.3.3"\n  }\n}', 'json', FALSE, 5),

-- React Advanced Challenge files
('challenge-react-advanced', 'Dashboard.tsx', '// Main dashboard component\nimport React from \'react\';\n\ninterface DashboardProps {\n  // TODO: Define props interface\n}\n\nconst Dashboard: React.FC<DashboardProps> = () => {\n  // TODO: Implement dashboard with:\n  // - Data fetching with custom hooks\n  // - Global state management\n  // - Error boundaries\n  // - Loading states\n  \n  return (\n    <div className="dashboard">\n      {/* Your implementation here */}\n    </div>\n  );\n};\n\nexport default Dashboard;', 'typescript', TRUE, 1),

('challenge-react-advanced', 'hooks/useApi.ts', '// Custom hook for API data fetching\nimport { useState, useEffect } from \'react\';\n\ninterface ApiState<T> {\n  data: T | null;\n  loading: boolean;\n  error: string | null;\n}\n\nexport const useApi = <T>(url: string): ApiState<T> => {\n  // TODO: Implement custom hook for data fetching\n  // Handle loading states, errors, and caching\n  \n  return {\n    data: null,\n    loading: false,\n    error: null\n  };\n};', 'typescript', FALSE, 2),

('challenge-react-advanced', 'context/AppContext.tsx', '// Global application context\nimport React, { createContext, useContext, useReducer } from \'react\';\n\n// TODO: Define application state interface\ninterface AppState {\n  // Define your state shape\n}\n\n// TODO: Define action types\ntype AppAction = \n  | { type: \'EXAMPLE_ACTION\'; payload: any }\n  // Add more actions\n\n// TODO: Implement reducer\nconst appReducer = (state: AppState, action: AppAction): AppState => {\n  switch (action.type) {\n    default:\n      return state;\n  }\n};\n\n// TODO: Create context and provider\nexport const AppContext = createContext<{\n  state: AppState;\n  dispatch: React.Dispatch<AppAction>;\n} | null>(null);', 'typescript', FALSE, 3),

('challenge-react-advanced', 'components/DataTable.tsx', '// Reusable data table component\nimport React from \'react\';\n\ninterface Column<T> {\n  key: keyof T;\n  title: string;\n  sortable?: boolean;\n  render?: (value: any, record: T) => React.ReactNode;\n}\n\ninterface DataTableProps<T> {\n  data: T[];\n  columns: Column<T>[];\n  loading?: boolean;\n  onSort?: (key: keyof T, direction: \'asc\' | \'desc\') => void;\n}\n\nfunction DataTable<T>({ data, columns, loading, onSort }: DataTableProps<T>) {\n  // TODO: Implement sortable, filterable data table\n  // Handle loading states\n  // Add pagination if needed\n  \n  return (\n    <div className="data-table">\n      {/* Your implementation here */}\n    </div>\n  );\n}\n\nexport default DataTable;', 'typescript', FALSE, 4);

-- Additional multiple choice questions for algorithms challenge
INSERT INTO multiple_choice_questions (challenge_id, question_text, explanation, display_order, points) 
VALUES 
('challenge-algorithms', 'What is the time complexity of binary search on a sorted array?', 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.', 1, 2),

('challenge-algorithms', 'Which data structure is best for implementing a LRU (Least Recently Used) cache?', 'A combination of HashMap and Doubly Linked List provides O(1) access, insertion, and deletion for LRU cache implementation.', 2, 2),

('challenge-algorithms', 'What is the space complexity of merge sort?', 'Merge sort requires O(n) additional space for the temporary arrays used during the merge process.', 3, 2),

('challenge-algorithms', 'Which algorithm is used to find the shortest path in a weighted graph?', 'Dijkstra\'s algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edges.', 4, 2),

('challenge-algorithms', 'What is the average time complexity of hash table operations?', 'With a good hash function and proper load factor, hash table operations (insert, delete, search) have O(1) average time complexity.', 5, 2);

-- Multiple choice options for algorithms challenge
INSERT INTO multiple_choice_options (question_id, option_id, option_text, is_correct, display_order) 
VALUES 
-- Algorithm Question 1 (Binary Search)
(6, 'A', 'O(n)', FALSE, 1),
(6, 'B', 'O(log n)', TRUE, 2),
(6, 'C', 'O(n log n)', FALSE, 3),
(6, 'D', 'O(1)', FALSE, 4),

-- Algorithm Question 2 (LRU Cache)
(7, 'A', 'Array + Binary Search Tree', FALSE, 1),
(7, 'B', 'HashMap + Doubly Linked List', TRUE, 2),
(7, 'C', 'Stack + Queue', FALSE, 3),
(7, 'D', 'Heap + Hash Table', FALSE, 4),

-- Algorithm Question 3 (Merge Sort Space)
(8, 'A', 'O(1)', FALSE, 1),
(8, 'B', 'O(log n)', FALSE, 2),
(8, 'C', 'O(n)', TRUE, 3),
(8, 'D', 'O(n²)', FALSE, 4),

-- Algorithm Question 4 (Shortest Path)
(9, 'A', 'Breadth-First Search', FALSE, 1),
(9, 'B', 'Depth-First Search', FALSE, 2),
(9, 'C', 'Dijkstra\'s Algorithm', TRUE, 3),
(9, 'D', 'Binary Search', FALSE, 4),

-- Algorithm Question 5 (Hash Table)
(10, 'A', 'O(1)', TRUE, 1),
(10, 'B', 'O(log n)', FALSE, 2),
(10, 'C', 'O(n)', FALSE, 3),
(10, 'D', 'O(n²)', FALSE, 4);

-- CSS Challenge questions
INSERT INTO multiple_choice_questions (challenge_id, question_text, explanation, display_order, points) 
VALUES 
('challenge-css', 'Which CSS property is used to create a flexible container?', 'The display: flex property creates a flex container, enabling flexbox layout for its children.', 1, 1),

('challenge-css', 'What does the CSS Grid property "grid-template-areas" do?', 'grid-template-areas allows you to define named grid areas, making it easier to place items using area names.', 2, 1),

('challenge-css', 'Which media query targets devices with a maximum width of 768px?', 'The @media (max-width: 768px) media query applies styles to devices with screen width of 768px or less.', 3, 1),

('challenge-css', 'What is the default value of the CSS "position" property?', 'The default value of the position property is "static", which means the element is positioned according to normal document flow.', 4, 1);

-- CSS Challenge options
INSERT INTO multiple_choice_options (question_id, option_id, option_text, is_correct, display_order) 
VALUES 
-- CSS Question 1 (Flexbox)
(11, 'A', 'display: flex', TRUE, 1),
(11, 'B', 'display: grid', FALSE, 2),
(11, 'C', 'display: block', FALSE, 3),
(11, 'D', 'display: inline-flex', FALSE, 4),

-- CSS Question 2 (Grid Areas)
(12, 'A', 'Defines the size of grid items', FALSE, 1),
(12, 'B', 'Creates named grid areas for easier item placement', TRUE, 2),
(12, 'C', 'Sets the gap between grid items', FALSE, 3),
(12, 'D', 'Aligns grid items vertically', FALSE, 4),

-- CSS Question 3 (Media Query)
(13, 'A', '@media (min-width: 768px)', FALSE, 1),
(13, 'B', '@media (max-width: 768px)', TRUE, 2),
(13, 'C', '@media screen and (width: 768px)', FALSE, 3),
(13, 'D', '@media only (max-device-width: 768px)', FALSE, 4),

-- CSS Question 4 (Position Default)
(14, 'A', 'relative', FALSE, 1),
(14, 'B', 'absolute', FALSE, 2),
(14, 'C', 'static', TRUE, 3),
(14, 'D', 'fixed', FALSE, 4);

-- Link new challenges to assessments
INSERT INTO assessment_challenges (assessment_id, challenge_id, display_order, weight) 
VALUES 
-- Full-stack assessment
('assessment-fullstack', 'challenge-1', 1, 1.0),
('assessment-fullstack', 'challenge-api', 2, 1.5),
('assessment-fullstack', 'challenge-database', 3, 1.0),
('assessment-fullstack', 'challenge-react-advanced', 4, 1.5),

-- Junior assessment
('assessment-junior', 'challenge-2', 1, 1.0),
('assessment-junior', 'challenge-3', 2, 1.0),
('assessment-junior', 'challenge-css', 3, 1.0),

-- Senior assessment
('assessment-senior', 'challenge-algorithms', 1, 1.0),
('assessment-senior', 'challenge-system-design', 2, 2.0),
('assessment-senior', 'challenge-react-advanced', 3, 1.5),
('assessment-senior', 'challenge-api', 4, 1.5);

-- Sample candidates
INSERT INTO candidates (id, name, email, phone) 
VALUES 
('candidate-001', 'John Smith', 'john.smith@email.com', '+1-555-0123'),
('candidate-002', 'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0124'),
('candidate-003', 'Michael Chen', 'michael.chen@email.com', '+1-555-0125'),
('candidate-004', 'Emily Rodriguez', 'emily.rodriguez@email.com', '+1-555-0126'),
('candidate-005', 'David Kim', 'david.kim@email.com', '+1-555-0127'),
('candidate-006', 'Lisa Thompson', 'lisa.thompson@email.com', '+1-555-0128'),
('candidate-007', 'James Wilson', 'james.wilson@email.com', '+1-555-0129'),
('candidate-008', 'Anna Martinez', 'anna.martinez@email.com', '+1-555-0130');

-- Sample assessment sessions
INSERT INTO assessment_sessions (id, assessment_id, candidate_id, status, started_at, completed_at, expires_at, total_score, passing_score, is_passed, session_token, ip_address) 
VALUES 
('session-001', 'assessment-123', 'candidate-001', 'completed', '2024-01-15 09:00:00', '2024-01-15 10:45:00', '2024-01-15 11:00:00', 85.50, 70.00, TRUE, 'tok_abc123def456', '192.168.1.100'),
('session-002', 'assessment-123', 'candidate-002', 'completed', '2024-01-15 14:30:00', '2024-01-15 16:10:00', '2024-01-15 16:30:00', 62.00, 70.00, FALSE, 'tok_ghi789jkl012', '192.168.1.101'),
('session-003', 'assessment-fullstack', 'candidate-003', 'completed', '2024-01-16 10:00:00', '2024-01-16 12:50:00', '2024-01-16 13:00:00', 78.25, 75.00, TRUE, 'tok_mno345pqr678', '192.168.1.102'),
('session-004', 'assessment-junior', 'candidate-004', 'completed', '2024-01-16 15:00:00', '2024-01-16 16:15:00', '2024-01-16 16:30:00', 72.50, 65.00, TRUE, 'tok_stu901vwx234', '192.168.1.103'),
('session-005', 'assessment-senior', 'candidate-005', 'in_progress', '2024-01-17 09:30:00', NULL, '2024-01-17 13:30:00', NULL, 80.00, NULL, 'tok_yza567bcd890', '192.168.1.104'),
('session-006', 'assessment-123', 'candidate-006', 'started', '2024-01-17 11:00:00', NULL, '2024-01-17 13:00:00', NULL, 70.00, NULL, 'tok_efg123hij456', '192.168.1.105'),
('session-007', 'assessment-fullstack', 'candidate-007', 'expired', '2024-01-17 08:00:00', NULL, '2024-01-17 11:00:00', NULL, 75.00, NULL, 'tok_klm789nop012', '192.168.1.106'),
('session-008', 'assessment-junior', 'candidate-008', 'completed', '2024-01-17 13:00:00', '2024-01-17 14:20:00', '2024-01-17 14:30:00', 68.00, 65.00, TRUE, 'tok_qrs345tuv678', '192.168.1.107');

-- Sample challenge submissions
INSERT INTO challenge_submissions (id, session_id, challenge_id, candidate_id, submission_type, status, submitted_at, time_spent_seconds, score, max_score) 
VALUES 
('sub-001', 'session-001', 'challenge-1', 'candidate-001', 'code', 'submitted', '2024-01-15 09:45:00', 2700, 90.00, 100.00),
('sub-002', 'session-001', 'challenge-2', 'candidate-001', 'open-ended', 'submitted', '2024-01-15 10:15:00', 1800, 85.00, 100.00),
('sub-003', 'session-001', 'challenge-3', 'candidate-001', 'multiple-choice', 'submitted', '2024-01-15 10:40:00', 1500, 80.00, 100.00),

('sub-004', 'session-002', 'challenge-1', 'candidate-002', 'code', 'submitted', '2024-01-15 15:20:00', 3000, 70.00, 100.00),
('sub-005', 'session-002', 'challenge-2', 'candidate-002', 'open-ended', 'submitted', '2024-01-15 15:50:00', 1800, 55.00, 100.00),
('sub-006', 'session-002', 'challenge-3', 'candidate-002', 'multiple-choice', 'submitted', '2024-01-15 16:05:00', 900, 60.00, 100.00),

('sub-007', 'session-003', 'challenge-1', 'candidate-003', 'code', 'submitted', '2024-01-16 10:50:00', 3000, 85.00, 100.00),
('sub-008', 'session-003', 'challenge-api', 'candidate-003', 'code', 'submitted', '2024-01-16 12:00:00', 4200, 75.00, 100.00),
('sub-009', 'session-003', 'challenge-database', 'candidate-003', 'open-ended', 'submitted', '2024-01-16 12:30:00', 1800, 80.00, 100.00),
('sub-010', 'session-003', 'challenge-react-advanced', 'candidate-003', 'code', 'submitted', '2024-01-16 12:45:00', 900, 72.50, 100.00),

('sub-011', 'session-004', 'challenge-2', 'candidate-004', 'open-ended', 'submitted', '2024-01-16 15:30:00', 1800, 75.00, 100.00),
('sub-012', 'session-004', 'challenge-3', 'candidate-004', 'multiple-choice', 'submitted', '2024-01-16 15:55:00', 1500, 80.00, 100.00),
('sub-013', 'session-004', 'challenge-css', 'candidate-004', 'multiple-choice', 'submitted', '2024-01-16 16:10:00', 900, 62.50, 100.00),

('sub-014', 'session-008', 'challenge-2', 'candidate-008', 'open-ended', 'submitted', '2024-01-17 13:30:00', 1800, 70.00, 100.00),
('sub-015', 'session-008', 'challenge-3', 'candidate-008', 'multiple-choice', 'submitted', '2024-01-17 13:55:00', 1500, 70.00, 100.00),
('sub-016', 'session-008', 'challenge-css', 'candidate-008', 'multiple-choice', 'submitted', '2024-01-17 14:15:00', 1200, 64.00, 100.00);

-- Sample code submission files
INSERT INTO code_submission_files (submission_id, file_name, file_content, language) 
VALUES 
('sub-001', 'UserList.jsx', 'import React, { useState, useMemo } from \'react\';\n\nconst UserList = ({ users }) => {\n  const [searchTerm, setSearchTerm] = useState(\'\');\n  const [loading, setLoading] = useState(false);\n\n  const filteredUsers = useMemo(() => {\n    return users.filter(user =>\n      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||\n      user.email.toLowerCase().includes(searchTerm.toLowerCase())\n    );\n  }, [users, searchTerm]);\n\n  if (loading) {\n    return <div className="loading">Loading users...</div>;\n  }\n\n  return (\n    <div className="user-list">\n      <input\n        type="text"\n        placeholder="Search users..."\n        value={searchTerm}\n        onChange={(e) => setSearchTerm(e.target.value)}\n        className="search-input"\n      />\n      \n      {filteredUsers.length === 0 ? (\n        <div className="empty-state">No users found</div>\n      ) : (\n        <div className="users">\n          {filteredUsers.map(user => (\n            <div key={user.id} className="user-card">\n              <img src={user.avatar} alt={user.name} className="avatar" />\n              <div className="user-info">\n                <h3>{user.name}</h3>\n                <p>{user.email}</p>\n              </div>\n            </div>\n          ))}\n        </div>\n      )}\n    </div>\n  );\n};\n\nexport default UserList;', 'javascript'),

('sub-007', 'UserList.jsx', 'import React, { useState, useEffect, useMemo } from \'react\';\nimport PropTypes from \'prop-types\';\n\nconst UserList = ({ users, onUserSelect }) => {\n  const [searchTerm, setSearchTerm] = useState(\'\');\n  const [sortBy, setSortBy] = useState(\'name\');\n  const [sortOrder, setSortOrder] = useState(\'asc\');\n\n  const sortedAndFilteredUsers = useMemo(() => {\n    let filtered = users.filter(user =>\n      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||\n      user.email.toLowerCase().includes(searchTerm.toLowerCase())\n    );\n\n    return filtered.sort((a, b) => {\n      const aVal = a[sortBy];\n      const bVal = b[sortBy];\n      if (sortOrder === \'asc\') {\n        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;\n      }\n      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;\n    });\n  }, [users, searchTerm, sortBy, sortOrder]);\n\n  return (\n    <div className="user-list-container">\n      <div className="controls">\n        <input\n          type="text"\n          placeholder="Search users..."\n          value={searchTerm}\n          onChange={(e) => setSearchTerm(e.target.value)}\n        />\n        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>\n          <option value="name">Name</option>\n          <option value="email">Email</option>\n        </select>\n      </div>\n      \n      <div className="user-grid">\n        {sortedAndFilteredUsers.map(user => (\n          <div \n            key={user.id} \n            className="user-card"\n            onClick={() => onUserSelect?.(user)}\n          >\n            <img src={user.avatar} alt={user.name} />\n            <h4>{user.name}</h4>\n            <p>{user.email}</p>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n};\n\nUserList.propTypes = {\n  users: PropTypes.array.isRequired,\n  onUserSelect: PropTypes.func\n};\n\nexport default UserList;', 'javascript'),

('sub-008', 'server.js', 'const express = require(\'express\');\nconst jwt = require(\'jsonwebtoken\');\nconst bcrypt = require(\'bcryptjs\');\nconst { body, validationResult } = require(\'express-validator\');\n\nconst app = express();\napp.use(express.json());\n\n// Mock data\nconst users = [\n  { id: 1, username: \'admin\', password: \'$2a$10$hash\' }\n];\nconst tasks = [];\nlet taskIdCounter = 1;\n\n// Authentication middleware\nconst authenticateToken = (req, res, next) => {\n  const authHeader = req.headers[\'authorization\'];\n  const token = authHeader && authHeader.split(\' \')[1];\n\n  if (!token) {\n    return res.status(401).json({ error: \'Access token required\' });\n  }\n\n  jwt.verify(token, \'secret_key\', (err, user) => {\n    if (err) return res.status(403).json({ error: \'Invalid token\' });\n    req.user = user;\n    next();\n  });\n};\n\n// Routes\napp.post(\'/auth/login\', [\n  body(\'username\').notEmpty(),\n  body(\'password\').notEmpty()\n], (req, res) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) {\n    return res.status(400).json({ errors: errors.array() });\n  }\n\n  const { username, password } = req.body;\n  const user = users.find(u => u.username === username);\n  \n  if (!user || !bcrypt.compareSync(password, user.password)) {\n    return res.status(401).json({ error: \'Invalid credentials\' });\n  }\n\n  const token = jwt.sign({ userId: user.id }, \'secret_key\');\n  res.json({ token, user: { id: user.id, username: user.username } });\n});\n\napp.get(\'/tasks\', authenticateToken, (req, res) => {\n  res.json(tasks);\n});\n\napp.post(\'/tasks\', [authenticateToken, body(\'title\').notEmpty()], (req, res) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) {\n    return res.status(400).json({ errors: errors.array() });\n  }\n\n  const task = {\n    id: taskIdCounter++,\n    title: req.body.title,\n    description: req.body.description || \'\',\n    completed: false,\n    userId: req.user.userId,\n    createdAt: new Date().toISOString()\n  };\n  \n  tasks.push(task);\n  res.status(201).json(task);\n});\n\nmodule.exports = app;', 'javascript');

-- Sample multiple choice answers
INSERT INTO multiple_choice_answers (submission_id, question_id, selected_option_id, is_correct, points_earned) 
VALUES 
-- Candidate 001 answers (challenge-3)
('sub-003', 1, 'B', TRUE, 1.0),
('sub-003', 2, 'D', TRUE, 1.0),
('sub-003', 3, 'D', TRUE, 1.0),
('sub-003', 4, 'C', TRUE, 1.0),
('sub-003', 5, 'B', TRUE, 1.0),

-- Candidate 002 answers (challenge-3) - some wrong
('sub-006', 1, 'A', FALSE, 0.0),
('sub-006', 2, 'D', TRUE, 1.0),
('sub-006', 3, 'C', FALSE, 0.0),
('sub-006', 4, 'C', TRUE, 1.0),
('sub-006', 5, 'A', FALSE, 0.0),

-- Candidate 004 answers (challenge-3)
('sub-012', 1, 'B', TRUE, 1.0),
('sub-012', 2, 'D', TRUE, 1.0),
('sub-012', 3, 'D', TRUE, 1.0),
('sub-012', 4, 'C', TRUE, 1.0),
('sub-012', 5, 'B', TRUE, 1.0),

-- Candidate 004 answers (challenge-css)
('sub-013', 11, 'A', TRUE, 1.0),
('sub-013', 12, 'B', TRUE, 1.0),
('sub-013', 13, 'A', FALSE, 0.0),
('sub-013', 14, 'C', TRUE, 1.0),

-- Candidate 008 answers (challenge-3)
('sub-015', 1, 'B', TRUE, 1.0),
('sub-015', 2, 'C', FALSE, 0.0),
('sub-015', 3, 'D', TRUE, 1.0),
('sub-015', 4, 'C', TRUE, 1.0),
('sub-015', 5, 'B', TRUE, 1.0),

-- Candidate 008 answers (challenge-css)
('sub-016', 11, 'A', TRUE, 1.0),
('sub-016', 12, 'A', FALSE, 0.0),
('sub-016', 13, 'B', TRUE, 1.0),
('sub-016', 14, 'C', TRUE, 1.0);

-- Sample session activity logs
INSERT INTO session_activity (session_id, activity_type, challenge_id, timestamp, details, ip_address) 
VALUES 
('session-001', 'login', NULL, '2024-01-15 09:00:00', '{"user_agent": "Mozilla/5.0 Chrome"}', '192.168.1.100'),
('session-001', 'challenge_start', 'challenge-1', '2024-01-15 09:05:00', '{"challenge_title": "React Component Implementation"}', '192.168.1.100'),
('session-001', 'challenge_submit', 'challenge-1', '2024-01-15 09:45:00', '{"time_spent": 2700, "auto_submit": false}', '192.168.1.100'),
('session-001', 'challenge_start', 'challenge-2', '2024-01-15 09:46:00', '{"challenge_title": "Algorithm Problem"}', '192.168.1.100'),
('session-001', 'challenge_submit', 'challenge-2', '2024-01-15 10:15:00', '{"time_spent": 1800, "auto_submit": false}', '192.168.1.100'),
('session-001', 'challenge_start', 'challenge-3', '2024-01-15 10:16:00', '{"challenge_title": "JavaScript Fundamentals Quiz"}', '192.168.1.100'),
('session-001', 'challenge_submit', 'challenge-3', '2024-01-15 10:40:00', '{"time_spent": 1500, "auto_submit": false}', '192.168.1.100'),

('session-002', 'login', NULL, '2024-01-15 14:30:00', '{"user_agent": "Mozilla/5.0 Safari"}', '192.168.1.101'),
('session-002', 'challenge_start', 'challenge-1', '2024-01-15 14:35:00', '{"challenge_title": "React Component Implementation"}', '192.168.1.101'),
('session-002', 'challenge_submit', 'challenge-1', '2024-01-15 15:20:00', '{"time_spent": 3000, "auto_submit": false}', '192.168.1.101'),

('session-007', 'login', NULL, '2024-01-17 08:00:00', '{"user_agent": "Mozilla/5.0 Firefox"}', '192.168.1.106'),
('session-007', 'challenge_start', 'challenge-1', '2024-01-17 08:05:00', '{"challenge_title": "React Component Implementation"}', '192.168.1.106'),
('session-007', 'timeout', NULL, '2024-01-17 11:00:00', '{"reason": "Assessment time limit exceeded"}', '192.168.1.106');

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

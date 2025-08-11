// Dummy API services for the assessment platform

// --- TYPE DEFINITIONS ---

// Defines the structure for a file in a coding challenge
interface CodeFile {
	content: string;
	language: string;
}

// Defines an option for a multiple-choice question
interface QuestionOption {
	id: string;
	text: string;
}

// Defines a single multiple-choice question
interface Question {
	id: string;
	question: string;
	options: QuestionOption[];
	correctAnswer: string;
	explanation: string;
}

// Defines the main Challenge structure
// It uses optional properties to accommodate different challenge types
export interface Challenge {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	instructions: string;
	timeLimit: number; // in minutes
	language?: string;
	files?: Record<string, CodeFile>;
	questions?: Question[];
}

// A summarized version of a challenge for list views
export type ChallengeSummary = Pick<
	Challenge,
	"id" | "title" | "type" | "description" | "timeLimit"
>;

// Defines the Assessment structure
export interface Assessment {
	id: string;
	title: string;
	description: string;
	challenges: string[]; // Array of challenge IDs
	timeLimit?: number; // Total assessment time limit in minutes
}

// --- MOCK DATA ---

const mockAssessments: Record<string, Assessment> = {
	"assessment-123": {
		id: "assessment-123",
		title: "Frontend Developer Assessment",
		description:
			"Complete this assessment for the frontend developer position.",
		challenges: ["challenge-1", "challenge-2", "challenge-3", "challenge-4"],
		timeLimit: 180, // 3 hours total assessment time
	},
};

const mockChallenges: Record<string, Challenge> = {
	"challenge-1": {
		id: "challenge-1",
		title: "Full-Stack React Application",
		type: "code",
		description:
			"Create a complete React application with components, utilities, and tests organized in folders.",
		instructions: `# Full-Stack React Challenge

Build a React application with the following requirements:

## Project Structure
Organize your code with proper folder structure:
- Components in \`src/components/\`
- Utilities in \`src/utils/\`
- Tests in \`src/tests/\`
- Configuration in \`config/\`

## Requirements
1. Create a UserList component that displays users
2. Add a search utility function
3. Create unit tests for your components
4. Add configuration files for different environments

## Features to Implement
- User listing with search functionality
- Responsive design
- Error handling
- Unit tests with good coverage

Use the provided folder structure and create additional files as needed.`,
		language: "javascript",
		timeLimit: 90,
		files: {
			"src/App.jsx": {
				content: `import React from 'react';
import UserList from './components/UserList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Management System</h1>
      </header>
      <main>
        {/* TODO: Add UserList component here */}
      </main>
    </div>
  );
}

export default App;`,
				language: "javascript",
			},
			"src/components/UserList.jsx": {
				content: `import React, { useState, useEffect } from 'react';
import { searchUsers } from '../utils/searchUtils';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // TODO: Implement component logic
  // 1. Load users data
  // 2. Handle search functionality
  // 3. Display users in a responsive layout

  return (
    <div className="user-list">
      <h2>User List</h2>
      {/* TODO: Add search input and user display */}
    </div>
  );
};

export default UserList;`,
				language: "javascript",
			},
			"src/utils/searchUtils.js": {
				content: `/**
 * Utility functions for searching and filtering users
 */

/**
 * Search users by name, email, or other fields
 * @param {Array} users - Array of user objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered array of users
 */
export const searchUsers = (users, searchTerm) => {
  // TODO: Implement search functionality
  // Should be case-insensitive and search multiple fields
  return users;
};

/**
 * Sort users by specified field
 * @param {Array} users - Array of user objects
 * @param {string} field - Field to sort by (name, email, etc.)
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted array of users
 */
export const sortUsers = (users, field, direction = 'asc') => {
  // TODO: Implement sorting functionality
  return users;
};`,
				language: "javascript",
			},
			"src/tests/UserList.test.jsx": {
				content: `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../components/UserList';

// TODO: Add comprehensive tests for UserList component

describe('UserList Component', () => {
  test('renders user list title', () => {
    render(<UserList />);
    expect(screen.getByText('User List')).toBeInTheDocument();
  });

  test('should display users when provided', () => {
    // TODO: Test user display functionality
  });

  test('should filter users based on search term', () => {
    // TODO: Test search functionality
  });

  test('should handle empty user list gracefully', () => {
    // TODO: Test edge cases
  });
});`,
				language: "javascript",
			},
			"src/tests/searchUtils.test.js": {
				content: `import { searchUsers, sortUsers } from '../utils/searchUtils';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

describe('searchUsers', () => {
  test('should return all users when search term is empty', () => {
    // TODO: Implement test
  });

  test('should filter users by name', () => {
    // TODO: Implement test
  });

  test('should filter users by email', () => {
    // TODO: Implement test
  });

  test('should be case insensitive', () => {
    // TODO: Implement test
  });
});

describe('sortUsers', () => {
  test('should sort users by name ascending', () => {
    // TODO: Implement test
  });

  test('should sort users by name descending', () => {
    // TODO: Implement test
  });
});`,
				language: "javascript",
			},
			"config/development.json": {
				content: `{
  "apiUrl": "http://localhost:3001",
  "debugMode": true,
  "logLevel": "debug",
  "features": {
    "userSearch": true,
    "userSorting": true,
    "userPagination": false
  },
  "ui": {
    "theme": "light",
    "itemsPerPage": 10
  }
}`,
				language: "json",
			},
			"config/production.json": {
				content: `{
  "apiUrl": "https://api.yourapp.com",
  "debugMode": false,
  "logLevel": "error",
  "features": {
    "userSearch": true,
    "userSorting": true,
    "userPagination": true
  },
  "ui": {
    "theme": "light",
    "itemsPerPage": 20
  }
}`,
				language: "json",
			},
			"package.json": {
				content: `{
  "name": "user-management-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
				language: "json",
			},
			"README.md": {
				content: `# User Management Application

## Overview
This is a React application for managing users with search and sorting capabilities.

## Project Structure
\`\`\`
src/
├── components/
│   └── UserList.jsx
├── utils/
│   └── searchUtils.js
├── tests/
│   ├── UserList.test.jsx
│   └── searchUtils.test.js
└── App.jsx
config/
├── development.json
└── production.json
\`\`\`

## Getting Started
1. Install dependencies: \`npm install\`
2. Start development server: \`npm start\`
3. Run tests: \`npm test\`

## Features
- [x] User listing
- [ ] Search functionality (TODO)
- [ ] Sorting capabilities (TODO)
- [ ] Responsive design (TODO)
- [ ] Unit tests (TODO)

## Development Notes
Complete the TODOs in the components and utility functions to implement all required features.`,
				language: "markdown",
			},
		},
	},
	"challenge-2": {
		id: "challenge-2",
		title: "Algorithm Problem",
		type: "open-ended",
		description: "Solve this algorithmic problem and explain your approach.",
		instructions: `# Two Sum Problem...`, // Content truncated for brevity
		timeLimit: 30,
	},
	"challenge-3": {
		id: "challenge-3",
		title: "JavaScript Fundamentals Quiz",
		type: "multiple-choice",
		description: "Test your knowledge of JavaScript fundamentals.",
		instructions: "Answer the following multiple-choice questions.",
		timeLimit: 25,
		questions: [
			{
				id: "Q1",
				question: "What is the output of `console.log(typeof null);`?",
				options: [
					{ id: "A", text: '"null"' },
					{ id: "B", text: '"object"' },
					{ id: "C", text: '"undefined"' },
					{ id: "D", text: '"boolean"' },
				],
				correctAnswer: "B",
				explanation: "This is a well-known quirk in JavaScript.",
			},
			// More questions...
		],
	},
	"challenge-4": {
		id: "challenge-4",
		title: "System Design Question",
		type: "open-ended",
		description: "Design a simple system architecture.",
		instructions: `# System Design: URL Shortener...`, // Content truncated for brevity
		timeLimit: 45,
	},
};

// --- API SERVICE ---

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SubmissionResponse {
	success: boolean;
	submissionId: string;
	timestamp: string;
	message: string;
}

// Updated to match API contract
export interface CodeSubmission {
	challengeId: string;
	type: "code";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	files: Record<string, string>; // file path -> file content as string (matches API contract)
	language: string;
	timestamp: string;
}

export interface OpenEndedSubmission {
	challengeId: string;
	type: "open-ended";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	answer: string;
	timestamp: string;
}

export interface MultipleChoiceSubmission {
	challengeId: string;
	type: "multiple-choice";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	answers: Record<string, string>; // questionId -> selectedOptionId
	timestamp: string;
	autoSubmit?: boolean;
}

interface AssessmentSubmissionResponse extends SubmissionResponse {
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
}

interface AuthResponse {
	success: boolean;
	candidateId: string;
	name: string;
	email: string;
	assessmentId: string;
	token: string; // Mock token
	timeLimit: number; // Assessment time limit in minutes
	startedAt?: string; // ISO timestamp when assessment started
}

interface AssessmentSession {
	assessmentId: string;
	candidateId: string;
	name: string;
	email: string;
	timeLimit: number;
	startedAt: string;
	remainingTimeSeconds: number;
	isExpired: boolean;
}

// Mock sessions storage
interface MockSession {
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	startedAt: string;
	submissions: Record<string, unknown>;
	isFinalized: boolean;
	finalizedAt?: string;
}

const mockSessions: Record<string, MockSession> = {};

// Helper functions for localStorage persistence
function saveToLocalStorage() {
	localStorage.setItem("mockSessions", JSON.stringify(mockSessions));
}

function loadFromLocalStorage() {
	const stored = localStorage.getItem("mockSessions");
	if (stored) {
		Object.assign(mockSessions, JSON.parse(stored));
	}
}

// Load existing sessions on initialization
loadFromLocalStorage();

import { post } from "./httpClient";
import type { AuthenticateRequestDTO, AuthenticateResponseDTO } from "./dto/auth";

export const apiService = {
	async getAssessment(assessmentId: string): Promise<Assessment> {
		await delay(500);
		const assessment = mockAssessments[assessmentId];
		if (!assessment) {
			throw new Error("Assessment not found");
		}
		return assessment;
	},

	async getChallenges(assessmentId: string): Promise<ChallengeSummary[]> {
		await delay(300);
		const assessment = mockAssessments[assessmentId];
		if (!assessment) {
			throw new Error("Assessment not found");
		}

		return assessment.challenges.map((challengeId) => {
			const challenge = mockChallenges[challengeId];
			return {
				id: challenge.id,
				title: challenge.title,
				type: challenge.type,
				description: challenge.description,
				timeLimit: challenge.timeLimit,
			};
		});
	},

	async getChallengeDetails(challengeId: string): Promise<Challenge> {
		await delay(400);
		const challenge = mockChallenges[challengeId];
		if (!challenge) {
			throw new Error("Challenge not found");
		}
		return challenge;
	},

	async submitChallenge(
		submission: CodeSubmission | OpenEndedSubmission | MultipleChoiceSubmission,
	): Promise<SubmissionResponse> {
		await delay(800);
		console.log("Submitting challenge:", submission);

		// Validate required fields based on API contract
		if (
			!submission.challengeId ||
			!submission.assessmentId ||
			!submission.candidateName ||
			!submission.candidateEmail
		) {
			throw new Error("Missing required submission fields");
		}

		// Validate submission type specific fields
		if (submission.type === "code") {
			const codeSubmission = submission as CodeSubmission;
			if (
				!codeSubmission.files ||
				Object.keys(codeSubmission.files).length === 0
			) {
				throw new Error("Code submission must include files");
			}
			if (!codeSubmission.language) {
				throw new Error("Code submission must include language");
			}

			// Log the folder structure for debugging
			console.log("Code submission with files:");
			Object.keys(codeSubmission.files).forEach((filePath) => {
				console.log(
					`- ${filePath}: ${codeSubmission.files[filePath].length} characters`,
				);
				// Show folder structure
				if (filePath.includes("/")) {
					const parts = filePath.split("/");
					const folder = parts.slice(0, -1).join("/");
					const fileName = parts[parts.length - 1];
					console.log(`  Folder: ${folder}, File: ${fileName}`);
				}
			});
		} else if (submission.type === "multiple-choice") {
			const mcSubmission = submission as MultipleChoiceSubmission;
			if (
				!mcSubmission.answers ||
				Object.keys(mcSubmission.answers).length === 0
			) {
				throw new Error("Multiple choice submission must include answers");
			}
		} else if (submission.type === "open-ended") {
			const oeSubmission = submission as OpenEndedSubmission;
			if (!oeSubmission.answer || oeSubmission.answer.trim().length === 0) {
				throw new Error("Open-ended submission must include answer");
			}
		}

		return {
			success: true,
			submissionId: `submission-${Date.now()}`,
			timestamp: new Date().toISOString(),
			message: "Challenge submitted successfully",
		};
	},

	async submitAssessment(data: {
		assessmentId: string;
		candidateName: string;
		candidateEmail: string;
	}): Promise<AssessmentSubmissionResponse> {
		await delay(1000);
		console.log("Submitting assessment:", data);

		return {
			success: true,
			assessmentId: data.assessmentId,
			candidateName: data.candidateName,
			candidateEmail: data.candidateEmail,
			submissionId: `assessment-${Date.now()}`,
			timestamp: new Date().toISOString(),
			message: "Assessment submitted successfully",
		};
	},

	async authenticate(
		name: string,
		email: string,
		assessmentId: string,
	): Promise<AuthResponse> {
		if (!name || !email || !assessmentId) {
			throw new Error("Name, email, and assessment ID are required");
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}

		const { data } = await post<
			AuthenticateRequestDTO,
			AuthenticateResponseDTO
		>("/assessments/authenticate", {
			name,
			email,
			assessment_id: assessmentId,
		});

		if (!data?.response_detail?.success) {
			const code = data?.response_schema?.response_code || "UNKNOWN";
			const msg = data?.response_schema?.response_message || "Authentication failed";
			throw new Error(`${code}: ${msg}`);
		}

		const d = data.response_detail;
		return {
			success: d.success,
			candidateId: d.candidate_id,
			name: d.name,
			email: d.email,
			assessmentId: d.assessment_id,
			token: d.token,
			timeLimit: d.time_limit_minutes,
			startedAt: d.start_at,
		};
	},

	async getAssessmentSession(
		assessmentId: string,
		email: string,
	): Promise<AssessmentSession> {
		await delay(200);

		if (!assessmentId || !email) {
			throw new Error("Assessment ID and email are required");
		}

		const assessment = mockAssessments[assessmentId];
		if (!assessment) {
			throw new Error("Assessment not found");
		}

		// Get session from "backend" (localStorage mock)
		const sessionKey = `assessment_${assessmentId}_${email}`;
		const sessionData = localStorage.getItem(sessionKey);

		if (!sessionData) {
			throw new Error(
				"No active assessment session found. Please login first.",
			);
		}

		const session = JSON.parse(sessionData);
		const timeLimit = session.timeLimit || assessment.timeLimit || 180;
		const timeLimitMs = timeLimit * 60 * 1000;
		const startTime = new Date(session.startedAt);
		const currentTime = new Date();
		const elapsed = currentTime.getTime() - startTime.getTime();
		const remaining = Math.max(0, timeLimitMs - elapsed);
		const remainingTimeSeconds = Math.floor(remaining / 1000);
		const isExpired = remaining <= 0;

		return {
			assessmentId,
			candidateId: session.candidateId,
			name: session.name,
			email: session.email,
			timeLimit,
			startedAt: session.startedAt,
			remainingTimeSeconds,
			isExpired,
		};
	},

	async authenticateCandidate(
		assessmentId: string,
		candidateName: string,
		candidateEmail: string,
	): Promise<{ success: boolean; session?: MockSession; error?: string }> {
		await delay(500);

		// Basic validation
		if (!candidateName.trim() || !candidateEmail.trim()) {
			return {
				success: false,
				error: "Name and email are required",
			};
		}

		if (!candidateEmail.includes("@")) {
			return {
				success: false,
				error: "Please enter a valid email address",
			};
		}

		// Check if assessment exists
		if (!mockAssessments[assessmentId]) {
			return {
				success: false,
				error: "Assessment not found",
			};
		}

		// Create or get existing session
		const sessionKey = `${assessmentId}_${candidateEmail}`;
		const existingSession = mockSessions[sessionKey];

		if (existingSession) {
			return {
				success: true,
				session: existingSession,
			};
		}

		// Create new session
		const newSession = {
			assessmentId,
			candidateName,
			candidateEmail,
			startedAt: new Date().toISOString(),
			submissions: {},
			isFinalized: false,
		};

		mockSessions[sessionKey] = newSession;
		saveToLocalStorage();

		return {
			success: true,
			session: newSession,
		};
	},

	async finalizeAssessment(
		assessmentId: string,
		candidateEmail: string,
	): Promise<{ success: boolean; error?: string }> {
		await delay(500);

		const sessionKey = `${assessmentId}_${candidateEmail}`;
		const session = mockSessions[sessionKey];

		if (!session) {
			return {
				success: false,
				error: "Session not found",
			};
		}

		if (session.isFinalized) {
			return {
				success: false,
				error: "Assessment already finalized",
			};
		}

		// Mark session as finalized
		session.isFinalized = true;
		session.finalizedAt = new Date().toISOString();

		saveToLocalStorage();

		return { success: true };
	},
};

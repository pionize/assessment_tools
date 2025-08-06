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
  type: 'code' | 'open-ended' | 'multiple-choice';
  description: string;
  instructions: string;
  timeLimit: number; // in minutes
  language?: string;
  files?: Record<string, CodeFile>;
  questions?: Question[];
}

// A summarized version of a challenge for list views
export type ChallengeSummary = Pick<Challenge, 'id' | 'title' | 'type' | 'description' | 'timeLimit'>;

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
  'assessment-123': {
    id: 'assessment-123',
    title: 'Frontend Developer Assessment',
    description: 'Complete this assessment for the frontend developer position.',
    challenges: ['challenge-1', 'challenge-2', 'challenge-3', 'challenge-4'],
    timeLimit: 180, // 3 hours total assessment time
  },
};

const mockChallenges: Record<string, Challenge> = {
  'challenge-1': {
    id: 'challenge-1',
    title: 'React Component Implementation',
    type: 'code',
    description: 'Create a reusable React component that displays a list of users with search functionality.',
    instructions: `# React Component Challenge...`, // Content truncated for brevity
    language: 'javascript',
    timeLimit: 60,
    files: {
      'UserList.jsx': {
        content: '// Implement your UserList component here',
        language: 'javascript',
      },
      'App.jsx': {
        content: "import UserList from './UserList';",
        language: 'javascript',
      },
    },
  },
  'challenge-2': {
    id: 'challenge-2',
    title: 'Algorithm Problem',
    type: 'open-ended',
    description: 'Solve this algorithmic problem and explain your approach.',
    instructions: `# Two Sum Problem...`, // Content truncated for brevity
    timeLimit: 30,
  },
  'challenge-3': {
    id: 'challenge-3',
    title: 'JavaScript Fundamentals Quiz',
    type: 'multiple-choice',
    description: 'Test your knowledge of JavaScript fundamentals.',
    instructions: 'Answer the following multiple-choice questions.',
    timeLimit: 25,
    questions: [
      {
        id: 'Q1',
        question: 'What is the output of `console.log(typeof null);`?',
        options: [
          { id: 'A', text: '"null"' },
          { id: 'B', text: '"object"' },
          { id: 'C', text: '"undefined"' },
          { id: 'D', text: '"boolean"' },
        ],
        correctAnswer: 'B',
        explanation: 'This is a well-known quirk in JavaScript.',
      },
      // More questions...
    ],
  },
  'challenge-4': {
    id: 'challenge-4',
    title: 'System Design Question',
    type: 'open-ended',
    description: 'Design a simple system architecture.',
    instructions: `# System Design: URL Shortener...`, // Content truncated for brevity
    timeLimit: 45,
  },
};

// --- API SERVICE ---

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface SubmissionResponse {
    success: boolean;
    submissionId: string;
    timestamp: string;
    message: string;
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

export const apiService = {
  async getAssessment(assessmentId: string): Promise<Assessment> {
    await delay(500);
    const assessment = mockAssessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    return assessment;
  },

  async getChallenges(assessmentId: string): Promise<ChallengeSummary[]> {
    await delay(300);
    const assessment = mockAssessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    return assessment.challenges.map(challengeId => {
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
      throw new Error('Challenge not found');
    }
    return challenge;
  },

  async submitChallenge(data: { challengeId: string; submission: any }): Promise<SubmissionResponse> {
    await delay(800);
    console.log('Submitting challenge:', data);
    
    return {
      success: true,
      submissionId: `submission-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Challenge submitted successfully',
    };
  },

  async submitAssessment(data: { assessmentId: string; candidateName: string; candidateEmail: string }): Promise<AssessmentSubmissionResponse> {
    await delay(1000);
    console.log('Submitting assessment:', data);
    
    return {
      success: true,
      assessmentId: data.assessmentId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      submissionId: `assessment-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Assessment submitted successfully',
    };
  },

  async authenticate(name: string, email: string, assessmentId: string): Promise<AuthResponse> {
    await delay(300);
    
    if (!name || !email || !assessmentId) {
      throw new Error('Name, email, and assessment ID are required');
    }
    
    const assessment = mockAssessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // Check if user has existing session (mock localStorage check)
    const existingSession = localStorage.getItem(`assessment_${assessmentId}_${email}`);
    let startedAt = null;
    
    if (existingSession) {
      const sessionData = JSON.parse(existingSession);
      startedAt = sessionData.startedAt;
    } else {
      // First time login - set start time
      startedAt = new Date().toISOString();
      localStorage.setItem(`assessment_${assessmentId}_${email}`, JSON.stringify({
        startedAt,
        name,
        email
      }));
    }
    
    return {
      success: true,
      candidateId: `candidate-${Date.now()}`,
      name,
      email,
      assessmentId,
      token: `token-${Date.now()}`,
      timeLimit: assessment.timeLimit || 180,
      startedAt
    };
  }
};
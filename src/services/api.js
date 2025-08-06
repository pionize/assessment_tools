// Dummy API services untuk assessment

const BASE_URL = 'https://api.example.com'; // Dummy URL

// Mock data
const mockAssessments = {
  'assessment-123': {
    id: 'assessment-123',
    title: 'Frontend Developer Assessment',
    description: 'Complete assessment for frontend developer position',
    challenges: ['challenge-1', 'challenge-2', 'challenge-3', 'challenge-4']
  }
};

const mockChallenges = {
  'challenge-1': {
    id: 'challenge-1',
    title: 'React Component Implementation',
    type: 'code',
    description: 'Create a reusable React component that displays a list of users with search functionality.',
    instructions: `
# React Component Challenge

Create a UserList component with the following requirements:
- Display a list of users from props
- Include search functionality
- Show user avatar, name, and email
- Handle loading and empty states

## Requirements:
- Use functional components with hooks
- Implement search filtering
- Add proper TypeScript types
- Include basic styling

## Starter Code:
\`\`\`javascript
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://via.placeholder.com/40' }
];
\`\`\`
    `,
    language: 'javascript',
    timeLimit: 60, // minutes
    files: {
      'UserList.jsx': {
        content: '// Implement your UserList component here\n\nconst UserList = ({ users }) => {\n  return (\n    <div>\n      {/* Your implementation here */}\n    </div>\n  );\n};\n\nexport default UserList;',
        language: 'javascript'
      },
      'App.jsx': {
        content: 'import UserList from \'./UserList\';\n\nconst users = [\n  { id: 1, name: \'John Doe\', email: \'john@example.com\', avatar: \'https://via.placeholder.com/40\' },\n  { id: 2, name: \'Jane Smith\', email: \'jane@example.com\', avatar: \'https://via.placeholder.com/40\' }\n];\n\nfunction App() {\n  return (\n    <div className="App">\n      <UserList users={users} />\n    </div>\n  );\n}\n\nexport default App;',
        language: 'javascript'
      }
    }
  },
  'challenge-2': {
    id: 'challenge-2',
    title: 'Algorithm Problem',
    type: 'open-ended',
    description: 'Solve this algorithmic problem and explain your approach.',
    instructions: `
# Two Sum Problem

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

## Requirements:
1. Provide the solution code
2. Explain your approach and time complexity
3. Discuss alternative solutions if any
    `,
    timeLimit: 30
  },
  'challenge-3': {
    id: 'challenge-3',
    title: 'JavaScript Fundamentals Quiz',
    type: 'multiple-choice',
    description: 'Test your knowledge of JavaScript fundamentals and modern ES6+ features.',
    instructions: 'Answer the following multiple-choice questions about JavaScript. Each question has only one correct answer.',
    timeLimit: 25,
    questions: [
      {
        id: 'Q1',
        question: 'What is the output of the following code?\n\n```javascript\nconsole.log(typeof null);\n```',
        options: [
          { id: 'A', text: '"null"' },
          { id: 'B', text: '"object"' },
          { id: 'C', text: '"undefined"' },
          { id: 'D', text: '"boolean"' }
        ],
        correctAnswer: 'B',
        explanation: 'In JavaScript, `typeof null` returns "object". This is a well-known quirk in the language that exists for historical reasons.'
      },
      {
        id: 'Q2',
        question: 'Which of the following is NOT a valid way to declare a variable in modern JavaScript?',
        options: [
          { id: 'A', text: 'let myVar = 10;' },
          { id: 'B', text: 'const myVar = 10;' },
          { id: 'C', text: 'var myVar = 10;' },
          { id: 'D', text: 'variable myVar = 10;' }
        ],
        correctAnswer: 'D',
        explanation: '"variable" is not a valid JavaScript keyword for declaring variables. Use let, const, or var instead.'
      },
      {
        id: 'Q3',
        question: 'What does the spread operator (...) do when used with arrays?',
        options: [
          { id: 'A', text: 'Creates a shallow copy of the array' },
          { id: 'B', text: 'Expands array elements individually' },
          { id: 'C', text: 'Can be used for array concatenation' },
          { id: 'D', text: 'All of the above' }
        ],
        correctAnswer: 'D',
        explanation: 'The spread operator can create shallow copies, expand elements individually, and is commonly used in concatenation operations.'
      },
      {
        id: 'Q4',
        question: 'Which method is used to add elements to the end of an array?',
        options: [
          { id: 'A', text: 'append()' },
          { id: 'B', text: 'add()' },
          { id: 'C', text: 'push()' },
          { id: 'D', text: 'insert()' }
        ],
        correctAnswer: 'C',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
      },
      {
        id: 'Q5',
        question: 'What is the difference between == and === in JavaScript?',
        options: [
          { id: 'A', text: 'No difference, they work exactly the same' },
          { id: 'B', text: '== compares values with type coercion, === compares values and types strictly' },
          { id: 'C', text: '== is for numbers only, === is for strings only' },
          { id: 'D', text: '=== is deprecated and should not be used' }
        ],
        correctAnswer: 'B',
        explanation: '== performs type coercion and compares values, while === compares both value and type without any coercion (strict equality).'
      }
    ]
  },
  'challenge-4': {
    id: 'challenge-4',
    title: 'System Design Question',
    type: 'open-ended',
    description: 'Design a simple system architecture.',
    instructions: `
# System Design: URL Shortener

Design a URL shortener service like bit.ly with the following requirements:

## Functional Requirements:
- Shorten a given URL
- Redirect short URL to original URL
- Custom short URLs (optional)
- URL expiration

## Non-Functional Requirements:
- Handle 100M URLs per day
- 100:1 read/write ratio
- Service should be available 99.9% of the time

## Questions to Address:
1. High-level system architecture
2. Database design
3. API design
4. Scaling considerations
5. Caching strategy

Please provide:
- System architecture diagram (text description)
- Database schema
- API endpoints
- Scaling approach
    `,
    timeLimit: 45
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Get assessment details
  async getAssessment(assessmentId) {
    await delay(500);
    const assessment = mockAssessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    return assessment;
  },

  // Get challenges for an assessment
  async getChallenges(assessmentId) {
    await delay(300);
    const assessment = mockAssessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    const challenges = assessment.challenges.map(challengeId => {
      const challenge = mockChallenges[challengeId];
      return {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        description: challenge.description,
        timeLimit: challenge.timeLimit
      };
    });
    
    return challenges;
  },

  // Get challenge details
  async getChallengeDetails(challengeId) {
    await delay(400);
    const challenge = mockChallenges[challengeId];
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    return challenge;
  },

  // Submit challenge answer
  async submitChallenge(data) {
    await delay(800);
    console.log('Submitting challenge:', data);
    
    // Simulate API call
    const response = {
      success: true,
      submissionId: `submission-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Challenge submitted successfully'
    };
    
    return response;
  },

  // Submit assessment (when all challenges completed)
  async submitAssessment(data) {
    await delay(1000);
    console.log('Submitting assessment:', data);
    
    const response = {
      success: true,
      assessmentId: data.assessmentId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      submissionId: `assessment-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Assessment submitted successfully'
    };
    
    return response;
  },

  // Authenticate candidate (simple name/email validation)
  async authenticate(name, email, assessmentId) {
    await delay(300);
    
    if (!name || !email || !assessmentId) {
      throw new Error('Name, email, and assessment ID are required');
    }
    
    if (!mockAssessments[assessmentId]) {
      throw new Error('Assessment not found');
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    return {
      success: true,
      candidateId: `candidate-${Date.now()}`,
      name,
      email,
      assessmentId,
      token: `token-${Date.now()}` // Mock token
    };
  }
};

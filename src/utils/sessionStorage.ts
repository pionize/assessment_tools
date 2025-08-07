// Session storage utilities for candidate session management

// Import types from context to ensure consistency
import type { Candidate, Assessment, Challenge } from '../contexts/context';

type SubmissionValue = string | string[] | { answer: string } | null;

interface Submissions {
  [challengeId: string]: SubmissionValue;
}

interface AppState {
  candidate: Candidate | null;
  assessment: Assessment | null;
  challenges?: Challenge[];
  submissions: Submissions;
  completedChallenges: Set<string>;
  currentChallenge: Challenge | null;
}

const SESSION_KEYS = {
  CANDIDATE: 'candidate_session',
  ASSESSMENT: 'assessment_data',
  SUBMISSIONS: 'challenge_submissions',
  COMPLETED: 'completed_challenges',
  CURRENT_CHALLENGE: 'current_challenge'
};

export const sessionStorage = {
  // Save candidate session
  saveCandidate(candidate: Candidate): void {
    try {
      localStorage.setItem(SESSION_KEYS.CANDIDATE, JSON.stringify(candidate));
    } catch (error) {
      console.error('Error saving candidate to localStorage:', error);
    }
  },

  // Get candidate session
  getCandidate(): Candidate | null {
    try {
      const candidate = localStorage.getItem(SESSION_KEYS.CANDIDATE);
      return candidate ? JSON.parse(candidate) : null;
    } catch (error) {
      console.error('Error getting candidate from localStorage:', error);
      return null;
    }
  },

  // Save assessment data
  saveAssessment(assessment: Assessment): void {
    try {
      localStorage.setItem(SESSION_KEYS.ASSESSMENT, JSON.stringify(assessment));
    } catch (error) {
      console.error('Error saving assessment to localStorage:', error);
    }
  },

  // Get assessment data
  getAssessment(): Assessment | null {
    try {
      const assessment = localStorage.getItem(SESSION_KEYS.ASSESSMENT);
      return assessment ? JSON.parse(assessment) : null;
    } catch (error) {
      console.error('Error getting assessment from localStorage:', error);
      return null;
    }
  },

  // Save challenge submissions
  saveSubmissions(submissions: Submissions): void {
    try {
      localStorage.setItem(SESSION_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (error) {
      console.error('Error saving submissions to localStorage:', error);
    }
  },

  // Get challenge submissions
  getSubmissions(): Submissions {
    try {
      const submissions = localStorage.getItem(SESSION_KEYS.SUBMISSIONS);
      return submissions ? JSON.parse(submissions) : {};
    } catch (error) {
      console.error('Error getting submissions from localStorage:', error);
      return {};
    }
  },

  // Save completed challenges
  saveCompletedChallenges(completedChallenges: Set<string>): void {
    try {
      const completedArray = Array.from(completedChallenges);
      localStorage.setItem(SESSION_KEYS.COMPLETED, JSON.stringify(completedArray));
    } catch (error) {
      console.error('Error saving completed challenges to localStorage:', error);
    }
  },

  // Get completed challenges
  getCompletedChallenges(): Set<string> {
    try {
      const completed = localStorage.getItem(SESSION_KEYS.COMPLETED);
      return completed ? new Set(JSON.parse(completed)) : new Set();
    } catch (error) {
      console.error('Error getting completed challenges from localStorage:', error);
      return new Set();
    }
  },

  // Save current challenge
  saveCurrentChallenge(challenge: Challenge): void {
    try {
      localStorage.setItem(SESSION_KEYS.CURRENT_CHALLENGE, JSON.stringify(challenge));
    } catch (error) {
      console.error('Error saving current challenge to localStorage:', error);
    }
  },

  // Get current challenge
  getCurrentChallenge(): Challenge | null {
    try {
      const challenge = localStorage.getItem(SESSION_KEYS.CURRENT_CHALLENGE);
      return challenge ? JSON.parse(challenge) : null;
    } catch (error) {
      console.error('Error getting current challenge from localStorage:', error);
      return null;
    }
  },

  // Clear all session data
  clearSession(): void {
    try {
      Object.values(SESSION_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('Session cleared successfully');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  },

  // Clear only candidate session (for logout)
  clearCandidateSession(): void {
    try {
      localStorage.removeItem(SESSION_KEYS.CANDIDATE);
      localStorage.removeItem(SESSION_KEYS.SUBMISSIONS);
      localStorage.removeItem(SESSION_KEYS.COMPLETED);
      localStorage.removeItem(SESSION_KEYS.CURRENT_CHALLENGE);
      console.log('Candidate session cleared');
    } catch (error) {
      console.error('Error clearing candidate session:', error);
    }
  },

  // Check if session exists for assessment
  hasSessionForAssessment(assessmentId: string): boolean {
    const candidate = this.getCandidate();
    return !!(candidate && candidate.assessmentId === assessmentId);
  },

  // Save entire app state
  saveAppState(state: Partial<AppState>): void {
    try {
      if (state.candidate) {
        this.saveCandidate(state.candidate);
      }
      if (state.assessment) {
        this.saveAssessment(state.assessment);
      }
      if (state.submissions) {
        this.saveSubmissions(state.submissions);
      }
      if (state.completedChallenges) {
        this.saveCompletedChallenges(state.completedChallenges);
      }
      if (state.currentChallenge) {
        this.saveCurrentChallenge(state.currentChallenge);
      }
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  // Load entire app state
  loadAppState(): AppState {
    try {
      return {
        candidate: this.getCandidate(),
        assessment: this.getAssessment(),
        submissions: this.getSubmissions(),
        completedChallenges: this.getCompletedChallenges(),
        currentChallenge: this.getCurrentChallenge()
      };
    } catch (error) {
      console.error('Error loading app state:', error);
      return {
        candidate: null,
        assessment: null,
        submissions: {},
        completedChallenges: new Set(),
        currentChallenge: null
      };
    }
  }
};
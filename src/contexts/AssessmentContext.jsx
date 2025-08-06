import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sessionStorage } from '../utils/sessionStorage';

const AssessmentContext = createContext();

const initialState = {
  candidate: null,
  assessment: null,
  challenges: [],
  currentChallenge: null,
  loading: true, // Start with loading true
  error: null,
  submissions: {},
  completedChallenges: new Set(),
  timeRemaining: null,
  timerActive: false
};

// This function runs only once to initialize the state
const init = (initialState) => {
  const loadedState = sessionStorage.loadAppState();
  if (loadedState && loadedState.candidate) {
    return { ...initialState, ...loadedState, loading: false };
  }
  return { ...initialState, loading: false }; // Ensure loading is false if no session
};

function assessmentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_CANDIDATE':
      return { ...state, candidate: action.payload };
    case 'SET_ASSESSMENT':
      return { ...state, assessment: action.payload };
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'SET_CURRENT_CHALLENGE':
      return { ...state, currentChallenge: action.payload };
    case 'UPDATE_SUBMISSION':
      return {
        ...state,
        submissions: {
          ...state.submissions,
          [action.payload.challengeId]: action.payload.submission
        }
      };
    case 'COMPLETE_CHALLENGE':
      const newCompleted = new Set(state.completedChallenges);
      newCompleted.add(action.payload.challengeId);
      return {
        ...state,
        completedChallenges: newCompleted
      };
    case 'RESET_ASSESSMENT':
      sessionStorage.clearSession(); // Clear storage on reset
      return { ...initialState, loading: false }; // Return a clean state
    default:
      return state;
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState, init);

  // This effect synchronizes state changes back to session storage
  useEffect(() => {
    // We don't save loading/error states
    const stateToSave = { ...state };
    delete stateToSave.loading;
    delete stateToSave.error;
    sessionStorage.saveAppState(stateToSave);
  }, [state]);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

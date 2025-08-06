import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './contexts/AssessmentContext';
import Login from './components/Login';
import ChallengeList from './components/ChallengeList';
import ChallengeDetail from './components/ChallengeDetail';

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Redirect root to a sample assessment */}
            <Route path="/" element={<Navigate to="/assessment/assessment-123" replace />} />
            
            {/* Login page */}
            <Route path="/assessment/:assessmentId" element={<Login />} />
            
            {/* Challenge list */}
            <Route path="/assessment/:assessmentId/challenges" element={<ChallengeList />} />
            
            {/* Challenge detail */}
            <Route path="/assessment/:assessmentId/challenge/:challengeId" element={<ChallengeDetail />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AssessmentProvider>
  );
}

export default App;

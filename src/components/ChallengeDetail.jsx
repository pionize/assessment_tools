import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  Save, 
  AlertCircle,
  CheckCircle,
  FileText,
  Code
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAssessment } from '../contexts/AssessmentContext';
import CodeEditor from './CodeEditor';

function ChallengeDetail() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answer, setAnswer] = useState('');
  const [files, setFiles] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  const { assessmentId, challengeId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true);
        const challengeData = await apiService.getChallengeDetails(challengeId);
        setChallenge(challengeData);
        
        // Load existing submission if available
        const existingSubmission = state.submissions[challengeId];
        if (existingSubmission) {
          if (challengeData.type === 'code') {
            setFiles(existingSubmission.files || challengeData.files || {});
            setSelectedLanguage(existingSubmission.language || challengeData.language || 'javascript');
          } else {
            setAnswer(existingSubmission.answer || '');
          }
        } else {
          // Set initial data for new challenge
          if (challengeData.type === 'code') {
            setFiles(challengeData.files || {});
            setSelectedLanguage(challengeData.language || 'javascript');
          }
        }

        // Start timer if challenge has time limit
        if (challengeData.timeLimit && !state.completedChallenges.has(challengeId)) {
          const timeLimit = challengeData.timeLimit * 60; // Convert to seconds
          setTimeRemaining(timeLimit);
          setTimerActive(true);
        }

        dispatch({ type: 'SET_CURRENT_CHALLENGE', payload: challengeData });
      } catch (error) {
        console.error('Error loading challenge:', error);
        navigate(`/assessment/${assessmentId}/challenges`);
      } finally {
        setLoading(false);
      }
    };

    if (challengeId) {
      loadChallenge();
    }
  }, [challengeId, assessmentId, navigate, dispatch, state.submissions, state.completedChallenges]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeRemaining]);

  const handleAutoSubmit = async () => {
    await handleSubmit(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveDraft = () => {
    const submission = challenge.type === 'code' 
      ? { files, language: selectedLanguage, type: 'code' }
      : { answer, type: 'open-ended' };

    dispatch({
      type: 'UPDATE_SUBMISSION',
      payload: { challengeId, submission }
    });

    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50';
    toast.textContent = 'Draft saved!';
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const confirmed = confirm('Are you sure you want to submit this challenge? You cannot modify your answer after submission.');
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        challengeId,
        assessmentId,
        candidateName: state.candidate.name,
        candidateEmail: state.candidate.email,
        timestamp: new Date().toISOString(),
        timeSpent: challenge.timeLimit ? (challenge.timeLimit * 60) - timeRemaining : null
      };

      if (challenge.type === 'code') {
        submissionData.files = files;
        submissionData.language = selectedLanguage;
        submissionData.type = 'code';
      } else {
        submissionData.answer = answer;
        submissionData.type = 'open-ended';
      }

      const response = await apiService.submitChallenge(submissionData);
      
      // Update state
      dispatch({
        type: 'UPDATE_SUBMISSION',
        payload: { challengeId, submission: submissionData }
      });

      dispatch({
        type: 'COMPLETE_CHALLENGE',
        payload: { challengeId }
      });

      setTimerActive(false);

      alert(isAutoSubmit ? 'Time\'s up! Your challenge has been auto-submitted.' : 'Challenge submitted successfully!');
      navigate(`/assessment/${assessmentId}/challenges`);

    } catch (error) {
      console.error('Error submitting challenge:', error);
      alert('Error submitting challenge. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = state.completedChallenges.has(challengeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge not found</h2>
          <button 
            onClick={() => navigate(`/assessment/${assessmentId}/challenges`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate(`/assessment/${assessmentId}/challenges`)}
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors bg-gray-100 hover:bg-indigo-50 px-4 py-2 rounded-xl font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Challenges</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                  {challenge.type === 'code' ? <Code className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{challenge.title}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      challenge.type === 'code' 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                    }`}>
                      <span className="capitalize">{challenge.type.replace('-', ' ')}</span>
                    </div>
                    
                    {isCompleted && (
                      <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {timeRemaining !== null && timerActive && (
                <div className={`flex items-center px-4 py-3 rounded-xl font-mono font-bold text-lg shadow-lg ${
                  timeRemaining < 300 
                    ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-2 border-red-200 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200'
                }`}>
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              )}

              {!isCompleted && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Draft
                  </button>

                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:-translate-y-0.5"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Submit Challenge
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-220px)]">
          {/* Instructions Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 mr-3" />
                Instructions
              </h2>
            </div>
            <div className="p-6 overflow-auto h-full">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-base text-gray-700 font-sans leading-relaxed">
                  {challenge.instructions}
                </pre>
              </div>
            </div>
          </div>

          {/* Answer Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {challenge.type === 'code' ? <Code className="w-6 h-6 mr-3" /> : <FileText className="w-6 h-6 mr-3" />}
                Your Solution
              </h2>
            </div>
            
            <div className="flex-1 p-6">
              {challenge.type === 'code' ? (
                <div className="h-full">
                  <CodeEditor
                    files={files}
                    onFilesChange={setFiles}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-full resize-none border-2 border-gray-200 rounded-xl p-6 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base"
                  disabled={isCompleted}
                />
              )}
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="mt-8 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800 mb-1">
                  ✅ Challenge Completed!
                </h3>
                <span className="text-green-700">
                  You can review your submission above. Great work!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetail;

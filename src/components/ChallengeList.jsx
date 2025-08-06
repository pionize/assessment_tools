import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Code, FileText, CheckCircle, Play, LogOut, User } from 'lucide-react';
import { apiService } from '../services/api';
import { useAssessment } from '../contexts/AssessmentContext';
import { sessionStorage } from '../utils/sessionStorage';

function ChallengeList() {
  const [localLoading, setLocalLoading] = useState(true);
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLocalLoading(true);
        const challenges = await apiService.getChallenges(assessmentId);
        dispatch({ type: 'SET_CHALLENGES', payload: challenges });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        setLocalLoading(false);
      }
    };

    if (assessmentId) {
      loadChallenges();
    }
  }, [assessmentId, dispatch]);

  const handleTakeChallenge = (challengeId) => {
    navigate(`/assessment/${assessmentId}/challenge/${challengeId}`);
  };

  const handleLogout = () => {
    dispatch({ type: 'RESET_ASSESSMENT' });
    navigate(`/assessment/${assessmentId}`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'open-ended':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'code':
        return 'bg-green-100 text-green-800';
      case 'open-ended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isCompleted = (challengeId) => {
    return state.completedChallenges.has(challengeId);
  };

  const completedCount = state.challenges.filter(challenge => 
    isCompleted(challenge.id)
  ).length;

  if (!state.candidate) {
    navigate(`/assessment/${assessmentId}`);
    return null;
  }

  if (localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {state.assessment?.title || 'Assessment'}
                </h1>
                <p className="text-gray-600 font-medium mt-1">
                  Welcome, {state.candidate.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                <span className="text-sm text-gray-700 font-medium">{state.candidate.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Progress Overview
              </h2>
              <p className="text-gray-600">Track your completion status across all challenges</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {completedCount}/{state.challenges.length}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {state.challenges.length > 0 ? Math.round((completedCount / state.challenges.length) * 100) : 0}% Complete
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${state.challenges.length > 0 ? (completedCount / state.challenges.length) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center mt-4">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                {completedCount > 0 ? `${completedCount} challenge${completedCount > 1 ? 's' : ''} completed` : 'No challenges completed yet'}
              </span>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Challenges
            </h2>
            <div className="text-sm text-gray-500">
              {state.challenges.length} challenge{state.challenges.length !== 1 ? 's' : ''} available
            </div>
          </div>
          
          {state.challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                isCompleted(challenge.id) 
                  ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50' 
                  : 'border-white/20 hover:border-indigo-200'
              }`}
            >
              {/* Completion indicator */}
              {isCompleted(challenge.id) && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-green-500">
                  <CheckCircle className="w-4 h-4 text-white absolute -top-6 -right-1" />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Challenge number and type */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                        challenge.type === 'code' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                          : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                      }`}>
                        {getTypeIcon(challenge.type)}
                        <span className="ml-2 capitalize">{challenge.type.replace('-', ' ')}</span>
                      </div>
                      
                      {challenge.timeLimit && (
                        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full text-gray-600 text-sm font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{challenge.timeLimit} min</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {challenge.description}
                    </p>

                    {/* Status indicator */}
                    {isCompleted(challenge.id) && (
                      <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-xl w-fit">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-8 flex-shrink-0">
                    <button
                      onClick={() => handleTakeChallenge(challenge.id)}
                      className={`group flex items-center px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        isCompleted(challenge.id)
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      {isCompleted(challenge.id) ? 'Review Solution' : 'Start Challenge'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {state.challenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges available</h3>
              <p className="text-gray-600">
                Please check back later or contact the administrator.
              </p>
            </div>
          )}
        </div>

        {/* Submit Assessment Button */}
        {completedCount === state.challenges.length && state.challenges.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 rounded-full p-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    🎉 Assessment Complete!
                  </h3>
                  <p className="text-green-700 text-lg">
                    Congratulations! You have successfully completed all challenges.
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Click the button to submit your final assessment.
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  const confirmed = confirm('Are you sure you want to submit your final assessment? This action cannot be undone.');
                  if (!confirmed) return;
                  
                  try {
                    await apiService.submitAssessment({
                      assessmentId,
                      candidateName: state.candidate.name,
                      candidateEmail: state.candidate.email,
                      submissions: state.submissions
                    });
                    
                    // Clear session after successful submission
                    sessionStorage.clearSession();
                    dispatch({ type: 'RESET_ASSESSMENT' });
                    
                    alert('🎉 Assessment submitted successfully! Thank you for your participation.');
                    
                    // Redirect to assessment start page
                    setTimeout(() => {
                      navigate(`/assessment/${assessmentId}`);
                    }, 1000);
                  } catch (error) {
                    alert('Error submitting assessment: ' + error.message);
                  }
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-lg"
              >
                Submit Assessment 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeList;

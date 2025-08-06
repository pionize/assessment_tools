import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Code, FileText, CheckCircle, Play, LogOut, User, HelpCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useAssessment } from '../contexts/AssessmentContext';
import { sessionStorage } from '../utils/sessionStorage';
import { Button, Card, Badge } from './ui';

function ChallengeList() {
  const [localLoading, setLocalLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLocalLoading(true);
        const challenges = await apiService.getChallenges(assessmentId);
        dispatch({ type: 'SET_CHALLENGES', payload: challenges });
        
        // Start assessment timer if not already started and assessment has time limit
        console.log('Assessment timer check:', {
          hasTimeLimit: !!state.assessment?.timeLimit,
          startTime: state.assessmentStartTime,
          timerActive: state.assessmentTimerActive
        });
        
        if (state.assessment?.timeLimit) {
          if (!state.assessmentStartTime) {
            console.log('Starting new assessment timer with time limit:', state.assessment.timeLimit);
            dispatch({ 
              type: 'START_ASSESSMENT_TIMER', 
              payload: { timeLimit: state.assessment.timeLimit } 
            });
          } else if (!state.assessmentTimerActive) {
            // Resume timer if we have a start time but timer isn't active
            console.log('Resuming assessment timer');
            dispatch({ 
              type: 'START_ASSESSMENT_TIMER', 
              payload: { timeLimit: state.assessment.timeLimit } 
            });
          }
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        setLocalLoading(false);
      }
    };

    if (assessmentId) {
      loadChallenges();
    }
  }, [assessmentId, dispatch, state.assessment?.timeLimit, state.assessmentTimerActive, state.assessmentStartTime]);

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
      case 'multiple-choice':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };


  const isCompleted = (challengeId) => {
    return state.completedChallenges.has(challengeId);
  };

  const completedCount = state.challenges.filter(challenge => 
    isCompleted(challenge.id)
  ).length;

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAutoSubmitAssessment = async () => {
    const confirmed = confirm('⏰ Time\'s up! Your assessment will be automatically submitted now.');
    if (confirmed) {
      try {
        await apiService.submitAssessment({
          assessmentId,
          candidateName: state.candidate.name,
          candidateEmail: state.candidate.email,
          submissions: state.submissions
        });
        
        sessionStorage.clearSession();
        dispatch({ type: 'RESET_ASSESSMENT' });
        
        alert('⏰ Assessment automatically submitted due to time limit. Thank you for your participation.');
        
        setTimeout(() => {
          navigate(`/assessment/${assessmentId}`);
        }, 1000);
      } catch (error) {
        alert('Error auto-submitting assessment: ' + error.message);
      }
    }
  };

  const formatAssessmentTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate real-time remaining time
  const calculateRemainingTime = () => {
    if (!state.candidate?.startedAt || !state.candidate?.timeLimit) {
      return null;
    }
    
    const startTime = new Date(state.candidate.startedAt);
    const timeLimitMs = state.candidate.timeLimit * 60 * 1000; // Convert minutes to milliseconds
    const elapsed = currentTime.getTime() - startTime.getTime();
    const remaining = Math.max(0, timeLimitMs - elapsed);
    
    return Math.floor(remaining / 1000); // Return seconds
  };

  const calculateElapsedTime = () => {
    if (!state.candidate?.startedAt) {
      return 0;
    }
    
    const startTime = new Date(state.candidate.startedAt);
    const elapsed = currentTime.getTime() - startTime.getTime();
    return Math.floor(elapsed / 1000); // Return seconds
  };

  const remainingTimeSeconds = calculateRemainingTime();
  const elapsedTimeSeconds = calculateElapsedTime();

  // Auto-submit when time is up
  useEffect(() => {
    if (remainingTimeSeconds !== null && remainingTimeSeconds <= 0) {
      handleAutoSubmitAssessment();
    }
  }, [remainingTimeSeconds]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1578b9] to-[#40b3ff] bg-clip-text text-transparent">
                  {state.assessment?.title || 'Assessment'}
                </h1>
                <p className="text-gray-600 font-medium mt-1">
                  Welcome, {state.candidate.name}
                </p>
                {/* Assessment Time Remaining Counter */}
                {(state.candidate?.timeLimit && remainingTimeSeconds !== null) && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-mono">
                      Time Remaining: {formatAssessmentTime(remainingTimeSeconds)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-center bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-2 rounded-full border border-blue-100">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-gray-700 font-medium">{state.candidate.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Progress Overview */}
        <Card className="shadow-xl mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1578b9] to-[#40b3ff] bg-clip-text text-transparent mb-2">
                Progress Overview
              </h2>
              <p className="text-gray-600">Track your completion status across all challenges</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {completedCount}/{state.challenges.length}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {state.challenges.length > 0 ? Math.round((completedCount / state.challenges.length) * 100) : 0}% Complete
                </div>
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
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {completedCount > 0 ? `${completedCount} challenge${completedCount > 1 ? 's' : ''} completed` : 'No challenges completed yet'}
                </span>
              </div>
              {/* Submit Button */}
              <Button
                onClick={async () => {
                  const confirmed = confirm('Are you sure you want to submit your assessment? This action cannot be undone.');
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
                icon={<CheckCircle className="w-4 h-4" />}
                size="md"
              >
                Submit
              </Button>
            </div>
          </div>
        </Card>


        {/* Challenges List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1578b9] to-[#40b3ff] bg-clip-text text-transparent">
              Challenges
            </h2>
            <div className="text-sm text-gray-500">
              {state.challenges.length} challenge{state.challenges.length !== 1 ? 's' : ''} available
            </div>
          </div>
          
          {state.challenges.map((challenge, index) => (
            <Card
              key={challenge.id}
              className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                isCompleted(challenge.id) 
                  ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50' 
                  : 'hover:border-indigo-200'
              }`}
              padding="none"
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
                      <div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <Badge
                        variant={challenge.type}
                        icon={getTypeIcon(challenge.type)}
                        size="md"
                      >
                        {challenge.type.replace('-', ' ')}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {challenge.description}
                    </p>

                    {/* Status indicator */}
                    {isCompleted(challenge.id) && (
                      <Badge
                        variant="success"
                        icon={<CheckCircle className="w-5 h-5" />}
                        size="lg"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="ml-8 flex-shrink-0">
                    <Button
                      onClick={() => handleTakeChallenge(challenge.id)}
                      variant={isCompleted(challenge.id) ? 'secondary' : 'primary'}
                      size="lg"
                      icon={<Play className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                      className="group"
                    >
                      {isCompleted(challenge.id) ? 'Review Solution' : 'Start Challenge'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
      </div>
    </div>
  );
}

export default ChallengeList;

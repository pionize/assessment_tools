import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import { useAssessment } from '../contexts/AssessmentContext';
import { sessionStorage } from '../utils/sessionStorage';
import { Button, Card } from './ui';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();

  // Check if there's an existing session and redirect
  useEffect(() => {
    if (!state.loading && state.candidate && state.candidate.assessmentId === assessmentId) {
      navigate(`/assessment/${assessmentId}/challenges`, { replace: true });
    }
  }, [state.loading, state.candidate, assessmentId, navigate]);

  // Load assessment data if needed
  useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId || state.loading || state.assessment || state.candidate) {
        return; // Skip if already loading, have assessment, or have candidate
      }
      
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const assessment = await apiService.getAssessment(assessmentId);
        dispatch({ type: 'SET_ASSESSMENT', payload: assessment });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadAssessment();
  }, [assessmentId, state.loading, state.assessment, state.candidate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      const response = await apiService.authenticate(name, email, assessmentId);
      
      dispatch({ 
        type: 'SET_CANDIDATE', 
        payload: { 
          id: response.candidateId,
          name, 
          email, 
          assessmentId,
          token: response.token,
          timeLimit: response.timeLimit,
          startedAt: response.startedAt
        } 
      });

      navigate(`/assessment/${assessmentId}/challenges`);
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-gray-700">{state.error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 w-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Background decoration - subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="relative shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1578b9] to-[#40b3ff] bg-clip-text text-transparent mb-3">
            Developer Assessment
          </h1>
          {state.assessment && (
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {state.assessment.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {state.assessment.description}
              </p>
              {state.assessment.timeLimit && (
                <div className="flex items-center justify-center mt-3 text-sm text-blue-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">
                    Time limit: {state.assessment.timeLimit} minutes
                  </span>
                </div>
              )}
            </div>
          )}
          <p className="text-gray-600">
            Enter your information to begin the challenge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          </div>

          {localError && (
            <div className="flex items-center text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{localError}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !name.trim() || !email.trim()}
            className="w-full"
            size="lg"
            icon={isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          >
            {isSubmitting ? 'Starting...' : 'Start Assessment'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Assessment ID: {assessmentId}
        </div>
      </Card>
    </div>
  );
}

export default Login;

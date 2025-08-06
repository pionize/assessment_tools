import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, HelpCircle, ArrowLeft, Send } from 'lucide-react';
import { Button, Card, Badge } from './ui';
import { useAssessment } from '../contexts/AssessmentContext';

function MultipleChoiceChallenge({ challenge, onSubmit, onBack, savedAnswers }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const { state, dispatch } = useAssessment();

  // Load saved answers if any
  useEffect(() => {
    if (savedAnswers) {
      setAnswers(savedAnswers.answers || {});
      if (savedAnswers.submitted) {
        setShowResults(true);
      }
    }
  }, [savedAnswers]);

  // Update elapsed time if assessment is active
  useEffect(() => {
    let interval;
    if (state.assessmentTimerActive && state.assessmentStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const startTime = new Date(state.assessmentStartTime);
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        
        dispatch({ 
          type: 'UPDATE_ASSESSMENT_ELAPSED_TIME', 
          payload: elapsedSeconds 
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.assessmentTimerActive, state.assessmentStartTime, dispatch]);

  const formatElapsedTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isComplete = () => {
    return getAnsweredCount() === challenge.questions.length;
  };


  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return;
    
    if (!autoSubmit && !isComplete()) {
      const unanswered = challenge.questions.length - getAnsweredCount();
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        challengeId: challenge.id,
        type: 'multiple-choice',
        answers: answers,
        timestamp: new Date().toISOString(),
        autoSubmit
      };

      await onSubmit(submissionData);
      setShowResults(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultsData = () => {
    if (!showResults) return null;

    let correctCount = 0;
    const results = challenge.questions.map(question => {
      const selectedAnswer = answers[question.id];
      const isCorrect = selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        ...question,
        selectedAnswer,
        isCorrect
      };
    });

    return {
      results,
      correctCount,
      totalQuestions: challenge.questions.length,
      percentage: Math.round((correctCount / challenge.questions.length) * 100)
    };
  };

  const resultsData = getResultsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                icon={<ArrowLeft className="w-5 h-5" />}
              >
                Back to Challenges
              </Button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-800">Multiple Choice</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!showResults && (
                <div className="text-sm text-gray-600">
                  {getAnsweredCount()}/{challenge.questions.length} answered
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Challenge Info */}
        <Card className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{challenge.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{challenge.description}</p>
          
          {/* Assessment Elapsed Time Counter */}
          {state.assessmentStartTime && (
            <div className="flex items-center mb-4 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono">
                Assessment elapsed: {formatElapsedTime(state.assessmentElapsedTime)}
              </span>
            </div>
          )}
          
          {challenge.instructions && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-purple-800 mb-2">Instructions</h3>
              <p className="text-purple-700">{challenge.instructions}</p>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {showResults && resultsData && (
          <Card className="mb-8">
            <div className={`flex items-center justify-between p-6 rounded-xl mb-6 ${
              resultsData.percentage >= 80 
                ? 'bg-green-100 border border-green-200' 
                : resultsData.percentage >= 60
                  ? 'bg-yellow-100 border border-yellow-200'
                  : 'bg-red-100 border border-red-200'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  resultsData.percentage >= 80 
                    ? 'bg-green-500' 
                    : resultsData.percentage >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}>
                  {resultsData.percentage >= 80 ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <XCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Quiz Complete!
                  </h3>
                  <p className="text-gray-600">
                    You scored {resultsData.correctCount} out of {resultsData.totalQuestions} questions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-800">
                  {resultsData.percentage}%
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
            </div>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {challenge.questions.map((question, index) => (
            <Card key={question.id}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 whitespace-pre-line">
                    {question.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.id;
                      const isCorrect = option.id === question.correctAnswer;
                      const isWrong = showResults && isSelected && !isCorrect;
                      
                      return (
                        <label
                          key={option.id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            showResults
                              ? isCorrect
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : isWrong
                                  ? 'bg-red-100 border-red-300 text-red-800'
                                  : isSelected
                                    ? 'bg-gray-100 border-gray-300 text-gray-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                              : isSelected
                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={isSelected}
                            onChange={() => !showResults && handleAnswerChange(question.id, option.id)}
                            className="sr-only"
                            disabled={showResults}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            showResults
                              ? isCorrect
                                ? 'border-green-500 bg-green-500'
                                : isWrong
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-400'
                              : isSelected
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-400'
                          }`}>
                            {((showResults && isCorrect) || (!showResults && isSelected)) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                            {showResults && isWrong && (
                              <XCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="flex-1 font-medium">{option.text}</span>
                          {showResults && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Show explanation in results */}
                  {showResults && question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                      <p className="text-blue-700 text-sm">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        {!showResults && (
          <Card className="mt-8" padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Progress: {getAnsweredCount()}/{challenge.questions.length} questions completed
                </div>
                {!isComplete() && (
                  <div className="text-sm text-orange-600">
                    {challenge.questions.length - getAnsweredCount()} questions remaining
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !isComplete()}
                variant="primary"
                size="lg"
                icon={isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answers'}
              </Button>
            </div>
          </Card>
        )}

        {/* Back Button in Results */}
        {showResults && (
          <div className="mt-8 text-center">
            <Button
              onClick={onBack}
              size="lg"
            >
              Back to Challenges
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultipleChoiceChallenge;

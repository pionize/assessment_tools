import {
	ArrowLeft,
	CheckCircle,
	HelpCircle,
	Send,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Challenge } from "../services/api";
import { Button, Card } from "./ui";

interface MultipleChoiceSubmission {
	challengeId: string;
	type: "multiple-choice";
	answers: Record<string, string>;
	timestamp: string;
	autoSubmit: boolean;
}

interface SavedAnswers {
	answers?: Record<string, string>;
	submitted?: boolean;
}

interface MultipleChoiceChallengeProps {
	challenge: Challenge;
	onSubmit: (submissionData: MultipleChoiceSubmission) => Promise<void>;
	onBack: () => void;
	savedAnswers?: SavedAnswers;
}

function MultipleChoiceChallenge({
	challenge,
	onSubmit,
	onBack,
	savedAnswers,
}: MultipleChoiceChallengeProps) {
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showResults, setShowResults] = useState(false);

	// Assessment context not used in this component

	// Load saved answers if any
	useEffect(() => {
		if (savedAnswers) {
			setAnswers(savedAnswers.answers || {});
			if (savedAnswers.submitted) {
				setShowResults(true);
			}
		}
	}, [savedAnswers]);

	// Note: Assessment timer functionality removed as it's not part of the current state structure

	// formatElapsedTime function removed as it's not used

	const handleAnswerChange = (questionId: string, optionId: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: optionId,
		}));
	};

	const getAnsweredCount = () => {
		return Object.keys(answers).length;
	};

	const isComplete = () => {
		return getAnsweredCount() === (challenge.questions?.length || 0);
	};

	const handleSubmit = async (autoSubmit = false) => {
		if (isSubmitting) return;

		if (!autoSubmit && !isComplete()) {
			const unanswered = (challenge.questions?.length || 0) - getAnsweredCount();
			const confirm = window.confirm(
				`You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Are you sure you want to submit?`,
			);
			if (!confirm) return;
		}

		setIsSubmitting(true);

		try {
			const submissionData: MultipleChoiceSubmission = {
				challengeId: challenge.id,
				type: "multiple-choice" as const,
				answers: answers,
				timestamp: new Date().toISOString(),
				autoSubmit,
			};

			await onSubmit(submissionData);
			setShowResults(true);
		} catch (error) {
			console.error("Submission error:", error);
			alert("Error submitting answers. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getResultsData = () => {
		if (!showResults) return null;

		let correctCount = 0;
		const results = (challenge.questions || []).map((question) => {
			const selectedAnswer = answers[question.id];
			const isCorrect = selectedAnswer === question.correctAnswer;
			if (isCorrect) correctCount++;

			return {
				...question,
				selectedAnswer,
				isCorrect,
			};
		});

		return {
			results,
			correctCount,
			totalQuestions: challenge.questions?.length || 0,
			percentage: Math.round((correctCount / (challenge.questions?.length || 1)) * 100),
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
								<HelpCircle className="w-5 h-5 text-blue-600" />
								<span className="font-semibold text-gray-800">
									Multiple Choice
								</span>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							{!showResults && (
								<div className="text-sm text-gray-600">
									{getAnsweredCount()}/{challenge.questions?.length || 0} answered
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto px-6 py-8">
				{/* Challenge Info */}
				<Card className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-4">
						{challenge.title}
					</h1>
					<p className="text-gray-600 text-lg mb-6">{challenge.description}</p>

					{/* Assessment time display removed as not part of current state */}

					{challenge.instructions && (
						<div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6">
							<h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
							<p className="text-blue-700">{challenge.instructions}</p>
						</div>
					)}
				</Card>

				{/* Results Section */}
				{showResults && resultsData && (
					<Card className="mb-8">
						<div
							className={`flex items-center justify-between p-6 rounded-xl mb-6 ${
								resultsData.percentage >= 80
									? "bg-green-100 border border-green-200"
									: resultsData.percentage >= 60
										? "bg-yellow-100 border border-yellow-200"
										: "bg-red-100 border border-red-200"
							}`}
						>
							<div className="flex items-center space-x-4">
								<div
									className={`p-3 rounded-full ${
										resultsData.percentage >= 80
											? "bg-green-500"
											: resultsData.percentage >= 60
												? "bg-yellow-500"
												: "bg-red-500"
									}`}
								>
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
										You scored {resultsData.correctCount} out of{" "}
										{resultsData.totalQuestions} questions
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
					{(challenge.questions || []).map((question, index: number) => (
						<Card key={question.id}>
							<div className="flex items-start space-x-4 mb-6">
								<div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
																? "bg-green-100 border-green-300 text-green-800"
																: isWrong
																	? "bg-red-100 border-red-300 text-red-800"
																	: isSelected
																		? "bg-gray-100 border-gray-300 text-gray-700"
																		: "bg-gray-50 border-gray-200 text-gray-600"
															: isSelected
																? "bg-blue-100 border-blue-300 text-blue-800"
																: "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
													}`}
												>
													<input
														type="radio"
														name={`question-${question.id}`}
														value={option.id}
														checked={isSelected}
														onChange={() =>
															!showResults &&
															handleAnswerChange(question.id, option.id)
														}
														className="sr-only"
														disabled={showResults}
													/>
													<div
														className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
															showResults
																? isCorrect
																	? "border-green-500 bg-green-500"
																	: isWrong
																		? "border-red-500 bg-red-500"
																		: "border-gray-400"
																: isSelected
																	? "border-blue-500 bg-blue-500"
																	: "border-gray-400"
														}`}
													>
														{((showResults && isCorrect) ||
															(!showResults && isSelected)) && (
															<div className="w-2 h-2 bg-white rounded-full"></div>
														)}
														{showResults && isWrong && (
															<XCircle className="w-3 h-3 text-white" />
														)}
													</div>
													<span className="flex-1 font-medium">
														{option.text}
													</span>
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
											<h4 className="font-semibold text-blue-800 mb-2">
												Explanation:
											</h4>
											<p className="text-blue-700 text-sm">
												{question.explanation}
											</p>
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
									Progress: {getAnsweredCount()}/{challenge.questions?.length || 0}{" "}
									questions completed
								</div>
								{!isComplete() && (
									<div className="text-sm text-orange-600">
										{(challenge.questions?.length || 0) - getAnsweredCount()} questions
										remaining
									</div>
								)}
							</div>

							<Button
								onClick={() => handleSubmit()}
								disabled={isSubmitting || !isComplete()}
								variant="primary"
								size="lg"
								icon={
									isSubmitting ? (
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									) : (
										<Send className="w-5 h-5" />
									)
								}
							>
								{isSubmitting ? "Submitting..." : "Submit Answers"}
							</Button>
						</div>
					</Card>
				)}

				{/* Back Button in Results */}
				{showResults && (
					<div className="mt-8 text-center">
						<Button onClick={onBack} size="lg">
							Back to Challenges
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default MultipleChoiceChallenge;

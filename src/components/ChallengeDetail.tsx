import { AlertCircle, ArrowLeft, CheckCircle, Clock, Code, FileText, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssessment } from "../contexts/AssessmentContext";
import type { AssessmentSession, Challenge } from "../contexts/context";
import type { SubmissionData } from "../contexts/models/SubmissionData";
import { apiService } from "../services/api";
import CodeEditor from "./CodeEditor";
import MultipleChoiceChallenge from "./MultipleChoiceChallenge";
import { Badge, Button, Card } from "./ui";

function ChallengeDetail() {
	const [challenge, setChallenge] = useState<Challenge | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [answer, setAnswer] = useState("");
	const [files, setFiles] = useState({});
	const [selectedLanguage, setSelectedLanguage] = useState("javascript");
	const [currentTime, setCurrentTime] = useState(new Date());

	const { assessmentId, challengeId } = useParams();
	const navigate = useNavigate();
	const { state, dispatch } = useAssessment();

	// Helper function to setup existing submission data
	const setupExistingSubmission = (
		challengeData: Challenge,
		existingSubmission: Partial<SubmissionData>
	) => {
		if (challengeData.type === "code") {
			setFiles(existingSubmission.files || challengeData.files || {});
			setSelectedLanguage(existingSubmission.language || challengeData.language || "javascript");
		} else {
			setAnswer(existingSubmission.answer || "");
		}
	};

	// Helper function to setup new challenge data
	const setupNewChallenge = (challengeData: Challenge) => {
		if (challengeData.type === "code") {
			setFiles(challengeData.files || {});
			setSelectedLanguage(challengeData.language || "javascript");
		}
	};

	useEffect(() => {
		const loadChallenge = async () => {
			if (!challengeId) return;

			try {
				setLoading(true);
				const challengeData = await apiService.getChallengeDetails(challengeId);
				setChallenge(challengeData);

				const existingSubmission = state.submissions[challengeId];
				if (existingSubmission) {
					setupExistingSubmission(challengeData, existingSubmission);
				} else {
					setupNewChallenge(challengeData);
				}

				dispatch({ type: "SET_CURRENT_CHALLENGE", payload: challengeData });
			} catch (error) {
				console.error("Error loading challenge:", error);
				navigate(`/assessment/${assessmentId}/challenges`);
			} finally {
				setLoading(false);
			}
		};

		if (challengeId) {
			loadChallenge();
		}
	}, [challengeId, assessmentId, navigate, dispatch, state.submissions]);

	// Update current time every second for real-time timer
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Load session data from backend and calculate real-time remaining time
	const [sessionData, setSessionData] = useState<AssessmentSession | null>(null);

	useEffect(() => {
		const loadSession = async () => {
			if (!state.candidate?.email || !assessmentId) return;

			try {
				const session = await apiService.getAssessmentSession(assessmentId, state.candidate.email);
				setSessionData(session);
			} catch (error) {
				console.error("Error loading session in ChallengeDetail:", error);
			}
		};

		if (assessmentId && state.candidate?.email) {
			loadSession();
		}
	}, [assessmentId, state.candidate?.email]);

	const calculateRemainingTime = () => {
		if (!sessionData?.startedAt || !sessionData?.timeLimit) {
			return null;
		}

		const startTime = new Date(sessionData.startedAt);
		const timeLimitMs = sessionData.timeLimit * 60 * 1000; // Convert minutes to milliseconds
		const elapsed = currentTime.getTime() - startTime.getTime();

		// Fix for timezone issue: if elapsed is negative (start time in future),
		// treat as if assessment just started
		const actualElapsed = elapsed < 0 ? 0 : elapsed;
		const remaining = Math.max(0, timeLimitMs - actualElapsed);

		return Math.floor(remaining / 1000); // Return seconds
	};

	const formatAssessmentTime = (seconds: number | null | undefined) => {
		if (seconds === null || seconds === undefined) return "--:--:--";
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const remainingTimeSeconds = calculateRemainingTime();

	const handleSubmit = async (isAutoSubmit = false) => {
		if (!isAutoSubmit) {
			const confirmed = confirm(
				"Are you sure you want to submit this challenge? You cannot modify your answer after submission."
			);
			if (!confirmed) return;
		}

		if (!challengeId || !assessmentId || !state.candidate || !challenge) return;

		setSubmitting(true);

		try {
			// Create submission object that matches API contract
			if (challenge.type === "code") {
				// Convert files object to match API contract format (file path -> content string)
				const submissionFiles: Record<string, string> = {};
				Object.entries(files).forEach(([filePath, fileData]) => {
					submissionFiles[filePath] =
						typeof fileData === "object" && fileData && "content" in fileData
							? (fileData as { content: string }).content
							: "";
				});

				const codeSubmission = {
					challengeId,
					type: "code" as const,
					assessmentId,
					candidateName: state.candidate.name,
					candidateEmail: state.candidate.email,
					files: submissionFiles,
					language: selectedLanguage,
					timestamp: new Date().toISOString(),
				};

				await apiService.submitChallenge(codeSubmission);

				// Update state with internal format
				dispatch({
					type: "UPDATE_SUBMISSION",
					payload: {
						challengeId,
						submission: { files, language: selectedLanguage, type: "code" },
					},
				});
			} else {
				// Open-ended submission
				const openEndedSubmission = {
					challengeId,
					type: "open-ended" as const,
					assessmentId,
					candidateName: state.candidate.name,
					candidateEmail: state.candidate.email,
					answer,
					timestamp: new Date().toISOString(),
				};

				await apiService.submitChallenge(openEndedSubmission);

				// Update state
				dispatch({
					type: "UPDATE_SUBMISSION",
					payload: { challengeId, submission: { answer, type: "open-ended" } },
				});
			}

			dispatch({
				type: "COMPLETE_CHALLENGE",
				payload: { challengeId },
			});

			alert(
				isAutoSubmit
					? "Time's up! Your challenge has been auto-submitted."
					: "Challenge submitted successfully!"
			);
			navigate(`/assessment/${assessmentId}/challenges`);
		} catch (error) {
			console.error("Error submitting challenge:", error);
			alert("Error submitting challenge. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleMultipleChoiceSubmit = async (submissionData: {
		challengeId: string;
		type: "multiple-choice";
		answers: Record<string, string>;
		timestamp: string;
		autoSubmit: boolean;
	}) => {
		if (!state.candidate || !challengeId || !assessmentId) return;

		try {
			// Create submission that matches API contract
			const mcSubmission = {
				challengeId,
				type: "multiple-choice" as const,
				assessmentId,
				candidateName: state.candidate.name,
				candidateEmail: state.candidate.email,
				answers: submissionData.answers,
				timestamp: submissionData.timestamp || new Date().toISOString(),
				autoSubmit: submissionData.autoSubmit || false,
			};

			await apiService.submitChallenge(mcSubmission);

			// Update state
			dispatch({
				type: "UPDATE_SUBMISSION",
				payload: { challengeId, submission: submissionData },
			});

			dispatch({
				type: "COMPLETE_CHALLENGE",
				payload: { challengeId },
			});

			// Show success message and navigate back immediately
			alert(
				submissionData.autoSubmit
					? "Time's up! Your challenge has been auto-submitted."
					: "Challenge submitted successfully!"
			);

			navigate(`/assessment/${assessmentId}/challenges`);
		} catch (error) {
			console.error("Error submitting challenge:", error);
			throw error;
		}
	};

	const handleBackToList = () => {
		navigate(`/assessment/${assessmentId}/challenges`);
	};

	const isCompleted = challengeId ? state.completedChallenges.has(challengeId) : false;

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
					<Button onClick={() => navigate(`/assessment/${assessmentId}/challenges`)}>
						Back to Challenges
					</Button>
				</div>
			</div>
		);
	}

	// Render MultipleChoiceChallenge for multiple-choice type
	if (challenge.type === "multiple-choice") {
		return (
			<MultipleChoiceChallenge
				challenge={challenge}
				onSubmit={handleMultipleChoiceSubmit}
				onBack={handleBackToList}
				savedAnswers={challengeId ? state.submissions[challengeId] : undefined}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Header */}
			<header className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-white/20">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6">
							<Button
								onClick={() => navigate(`/assessment/${assessmentId}/challenges`)}
								variant="secondary"
								icon={<ArrowLeft className="w-5 h-5" />}
							>
								Back to Challenges
							</Button>

							<div className="flex items-center space-x-4">
								<div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
									{challenge.type === "code" ? (
										<Code className="w-5 h-5 text-white" />
									) : (
										<FileText className="w-5 h-5 text-white" />
									)}
								</div>
								<div>
									<h1 className="text-2xl font-bold bg-gradient-to-r from-[#1578b9] to-[#40b3ff] bg-clip-text text-transparent">
										{challenge.title}
									</h1>
									<div className="flex items-center mt-1 space-x-4">
										<Badge variant={challenge.type}>{challenge.type.replace("-", " ")}</Badge>

										{isCompleted && (
											<Badge variant="success" icon={<CheckCircle className="w-4 h-4" />}>
												Completed
											</Badge>
										)}

										{/* Assessment Time Remaining Counter */}
										{sessionData?.timeLimit && remainingTimeSeconds !== null && (
											<div className="flex items-center text-sm text-gray-500">
												<Clock className="w-4 h-4 mr-2" />
												<span className="font-mono">
													Time: {formatAssessmentTime(remainingTimeSeconds)}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							{!isCompleted && (
								<Button
									onClick={() => handleSubmit(false)}
									disabled={submitting}
									icon={
										submitting ? (
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
										) : (
											<Send className="w-5 h-5" />
										)
									}
								>
									{submitting ? "Submitting..." : "Submit Challenge"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</header>

			<div className="px-6 py-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
					{/* Instructions Panel */}
					<Card padding="none" className="overflow-hidden">
						<div className="bg-gradient-to-r from-[#1578b9] to-[#40b3ff] p-4">
							<h2 className="text-xl font-bold text-white flex items-center">
								<FileText className="w-5 h-5 mr-3" />
								Instructions
							</h2>
						</div>
						<div className="p-4 overflow-auto h-full">
							<div className="prose prose-sm max-w-none">
								<pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
									{challenge.instructions}
								</pre>
							</div>
						</div>
					</Card>

					{/* Answer Panel */}
					<Card padding="none" className="overflow-hidden flex flex-col lg:col-span-2">
						<div className="bg-gradient-to-r from-[#00487a] to-[#002957] p-4">
							<h2 className="text-xl font-bold text-white flex items-center">
								{challenge.type === "code" ? (
									<Code className="w-5 h-5 mr-3" />
								) : (
									<FileText className="w-5 h-5 mr-3" />
								)}
								Your Solution
							</h2>
						</div>

						<div className="flex-1 p-4">
							{challenge.type === "code" ? (
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
					</Card>
				</div>

				{isCompleted && (
					<Card variant="success" className="mt-4">
						<div className="flex items-center">
							<div className="bg-green-500 rounded-full p-2 mr-4">
								<CheckCircle className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-green-800 mb-1">Challenge Completed!</h3>
								<span className="text-green-700">
									You can review your submission above. Great work!
								</span>
							</div>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
}

export default ChallengeDetail;

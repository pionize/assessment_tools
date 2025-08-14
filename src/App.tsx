import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChallengeDetail from "./components/ChallengeDetail";
import ChallengeList from "./components/ChallengeList";
import Login from "./components/Login";
import { AssessmentProvider } from "./contexts/AssessmentContext";

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
						<Route
							path="/assessment/:assessmentId/challenge/:challengeId"
							element={<ChallengeDetail />}
						/>

						{/* Catch all - redirect to home */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</div>
			</Router>
		</AssessmentProvider>
	);
}

export default App;

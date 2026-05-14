import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import OnboardingForm from './components/OnboardingForm'
import ResultsScreen from './components/ResultsScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<OnboardingForm />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
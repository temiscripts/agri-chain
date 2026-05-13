import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import OnboardingForm from './components/OnboardingForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<OnboardingForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ResourcesPage from './pages/Resources'
import CompoundInterest from './pages/CompoundInterest'
import LoanCalculator from './pages/LoanCalculator'
import RetirementCalculator from './pages/RetirementCalculator'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="compound-interest" element={<CompoundInterest />} />
          <Route path="loan-calculator" element={<LoanCalculator />} />
          <Route path="retirement-calculator" element={<RetirementCalculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

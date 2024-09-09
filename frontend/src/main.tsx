// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import SignUp from './pages/SignUp'
import Affiliate from './pages/Affiliate';
import Contact from './pages/Contact.tsx';
import Pricing from './pages/Pricing.tsx';
import CompleteProfile from './pages/CompleteProfile';
import RooostrUI from './pages/Dashboard.tsx'

import './index.css';
import './components/Navbar/Navbar.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/dashboard" element={<RooostrUI />}></Route>
        {/* <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/affiliate" element={<Affiliate />} /> */}
      </Routes>
    </Router>
  </StrictMode>,
);
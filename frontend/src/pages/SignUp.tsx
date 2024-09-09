// src/SignUp.tsx
import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import 'boxicons';
import './Login.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(formData.email, formData.password);
  };

  React.useEffect(() => {
    if (user) {
      // Navigate to the profile completion page
      navigate('/complete-profile');
    }
  }, [user, navigate]);

  return (
    <div className="wrapper-signup">
      <div className="wrapper-items">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button className="custom-button relative w-48 h-12 bg-[#650304] text-[#FF4E11] rounded-lg shadow-lg cursor-pointer overflow-hidden text-lg">
            <div className="relative z-10 font-bold text-xl">Sign Up</div>
            <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
          </button>
        </form>
        {loading ? <p>Loading...</p> : null}
        {error ? <p>Error: {error.message}</p> : null}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
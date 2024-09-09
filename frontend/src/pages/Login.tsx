// src/Login.tsx
import React, { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import 'boxicons';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user.email);
        navigate('/complete-profile');
      } else {
        setLoggedInUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailPasswordLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    signInWithEmailAndPassword(email, password);
  };

  return (
    <div className="wrapper-login">
      <div className="wrapper-items">
        <h1>Login</h1>
        {loggedInUser ? (
          <h2></h2>
        ) : (
          <h2></h2>
        )}
        <form onSubmit={handleEmailPasswordLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button className="custom-button relative w-48 h-12 bg-[#650304] text-[#FF4E11] rounded-lg shadow-lg cursor-pointer overflow-hidden text-lg">
            <div className="relative z-10 font-bold text-xl">Get Started</div>
            <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
          </button>
        </form>
        <div className="separator">or</div>
        <button onClick={() => signInWithGoogle()} className="custom-button google-button relative">
          <div className="text-wrapper-google">
            <box-icon type='logo' name='google' className="google-logo"></box-icon>
            <span>Sign in with Google</span>
          </div>
          <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
        </button>
        {loading || googleLoading ? <p>Loading...</p> : null}
        {error || googleError ? <p>Error: {error?.message || googleError?.message}</p> : null}
        {user || googleUser ? <p>Welcome, {user?.user.email || googleUser?.user.email}</p> : null}
        <p>
          Don't have an account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
// src/App.tsx
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="wrapper">
        <Navbar />

        <div className="landing-page flex flex-col items-center justify-center h-[73vh] text-center">
          <div className="main-landing flex flex-col items-center justify-center bg-white">
            <div className="landing-notification flex items-center justify-center bg-[rgba(255,78,17,0.27)] h-12 w-full rounded-full px-2">
              <h4 id="main-notification" className="opacity-100">
                🎉 We launched an AI tool that helps you make informed decisions about your investments
              </h4>
              <div className="loading-bar"></div>
            </div>
            <div className="landing-title text-2xl max-w-xl mt-4">
              <h1 id="main-title">From data to decision: faster, smarter, simpler.</h1>
            </div>
            <div className="landing-description text-lg mt-2">
              <p id="main-description">Select an area on the map, Input your desired ROI, Input your investment amount, and get emerging real estate investments in seconds instead of hours 🚀</p>
            </div>
            <div className="landing-button mt-4">
              <Link to="/login">
                <button className="custom-button relative w-48 h-12 bg-[#650304] text-[#FF4E11] rounded-lg shadow-lg cursor-pointer overflow-hidden text-lg">
                  <div className="relative z-10 font-bold text-xl">Start making money</div>
                  <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoRed from '../../assets/rooostr.ai logo/full-logo/png/white-red.png';
import './Navbar.css'; // Import custom CSS for animations

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center p-4 bg-white w-full">
        <div className="left-nav">
          <img src={LogoRed} alt="React Logo" className="w-64" />
        </div>
        <div className="flex space-x-4 right-nav">
          <Link to="/affiliate" className="nav-link">Become an affiliate</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/login"><button className="custom-button relative w-48 h-12 bg-[#650304] text-[#FF4E11] rounded-lg shadow-lg cursor-pointer overflow-hidden text-lg">
            <div className="relative z-10 font-bold text-xl">Get Started</div>
            <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
          </button></Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-between items-center p-4 bg-white w-full">
        <div className="left-nav">
          <img src={LogoRed} alt="React Logo" className="w-32" />
        </div>
        <button onClick={toggleMobileMenu} className="mobile-menu-button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Popup */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <Link to="/affiliate" className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl mb-4" onClick={toggleMobileMenu}>Become an affiliate</Link>
          <Link to="/contact" className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl mb-4" onClick={toggleMobileMenu}>Contact Us</Link>
          <Link to="/pricing" className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl mb-4" onClick={toggleMobileMenu}>Pricing</Link>
          <button className="custom-button relative w-48 h-12 bg-[#650304] text-[#FF4E11] rounded-lg shadow-lg cursor-pointer overflow-hidden text-lg mb-4" onClick={toggleMobileMenu}>
            <div className="relative z-10 font-bold text-xl">Get Started</div>
            <div className="absolute w-full h-1/2 bg-[url('../../assets/graphics/wave.svg')] bg-[length:200%_100%] top-full left-0 transition-all duration-500 hover:top-1/2 wave"></div>
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
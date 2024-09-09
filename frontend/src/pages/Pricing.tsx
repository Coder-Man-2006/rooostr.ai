// src/pages/Pricing.tsx
import React from 'react';
import './Pricing.css';

const Pricing: React.FC = () => {
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Our Pricing Plans</h1>
        <p>Choose the plan that best fits your needs.</p>
      </div>
      <div className="pricing-content">
        <div className="pricing-card">
          <h2>Basic Plan</h2>
          <p className="price">$9.99/month</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
          </ul>
          <button className="custom-button">Get Started</button>
        </div>
        <div className="pricing-card">
          <h2>Standard Plan</h2>
          <p className="price">$19.99/month</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <li>Feature 4</li>
          </ul>
          <button className="custom-button">Get Started</button>
        </div>
        <div className="pricing-card">
          <h2>Premium Plan</h2>
          <p className="price">$29.99/month</p>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <li>Feature 4</li>
            <li>Feature 5</li>
          </ul>
          <button className="custom-button">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
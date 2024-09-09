// src/pages/Contact.tsx
import React, { useState } from 'react';
import './Contact.css';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebaseConfig'; // Ensure you have initialized Firebase app

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const functions = getFunctions(app);
    const sendEmail = httpsCallable(functions, 'sendEmail');

    try {
      const result = await sendEmail(formData);
      const data = result.data as { success: boolean; error?: string };

      if (data.success) {
        alert('Message sent!');
      } else {
        alert('Failed to send message: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message: ' + (error as Error).message);
    }
  };

  return (
    <body className="fullcontact">
      <div className="contact-page">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Reach out to us with any questions or feedback.</p>
        </div>
        <div className="contact-content">
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="custom-button">Send Message</button>
            </form>
          </div>
          <div className="contact-info">
            <h2>Our Office</h2>
            <p>75 University Ave. West
            Waterloo, ON N2L 3C5</p>
            <p>Email: jatoujoseph@gmail.com</p>
            <p>Phone: (437) 261-7592</p>
            <div className="map">
              <iframe
                title="company-location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.514518927418!2d-80.5267326845015!3d43.4722855791276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf3a1b6b6b6b7%3A0x4b4b4b4b4b4b4b4b!2s44%20Bricker%20Ave%2C%20Waterloo%2C%20ON%20N2L%203B5%2C%20Canada!5e0!3m2!1sen!2sus!4v1611817437245!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Contact;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import './CompleteProfile.css';

const countryCodes = [
  { code: '+1-US', name: 'United States' },
  { code: '+1-CA', name: 'Canada' },
  { code: '+44-UK', name: 'United Kingdom' },
  { code: '+91-IN', name: 'India' },
  { code: '+61-AU', name: 'Australia' },
  { code: '+81-JP', name: 'Japan' },
  { code: '+49-DE', name: 'Germany' },
  { code: '+33-FR', name: 'France' },
  { code: '+39-IT', name: 'Italy' },
  { code: '+86-CN', name: 'China' },
  { code: '+7-RU', name: 'Russia' },
  { code: '+34-ES', name: 'Spain' },
  { code: '+46-SE', name: 'Sweden' },
  { code: '+41-CH', name: 'Switzerland' },
  { code: '+31-NL', name: 'Netherlands' },
  { code: '+32-BE', name: 'Belgium' },
  { code: '+45-DK', name: 'Denmark' },
  { code: '+47-NO', name: 'Norway' },
  { code: '+351-PT', name: 'Portugal' },
  { code: '+30-GR', name: 'Greece' },
  { code: '+90-TR', name: 'Turkey' },
  { code: '+52-MX', name: 'Mexico' },
  { code: '+54-AR', name: 'Argentina' },
  { code: '+55-BR', name: 'Brazil' },
  { code: '+64-NZ', name: 'New Zealand' },
  { code: '+82-KR', name: 'South Korea' },
  { code: '+66-TH', name: 'Thailand' },
  { code: '+63-PH', name: 'Philippines' },
  { code: '+60-MY', name: 'Malaysia' },
  { code: '+65-SG', name: 'Singapore' },
  { code: '+62-ID', name: 'Indonesia' },
  { code: '+27-ZA', name: 'South Africa' },
  { code: '+20-EG', name: 'Egypt' },
  { code: '+234-NG', name: 'Nigeria' },
  { code: '+254-KE', name: 'Kenya' },
  { code: '+213-DZ', name: 'Algeria' },
  { code: '+212-MA', name: 'Morocco' },
  { code: '+216-TN', name: 'Tunisia' },
  { code: '+98-IR', name: 'Iran' },
  { code: '+964-IQ', name: 'Iraq' },
  { code: '+973-BH', name: 'Bahrain' },
  { code: '+971-AE', name: 'United Arab Emirates' },
  { code: '+966-SA', name: 'Saudi Arabia' },
  { code: '+974-QA', name: 'Qatar' },
  { code: '+962-JO', name: 'Jordan' },
  { code: '+961-LB', name: 'Lebanon' },
  { code: '+972-IL', name: 'Israel' },
  { code: '+93-AF', name: 'Afghanistan' },
  { code: '+92-PK', name: 'Pakistan' },
  { code: '+94-LK', name: 'Sri Lanka' },
  { code: '+880-BD', name: 'Bangladesh' },
  { code: '+856-LA', name: 'Laos' },
  { code: '+95-MM', name: 'Myanmar' },
  { code: '+84-VN', name: 'Vietnam' },
  { code: '+357-CY', name: 'Cyprus' },
  { code: '+373-MD', name: 'Moldova' },
  { code: '+994-AZ', name: 'Azerbaijan' },
  { code: '+995-GE', name: 'Georgia' },
  { code: '+380-UA', name: 'Ukraine' },
  { code: '+386-SI', name: 'Slovenia' },
  { code: '+420-CZ', name: 'Czech Republic' },
  { code: '+421-SK', name: 'Slovakia' },
  { code: '+372-EE', name: 'Estonia' },
  { code: '+371-LV', name: 'Latvia' },
  { code: '+370-LT', name: 'Lithuania' },
  { code: '+48-PL', name: 'Poland' },
  { code: '+40-RO', name: 'Romania' },
  { code: '+36-HU', name: 'Hungary' },
  { code: '+389-MK', name: 'North Macedonia' },
  { code: '+355-AL', name: 'Albania' },
  { code: '+381-RS', name: 'Serbia' },
  { code: '+382-ME', name: 'Montenegro' },
  { code: '+383-XK', name: 'Kosovo' },
  { code: '+258-MZ', name: 'Mozambique' },
  { code: '+263-ZW', name: 'Zimbabwe' },
  { code: '+255-TZ', name: 'Tanzania' },
  { code: '+260-ZM', name: 'Zambia' },
  { code: '+243-CD', name: 'Democratic Republic of the Congo' },
  { code: '+241-GA', name: 'Gabon' },
  { code: '+221-SN', name: 'Senegal' },
  { code: '+231-LR', name: 'Liberia' },
  { code: '+220-GM', name: 'Gambia' },
  { code: '+253-DJ', name: 'Djibouti' },
  { code: '+248-SC', name: 'Seychelles' },
  { code: '+262-RE', name: 'Reunion' },
  { code: '+675-PG', name: 'Papua New Guinea' },
  { code: '+679-FJ', name: 'Fiji' },
  { code: '+686-KI', name: 'Kiribati' },
  { code: '+692-MH', name: 'Marshall Islands' },
  { code: '+691-FM', name: 'Micronesia' },
  { code: '+672-NF', name: 'Norfolk Island' },
  { code: '+677-SB', name: 'Solomon Islands' },
  { code: '+685-WS', name: 'Samoa' },
  { code: '+678-VU', name: 'Vanuatu' }
  // Add more country codes as needed
];

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    countryCode: '+1-US',
    firstName: '',
    lastName: '',
    organization: '',
    location: '',
    linkedin: '',
    role: '',
    birthdate: '',
    // Add other fields as needed
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          navigate('/dashboard');
        } else {
          setFormData((prevData) => ({
            ...prevData,
            email: user.email || '',
          }));
        }
        console.log(`You are logged in as ${user.email}`);
      } else {
        navigate('/login');
        console.log('User is not logged in');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, db]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        // Save the profile data to Firestore under the user's uid
        await setDoc(doc(db, 'users', user.uid), formData);
        // After saving, navigate to the dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile data:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper-complete-profile">
      <div className="wrapper-items">
        <h1>Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="complete-profile-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone*</label>
            <div className="phone-input">
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                required
              >
                {countryCodes.map(country => (
                  <option key={`${country.code}-${country.name}`} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>
              <InputMask
                mask="(999) 999-9999"
                maskChar={null}
                value={formData.phone}
                onChange={handleChange}
                inputMode="tel"
                id="phone"
                name="phone"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="organization">Organization*</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">City, State/Province*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role*</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Birthdate*</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          {/* Add other fields as needed */}
          <button type="submit" className="custom-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
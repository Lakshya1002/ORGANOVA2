import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { OrganContext } from '../context/OrganContext';
import './RecipientRegistration.css';

const RecipientRegistration = () => {
  const { addRecipient } = useContext(OrganContext);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    blood_type: '',
    organ_needed: '',
    urgency_level: 1,
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await addRecipient(formData);

    setLoading(false);
    alert('Thank you for registering. We will notify you when a match is found.');
    setFormData({ name: '', age: '', blood_type: '', organ_needed: '', urgency_level: 1, email: '', phone: '' });
  };

  return (
    <motion.div className="recipient-registration-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="recipient-registration">
        <h2>Recipient Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
           <div className="form-group">
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
           <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
           <div className="form-group">
            <label>Phone:</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Blood Type:</label>
             <select name="blood_type" value={formData.blood_type} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="form-group">
            <label>Organ Needed:</label>
            <select name="organ_needed" value={formData.organ_needed} onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="Heart">Heart</option>
              <option value="Lungs">Lungs</option>
              <option value="Kidney">Kidney</option>
              <option value="Liver">Liver</option>
              <option value="Pancreas">Pancreas</option>
              <option value="Cornea">Cornea</option>
            </select>
          </div>
           <div className="form-group">
            <label>Urgency Level (1-5):</label>
            <input 
                type="number" 
                name="urgency_level" 
                min="1" 
                max="5" 
                value={formData.urgency_level} 
                onChange={handleChange} 
                required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default RecipientRegistration;
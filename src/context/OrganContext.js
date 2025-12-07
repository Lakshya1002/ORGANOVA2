import React, { createContext, useState, useEffect } from 'react';

export const OrganContext = createContext();

export const OrganProvider = ({ children }) => {
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [matches, setMatches] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch initial data from the backend
  useEffect(() => {
    fetchDonors();
    fetchRecipients();
    // You might want to fetch matches periodically or on a specific event
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/donors');
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/patients');
      const data = await response.json();
      setRecipients(data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  // Run the matching algorithm on the server
  const runMatching = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/matches/run');
      const data = await response.json();
      setMatches(data);
      if (data.length > 0) {
          setAlerts(prev => [...prev, { id: Date.now(), message: `Found ${data.length} new matches!`, priority: 'High', date: new Date().toLocaleDateString() }]);
      }
    } catch (error) {
      console.error('Error running matching:', error);
    }
  };

  const addDonor = async (donorData) => {
    try {
      const response = await fetch('http://localhost:3001/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData),
      });
      if (response.ok) {
        fetchDonors(); // Refresh the list
        setAlerts(prev => [...prev, { id: Date.now(), message: `New donor registered: ${donorData.name}`, priority: 'Medium', date: new Date().toLocaleDateString() }]);
        // Optionally trigger matching here
        runMatching();
      }
    } catch (error) {
      console.error('Error adding donor:', error);
    }
  };

  const addRecipient = async (recipientData) => {
    try {
      const response = await fetch('http://localhost:3001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipientData),
      });
      if (response.ok) {
        fetchRecipients(); // Refresh list
        setAlerts(prev => [...prev, { id: Date.now(), message: `New patient waiting: ${recipientData.name}`, priority: 'High', date: new Date().toLocaleDateString() }]);
        runMatching();
      }
    } catch (error) {
      console.error('Error adding recipient:', error);
    }
  };

  return (
    <OrganContext.Provider value={{ 
      donors, 
      recipients, 
      matches, 
      alerts, 
      addDonor, 
      addRecipient,
      runMatching 
    }}>
      {children}
    </OrganContext.Provider>
  );
};
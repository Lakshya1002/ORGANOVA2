const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Patients ORDER BY urgency_level DESC, registered_at ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a new patient
router.post('/', async (req, res) => {
  const { name, age, blood_type, organ_needed, urgency_level, email, phone } = req.body;

  if (!name || !blood_type || !organ_needed) {
    return res.status(400).json({ error: 'Name, Blood Type, and Organ Needed are required.' });
  }

  try {
    const sql = `INSERT INTO Patients (name, age, blood_type, organ_needed, urgency_level, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, age, blood_type, organ_needed, urgency_level || 1, email, phone]);
    
    res.status(201).json({ message: 'Patient registered successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during registration' });
  }
});

module.exports = router;
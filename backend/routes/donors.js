const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Donors ORDER BY registered_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a new donor
router.post('/', async (req, res) => {
  const { name, age, blood_type, organ_donated, email, phone } = req.body;
  
  // Simple Validation
  if (!name || !blood_type || !organ_donated) {
    return res.status(400).json({ error: 'Name, Blood Type, and Organ are required.' });
  }

  try {
    const sql = `INSERT INTO Donors (name, age, blood_type, organ_donated, email, phone) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, age, blood_type, organ_donated, email, phone]);
    
    res.status(201).json({ message: 'Donor registered successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error during registration' });
  }
});

module.exports = router;
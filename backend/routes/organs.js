
/**
 * backend/routes/organs.js
 * - POST /api/organs  -> create organ linked to donor
 * - GET  /api/organs  -> list organs (optional query: hospital_id, status)
 */
const express = require('express');
const router = express.Router();
const db = require('../db/db');

const EXPIRY_HOURS = {
  HEART: 6,
  LUNG: 8,
  LUNGS: 8,
  LIVER: 12,
  KIDNEY: 24,
  PANCREAS: 12,
  DEFAULT: 12
};

// Create organ entry
router.post('/', async (req, res) => {
  try {
    const { donor_id, hospital_id, organ_type, blood_group, condition, hla_code } = req.body;
    if (!donor_id || !hospital_id || !organ_type || !blood_group) {
      return res.status(400).json({ error: 'donor_id, hospital_id, organ_type and blood_group are required' });
    }

    const now = new Date();
    const key = organ_type.toString().toUpperCase();
    const hours = EXPIRY_HOURS[key] || EXPIRY_HOURS.DEFAULT;
    const expiry = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const sql = `INSERT INTO Organs (donor_id, hospital_id, organ_type, blood_group, condition, retrieval_time, expiry_time, hla_code, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`;
    const [result] = await db.query(sql, [donor_id, hospital_id, organ_type, blood_group, condition || 'GOOD', now, expiry, hla_code || null]);
    return res.status(201).json({ message: 'Organ created', organ_id: result.insertId, expiry_time: expiry });
  } catch (err) {
    console.error('Organ create error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});
ṣ

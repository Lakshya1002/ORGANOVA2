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

// List organs (optional filters)
router.get('/', async (req, res) => {
  try {
    const { hospital_id, status } = req.query;
    let sql = 'SELECT o.*, d.name as donor_name, h.name as hospital_name FROM Organs o LEFT JOIN Donors d ON o.donor_id=d.id LEFT JOIN Hospitals h ON o.hospital_id=h.id';
    const params = [];
    const conditions = [];
    if (hospital_id) { conditions.push('o.hospital_id = ?'); params.push(hospital_id); }
    if (status) { conditions.push('o.status = ?'); params.push(status); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY o.created_at DESC';
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('Organs list error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

module.exports = router;

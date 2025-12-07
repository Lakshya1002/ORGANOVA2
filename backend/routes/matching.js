const db = require('../config/db');

exports.runMatchingAlgorithm = async (req, res) => {
  try {
    // 1. Fetch Active Donors and Waiting Patients
    const [donors] = await db.query("SELECT * FROM Donors WHERE status='Available'");
    const [patients] = await db.query("SELECT * FROM Patients WHERE status='Waiting'");

    let potentialMatches = [];

    // Algorithm Weights
    const WEIGHTS = { BLOOD: 40, URGENCY: 30, AGE: 20, WAITING_TIME: 10 };

    donors.forEach(donor => {
      patients.forEach(patient => {
        // Basic hard filter: Organ must match
        if (donor.organ_type !== patient.organ_needed) return;

        let score = 0;
        let reasons = [];

        // A. Blood Compatibility Check
        if (checkBloodCompatibility(donor.blood_type, patient.blood_type)) {
          score += WEIGHTS.BLOOD;
          reasons.push('Blood Type Compatible');
        } else {
            return; // Incompatible blood type = No match
        }

        // B. Urgency Score (Scale 1-10)
        score += (patient.urgency_score / 10) * WEIGHTS.URGENCY;
        if (patient.urgency_score >= 8) reasons.push('High Urgency Patient');

        // C. Age Proximity
        const ageDiff = Math.abs(donor.age - patient.age);
        if (ageDiff <= 10) score += WEIGHTS.AGE;
        else if (ageDiff <= 20) score += (WEIGHTS.AGE / 2);

        // Add to list if score is decent
        if (score >= 50) {
          potentialMatches.push({
            donor,
            patient,
            score: Math.round(score),
            reasons
          });
        }
      });
    });

    // Sort matches by score (Highest first)
    potentialMatches.sort((a, b) => b.score - a.score);

    res.json({ count: potentialMatches.length, matches: potentialMatches });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Matching algorithm failed.' });
  }
};

// Helper: Blood Type Compatibility Logic
function checkBloodCompatibility(donor, recipient) {
    if (donor === 'O-') return true; // Universal Donor
    if (recipient === 'AB+') return true; // Universal Recipient
    if (donor === recipient) return true; // Exact match
    
    // Specific cases
    if (donor === 'O+' && (recipient === 'O+' || recipient === 'A+' || recipient === 'B+' || recipient === 'AB+')) return true;
    if (donor === 'A-' && (recipient === 'A-' || recipient === 'A+' || recipient === 'AB-' || recipient === 'AB+')) return true;
    if (donor === 'A+' && (recipient === 'A+' || recipient === 'AB+')) return true;
    // ... add other specific rules as needed
    
    return false; 
}
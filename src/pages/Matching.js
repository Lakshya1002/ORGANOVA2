import React, { useContext, useEffect } from 'react';
import { OrganContext } from '../context/OrganContext';
import './Matching.css';

const Matching = () => {
  const { matches, runMatching } = useContext(OrganContext);

  // Optionally run matching when the page loads to get the latest
  useEffect(() => {
    runMatching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="matching">
      <h2>Matching Results</h2>
      <p className="matching-description">
        Potential matches identified by our algorithm based on organ type, blood compatibility, and urgency.
      </p>
      
      {matches.length === 0 ? (
        <p>No matches found at this time.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Donor Blood</th>
              <th>Organ</th>
              <th>Recipient Name</th>
              <th>Recipient Blood</th>
              <th>Urgency</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index}>
                <td>{match.donor_name}</td>
                <td>{match.donor_blood}</td>
                <td>{match.organ_donated}</td>
                <td>{match.patient_name}</td>
                <td>{match.patient_blood}</td>
                <td>
                    <span className={`urgency-badge level-${match.urgency_level}`}>
                        Level {match.urgency_level}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Matching;
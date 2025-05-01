import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CodeHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="history-container">
      <h2>Your Code History</h2>
      {history.length === 0 ? (
        <p>No history found. Run some code to see it here!</p>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-meta">
                <span className="language">{item.language}</span>
                <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <pre className="history-code">{item.code.substring(0, 100)}...</pre>
              <Link to={`/?load=${item._id}`} className="view-link">View & Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeHistory;
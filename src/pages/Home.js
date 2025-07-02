import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventsCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendedEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchRecommendations();
    }
  }, [user, token, fetchRecommendations]);

  return (
    <>
      <div className="home-container">
        <h1>Welcome to the Event Management Website</h1>
        <p>Your one-stop platform to discover and manage events effortlessly.</p>
        <div className="home-buttons">
          <button onClick={() => navigate('/events')}>View Events</button>
          {!user && (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
        {user && recommendedEvents.length > 0 && (
          <div className="recommendations-section">
            <h2>Recommended for You</h2>
            <div className="recommendations-list">
              {recommendedEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;

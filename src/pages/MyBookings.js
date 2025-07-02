// frontend/src/pages/MyBookings.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MyBookings.css';

function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        if (err.response && (err.response.status === 401 || err.response.status === 400)) {
          alert('Session expired or unauthorized. Please login again.');
          window.location.href = '/login';
        } else {
          alert('Failed to fetch bookings. Please try again later.');
        }
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings((prevBookings) => prevBookings.filter(b => b._id !== bookingId));
      alert('Booking cancelled successfully.');
    } catch (err) {
      console.error('Failed to cancel booking', err);
      if (err.response && (err.response.status === 401 || err.response.status === 400)) {
        alert('Session expired or unauthorized. Please login again.');
        window.location.href = '/login';
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const updatePaymentStatus = async (bookingId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/payment-status`, 
        { paymentStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('http://localhost:5000/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to update payment status', err);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mybookings-container">
      <h2>My Bookings</h2>
      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          <h4>{b.eventId.title}</h4>
          <p>{new Date(b.eventId.date).toLocaleDateString()}</p>
          <p className={`payment-status ${b.paymentStatus === 'completed' ? 'completed' : b.paymentStatus === 'failed' ? 'failed' : ''}`}>
            Payment Status: {b.paymentStatus}
          </p>
          <p>Notifications:</p>
          <ul className="notifications-list">
            {b.notifications.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
          <button onClick={() => handleCancel(b._id)}>Cancel Booking</button>
          {b.paymentStatus !== 'completed' && (
            <div className="payment-buttons" style={{ marginTop: '10px' }}>
              <button onClick={() => updatePaymentStatus(b._id, 'completed')} style={{ marginRight: '5px' }}>
                Mark Payment Completed
              </button>
              <button onClick={() => updatePaymentStatus(b._id, 'failed')}>
                Mark Payment Failed
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyBookings;

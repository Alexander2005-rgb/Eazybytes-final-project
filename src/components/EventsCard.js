import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './EventCard.css';

function EventCard({ event }) {
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/event-comments/${event._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  }, [event._id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleBooking = async () => {
    if (!token) {
      navigate('/register');
      return;
    }
    setPaymentStep(true);
  };

  const handlePayment = async () => {
    if (!token) {
      navigate('/register');
      return;
    }
    setBookingStatus('Processing payment...');
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingStatus('Payment successful, booking event...');
      await axios.post(`http://localhost:5000/api/bookings/${event._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingStatus('Booking successful');
      setPaymentStep(false);
    } catch (err) {
      setBookingStatus('Booking failed');
      setPaymentStep(false);
    }
  };

  const handleAddComment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/event-comments/${event._id}`, { text: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this event: ${event.title}`;
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Price: ${event.price}</p>
      <p>Seats Available: {event.availableSeats}</p>
      {!paymentStep && (
        <button onClick={handleBooking} disabled={event.availableSeats <= 0}>
          {event.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
        </button>
      )}
      {paymentStep && (
        <div>
          <p>Mock Payment Step</p>
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      )}
      {bookingStatus && <p>{bookingStatus}</p>}

      <div className="comments-section">
        <h4>Comments</h4>
        {comments.length === 0 && <p>No comments yet.</p>}
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.username}:</strong> {comment.text}
            </li>
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          rows={3}
        />
        <button onClick={handleAddComment} disabled={!newComment.trim()}>
          Submit Comment
        </button>
      </div>

      <div className="share-section">
        <h4>Share this event</h4>
        <button onClick={() => handleShare('facebook')}>
          Share on Facebook
        </button>
        <button onClick={() => handleShare('twitter')}>
          Share on Twitter
        </button>
      </div>
    </div>
  );
}

export default EventCard;

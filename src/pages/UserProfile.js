import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user, token, setUser } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('http://localhost:5000/api/events/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  const handleCheckboxChange = (category) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter(c => c !== category));
    } else {
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/interests', 
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Interests updated successfully.');
      // Update user context interests
      setUser(prevUser => ({ ...prevUser, interests: selectedInterests }));
    } catch (err) {
      console.error('Failed to update interests', err);
      setMessage('Failed to update interests.');
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Select Your Interests</legend>
          {categories.length === 0 && <p>Loading categories...</p>}
          {categories.map(category => (
            <label key={category} className="category-label">
              <input
                type="checkbox"
                value={category}
                checked={selectedInterests.includes(category)}
                onChange={() => handleCheckboxChange(category)}
              />
              {category}
            </label>
          ))}
        </fieldset>
        <button type="submit">Update Interests</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UserProfile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsCard from '../components/EventsCard';
import EventSearchFilter from '../components/EventSearchFilter';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleFilter = (filters) => {
    let filtered = events;

    if (filters.searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(event =>
        new Date(event.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(event =>
        new Date(event.date) <= new Date(filters.endDate)
      );
    }

    if (filters.minPrice !== null) {
      filtered = filtered.filter(event =>
        event.price >= filters.minPrice
      );
    }

    if (filters.maxPrice !== null) {
      filtered = filtered.filter(event =>
        event.price <= filters.maxPrice
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(event =>
        event.categories && event.categories.some(cat => filters.categories.includes(cat))
      );
    }

    setFilteredEvents(filtered);
  };

  return (
    <div className="events-container">
      <h2>Events</h2>
      <div className="filter-section">
        <EventSearchFilter onFilter={handleFilter} />
      </div>
      <div className="events-list">
        {filteredEvents.map(event => (
          <EventsCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Events;

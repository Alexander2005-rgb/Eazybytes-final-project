import React, { useState } from 'react';
import './EventSearchFilter.css';

function EventSearchFilter({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = ['Music', 'Sports', 'Tech', 'Art', 'Education']; // example categories

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleFilter = () => {
    onFilter({
      searchTerm,
      startDate,
      endDate,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      categories: selectedCategories.length > 0 ? selectedCategories : null,
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search events"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <input
        type="date"
        placeholder="Start date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="End date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={e => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
      />
      <div>
        <p>Categories:</p>
        {categories.map(category => (
          <label key={category} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {category}
          </label>
        ))}
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
}

export default EventSearchFilter;

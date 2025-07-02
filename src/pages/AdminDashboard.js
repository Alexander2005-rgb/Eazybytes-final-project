import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99'];

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Admin analytics data:', res.data);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        if (err.response && err.response.status === 403) {
          setError('access_denied');
        } else {
          setError('generic');
        }
      }
    }
    fetchAnalytics();
  }, [token]);
  
  // Debug display of raw analytics data
  if (analytics) {
    console.log('Events by category data:', Object.entries(analytics.eventsByCategory || {}));
  }

  if (error === 'access_denied') {
    return <div style={{ marginTop: '80px', color: 'red' }}>Access denied. You must be an admin to view this dashboard.</div>;
  }

  if (error === 'generic') {
    return <div style={{ marginTop: '80px', color: 'red' }}>Failed to load analytics. Please try again later.</div>;
  }

  if (!analytics) {
    return <div style={{ marginTop :'80px'}} >Loading analytics...</div>;
  }

  // Prepare data for charts
  const eventsByCategoryData = Object.entries(analytics.eventsByCategory || {}).map(
    ([category, count]) => ({ name: category, value: count })
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Analytics Dashboard</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Event Attendance</h3>
        <ul>
          {analytics.eventAttendance.map(event => (
            <li key={event._id}>
              {event.title}: {event.attendeesCount} attendees
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>User Activity</h3>
        <p>Total Users: {analytics.totalUsers}</p>
        <p>Active Users: {analytics.activeUsers}</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Events Overview</h3>
        <p>Total Events: {analytics.totalEvents}</p>
        <p>Upcoming Events: {analytics.upcomingEventsCount}</p>
      </div>

      <div style={{ width: '100%', height: 300, marginBottom: '30px' }}>
        <h3>Events by Category</h3>
        {eventsByCategoryData.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={eventsByCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {eventsByCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No category data available</p>
        )}
      </div>

      <div style={{ width: '100%', height: 300, marginBottom: '30px' }}>
        <h3>Revenue and Pricing</h3>
        <ResponsiveContainer>
          <BarChart
            data={[
              { name: 'Average Price', value: analytics.averageEventPrice },
              { name: 'Total Revenue', value: analytics.totalRevenueEstimate },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Raw Analytics Data (Debug)</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(analytics, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AdminDashboard;

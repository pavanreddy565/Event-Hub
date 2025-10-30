import React, { useState, useEffect, useMemo } from 'react';
import './style.css';
import './Teacherboard.scss';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import TeacherEvents from './teacherNavigationPages/TeacherEvents';

function Teacherboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [searchText, setSearch] = useState('');
  const [notification, setNotification] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventTitles, setEventTitles] = useState([]);
  
  const location = useLocation();
  const isActive = location.pathname;

  // Auto-load user from localStorage and fetch events
  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');

    if (storedUserDetails) {
      const parsedUser = JSON.parse(storedUserDetails);
      setUserDetails(parsedUser);

      // Fetch teacher events
      axios.post('http://localhost:8080/teacherEvent', {
        userName: parsedUser.userName,
      })
      .then(response => {
        if (response.status === 200) {
          console.log("Teacher's events:", response.data.events);
          setEvents(response.data.events || []);
        }
      })
      .catch(error => {
        console.error('Error fetching teacher events:', error);
        setEvents([]); // Set empty array on error
      });
    }
  }, []);

  // Extract event titles when events change
  useEffect(() => {
    if (Array.isArray(events)) {
      const titles = events.map(event => event.EventName);
      setEventTitles(titles);
    }
  }, [events]);

  // Search filtering
  const filteredevents = useMemo(() => {
    const searchTerm = searchText.toLowerCase();
    return eventTitles.filter(item => {
      const title = item.toLowerCase();
      return searchTerm && title.startsWith(searchTerm) && title !== searchTerm;
    });
  }, [searchText, eventTitles]);

  const img_ = userDetails?.profileImg || '../src/assets/image.png';

  return (
    <div className="mainWarp">
      <div className="MainContent mainContent">
        <div className="HeaderContent headerContent">
          <div className="wishUser">
            <h1>Welcome, {userDetails?.name || 'Teacher'}</h1>
          </div>
          <div className="generalUI">
            {/* Search Box */}
            <div className="searchThings">
              <div className="search_bar">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  value={searchText}
                />
                <i className="fa fa-search"></i>
              </div>

              {/* Autocomplete Search Results */}
              {filteredevents.length > 0 && (
                <div className="searchOptions">
                  {filteredevents.map((item) => (
                    <div className="searchOptionRow" key={item}>
                      <Link to={`/event/${encodeURIComponent(item)}`} className="profile_info">
                        {item}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="notifications">
              <i
                onClick={() => setNotification(prev => !prev)}
                className="fa fa-bell bell"
                style={{ fontSize: "24px", cursor: "pointer" }}
              ></i>
              {notification && (
                <div className="notification_pannel">
                  <h4>No notifications</h4>
                </div>
              )}
            </div>

            {/* User Profile Image */}
            <div className="userProfile">
              <div className="profile">
                <Link to={'/profile'}>
                  <img src={img_} alt="Profile" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="events">
        {events.map((event, idx) => (
          <div className="event" key={idx}>
            <TeacherEvents val={event} applied={false} />
          </div>
        ))}
        
        <div className="event">
          <Link to="/addEvent" className="add-event-box">
            <div className="add-event-circle">
              <span className="plus-icon">+</span>
            </div>
            <p>Add New Event</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Teacherboard;
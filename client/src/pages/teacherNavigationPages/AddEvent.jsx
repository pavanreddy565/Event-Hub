import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addEvent.scss';
import { useNavigate } from 'react-router-dom';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [hostRole, setHostRole] = useState('');
  const [link, setLink] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails?.userName) return;

    const eventDetails = {
      EventName: eventName,
      Description: description,
      Host_Role: hostRole,
      Link: link,
      PostedBy: userDetails.userName,
      skills: skills
    };

    try {
      const response = await axios.post('http://localhost:8080/addEvent', eventDetails);

      if (response.status === 200) {
        navigate('/teacher');
      } else {
        alert('Failed to add event.');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Something went wrong. Check console.');
    }
  };

  return (
    <div className="add-event-page">
      <div className="add-event-container">
        <h2>Add New Event</h2>
        <form className="event-form" onSubmit={handleSubmit}>
          <label>
            Event Name:
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          </label>

          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>

          <label>
            Host Role:
            <input type="text" value={hostRole} onChange={(e) => setHostRole(e.target.value)} required />
          </label>

          <label>
            Event Link:
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required />
          </label>

        <label>
          Skills:
          <div className="skills-input-wrapper">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter a skill"
            />
            <button type="button" onClick={handleAddSkill} className="add-skill-button">+</button>
          </div>
        </label>

        {skills.length > 0 && (
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        )}

        <button type="submit" className="submit-button">Add Event</button>
      </form>
    </div>
  </div>
);
}

export default AddEvent;

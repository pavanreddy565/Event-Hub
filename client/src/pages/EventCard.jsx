import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './EventCard.scss';
import { useParams } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

const EventCard = () => {
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState(null);
    const [SavedEvents,setSavedEvents]=useState([]);
    useEffect(() => {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
          setUserDetails(JSON.parse(storedUserDetails));

        }
        
    }, []);
    useEffect(() => {
        setSavedEvents(userDetails&&userDetails.SavedEvents?userDetails.SavedEvents:SavedEvents);
    },[userDetails])
    let { eventName } = useParams();
    eventName = decodeURIComponent(eventName);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //console.log(`${eventName}`)
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:8080/getEvent', { EventName: eventName });
                setEvent(response.data.events);
            } catch (err) {
                setError('Failed to fetch event details');
                console.error('Error fetching event:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventName]);

    const handleApply = async () => {
        try {
            console.log(typeof userDetails.SavedEvents)
          const filterSave = userDetails.SavedEvents.filter((ev) => ev !== event.EventName);
          const updatedAppliedEvents = userDetails.AppliedEvents.includes(event.EventName)
            ? userDetails.AppliedEvents
            : [...userDetails.AppliedEvents, event.EventName];
      
          const updatedUserDetails = {
            ...userDetails,
            SavedEvents: filterSave,
            AppliedEvents: updatedAppliedEvents
          };
      
          const response = await axios.post('http://localhost:8080/update', updatedUserDetails);
      
          if (response.status === 200) {
            // Update local state
            localStorage.setItem('userDetails',JSON.stringify(updatedUserDetails));
            setUserDetails(updatedUserDetails);
            navigate('/dashboard');
          } else {
            throw new Error('Update failed');
          }
        } catch (error) {
          console.error('Error updating user details:', error);
          // Handle error (e.g., show an error message to the user)
        }
      };
      

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!event) return <div>No event found</div>;
    return (
        <div className="eventCard_wrap">
            <div className="event-card">
            <img src={`https://via.placeholder.com/800x300.png?text=${encodeURIComponent(event.EventName)}`} alt={event.EventName} className="event-image" />
            <div className="event-details">
                <h1>{event.EventName}</h1>
                <p className="host-role">Hosted by: {event.Host_Role}</p>
                <p className="description">{event.Description}</p>
                <div className="skills">
                {event.skills.map((skill, index) => (
                    <span key={index} className="skill">{skill}</span>
                ))}
                </div>
                <div className="accountSession">
                    <a href={event.link} className="link" target="_blank" rel="noopener noreferrer">Learn More</a>
                    <button onClick={
                            ()=>{
                                const data={...userDetails,SavedEvents:[...SavedEvents,event.EventName]}
                                axios.post(`http://localhost:8080/update`,data)
                                .then(result=>{
                                    console.log(result);
                                    if (result.status ===200){
                                        localStorage.setItem('userDetails',JSON.stringify(data));
                                        navigate('/dashboard')
                                    }
                                })
                            }
                        }>Save</button>
                    <button onClick={handleApply}>Apply</button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default EventCard;
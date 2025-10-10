import { useState, useEffect } from 'react';
import axios from 'axios';
import '../EventCard.scss';
import '../teacherNavigationPages/eventTecher.scss';
import { useParams, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EventTeacher = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [SavedEvents, setSavedEvents] = useState([]);

    useEffect(() => {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
        }
    }, []);

    let { eventName } = useParams();
    eventName = decodeURIComponent(eventName);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleDownload = async () => {
        try {
            const response = await axios.post('http://localhost:8080/getUsers', {
                EventName: eventName
            });

            const jsonData = response.data;

            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

            saveAs(data, `${eventName}_Users.xlsx`);
        } catch (error) {
            console.error('Error downloading user data:', error);
            alert('Failed to download user data.');
        }
    };

    const handleBack = () => {
        navigate('/teacher');
    };

    if (loading) {
        return (
            <div className="custom-loading">
                <div className="spinner" />
                <p>Loading event details...</p>
            </div>
        );
    }

    if (error) return <div>{error}</div>;
    if (!event) return <div>No event found</div>;

    return (
        <div className="eventCard_wrap">
            <div className="event-card">
                <img
                    src={`https://dummyimage.com/800x300/cccccc/000000&text=${encodeURIComponent(event?.EventName || 'No Name')}`}
                    alt={event?.EventName || 'No Name'}
                    className="event-image"
                />

                <div className="event-details">
                    <h1>{event.EventName}</h1>
                    <p className="host-role">Hosted by: {event.Host_Role}</p>
                    <p className="description">{event.Description}</p>
                    <div className="skills">
                        {event.skills.map((skill, index) => (
                            <span key={index} className="skill">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Buttons Section */}
                <div className='accountSession'>
                        <div className="button-section">
                            <button className="download-btn" onClick={handleDownload}>Download User Data</button>
                            <button className="back-btn" onClick={handleBack}>Back</button>
                        </div>
                </div>

                
            </div>
        </div>
    );
};

export default EventTeacher;

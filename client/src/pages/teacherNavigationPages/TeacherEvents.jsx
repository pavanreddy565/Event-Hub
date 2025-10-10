import React, {useState,useMemo} from 'react'
import '../studentNavgationPages/event.scss'
import { Link } from 'react-router-dom';

function TeacherEvents(props) {
    const [event,setEvent] =useState(props.val)
    const [skills,useSkills]=useState(event.skills);

    
    const skillsSet = useMemo(() => {
      
        return skills&& skills.length > 0 
          ? skills.map((skill, index) => (
              <span key={index} className="skill">{skill}</span>
            ))
          : null;
      }, [skills]);
      const img_ = event.image ? event.image : '../src/assets/image.png';
  return (
    
        <div className="event_container">
           
            <div className="userPost">
                    <div className="userProfile_img">
                        <img src={img_} alt="" />
                    </div>
                    
                    
                    <Link to={`/eventTeacher/${encodeURIComponent(event.EventName)}`} className='profile_info'>
                                <h3 className="companyName">{event.EventName}</h3>
                                <h5 className="role">{event.Host_Role}</h5>
                    </Link>
                           
            </div>
                
            
            <div className="postDescription">{event.Description}</div>
            <div className="learnSkills">{skillsSet}</div>
        </div>
    
  )
}

export default TeacherEvents
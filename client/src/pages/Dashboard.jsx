import React,{useState,useEffect,useMemo, createContext} from 'react'
import './style.css'
import {Routes,Route,Link} from "react-router-dom"
import axios from 'axios';
import { BrowserRouter,NavLink,useLocation} from 'react-router-dom';
import Home from '../pages/studentNavgationPages/Home'
import Applied from '../pages/studentNavgationPages/Applied'
import Explore from '../pages/studentNavgationPages/Explore'
import Deadline from '../pages/studentNavgationPages/Deadline'
import Saved from '../pages/studentNavgationPages/Saved'

export const EventContext =React.createContext();
function Dashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [searchText, setSearch]=useState('');
  const [searchSkills, setSearchSkills] = useState('');
  const [AvaSkills,setAvaSkills] = useState(['React','Machine Learning', 'MERN',"MEAN", "CyberSecurity",'WebDevelopment','UI/UX','Debate','Competative Coding'])
  const location = useLocation();
  const isActive = location.pathname;
  const [events, setEvents] = useState([]);  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getEvent');
      
        if(response.status === 200) {
          setEvents(response.data.events);
          
        }
          
      } catch (error) {
        console.error('Error fetching events:', error);
       
      }
    };

    fetchEvents();
  }, []);

  const filteredSkills = useMemo(() => {
    const searchTerm = searchSkills.toLowerCase();
    return AvaSkills.filter((item) => {
      const ava = item.toLowerCase();
      return searchTerm && ava.startsWith(searchTerm) && ava !== searchTerm;
    });
  }, [searchSkills, AvaSkills]);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  
  
  
  const user_skills =userDetails && userDetails.skills ?userDetails.skills:[]; 
  const [userSkills,setUserSkills]=useState(user_skills);
  const [AppliedEvents,setAppliedEvents]=useState(userDetails && userDetails.AppliedEvents ?userDetails.AppliedEvents:[])
  const [SavedEvents,setSavedEvents]=useState(userDetails && userDetails.SavedEvents?userDetails.SavedEvents:[]);
  
  useEffect(()=>{
    setUserSkills(userDetails && userDetails.skills ?userDetails.skills:[]);
    setAppliedEvents(userDetails && userDetails.AppliedEvents ?userDetails.AppliedEvents:[])
    setSavedEvents(userDetails && userDetails.SavedEvents?userDetails.SavedEvents:[])
  },[userDetails])


  const list_items= useMemo(()=>{
    // console.log(userSkills);
    return userSkills.map((skill,index)=>(
      <div key={index} className='skillName'><a onClick={(e)=>{
        e.preventDefault();
        setUserSkills(prevSkills => prevSkills.filter(value => value !== skill));
      }}>{skill}</a></div>
    ));
  },[userSkills]);
  // console.log(list_items);
  const img_ = userDetails && userDetails.profileImg ? userDetails.profileImg : '../src/assets/image.png';
  if (!userDetails) {
    return <div>Loading...</div>;
  }
  return (
    <div className="sideContainer">
      <div className="dummySide">
      </div>
      <div className="sideBarDesign">
        <div className="sid1"></div>
        <div className="sideBar">
        <div className="sideBarHeading"><h3>Select Your Interests</h3></div>
        <div className="sideSearch">
            <div className="search_bar" >
                <input type="text" placeholder="Add Your Interest..." onChange={(e)=>setSearchSkills(e.target.value)} value={searchSkills}/>
                <a className='a_skill_search' onClick={()=>{
                  const cap =(str)=>{
                    return str
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                  }
                  setUserSkills((userSkills)=>[...userSkills,cap(searchSkills)]);
                  setSearchSkills((searchSkills)=>"");
                }}><i className="fa fa-search"></i></a>
            </div>
            <div className="searchOptions">
              {filteredSkills.map((item) => (
                <div
                  onClick={() => setSearchSkills(item)}
                  className='searchOptionRow'
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>

        </div>
        <div className="interstList">{list_items}</div>
      </div>
        <div className="sid2"></div>
      </div>
      <div className="mainContent">
        <div className="headerContent">
          <div className="wishUser"><h1>Welcome, {userDetails.name}</h1></div>
          <div className="generalUI">
            <div className="searchThings">
                <div className="search_bar">
                      <input type="text" placeholder="Search" onChange={(e)=>setSearch(e.target.value)} value={searchText}/>
                      <i className="fa fa-search"></i>
                  </div>
            </div>
            <div className="notifications">
              <i className="fa fa-bell bell" style={{fontSize: "24px"}}></i>
            </div>
            <div className="userProfile">
              <div className="profile">
              <Link to={'/profile'} ><img src={img_} alt=""/></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="navBarClass">
            <ul>
              <li className={`${isActive==='/dashboard' ?'Active':null}`}><NavLink to='/dashboard' end>Home</NavLink></li>
              <li className={`${isActive==='/dashboard/Explore' ?'Active':null}`}><NavLink to='/dashboard/Explore'>Explore</NavLink></li>
              <li className={`${isActive==='/dashboard/Applied' ?'Active':null}`}><NavLink to='/dashboard/Applied'>Applied</NavLink></li>
              <li className={`${isActive==='/dashboard/Deadline' ?'Active':null}`}><NavLink to='/dashboard/Deadline'>DeadLine</NavLink></li>
              <li className={`${isActive==='/dashboard/Saved' ?'Active':null}`}><NavLink to='/dashboard/Saved'>Saved</NavLink></li>
            </ul>
            
        </div>
        <div className="displayContent">
          <EventContext.Provider value={{events,userSkills,AppliedEvents}}>
            <Routes>
                <Route index element={<Home />} />
                <Route path="Applied" element={<Applied appliedEvent={AppliedEvents}/> } />
                <Route path='Explore' element={<Explore />} />
                <Route path='Deadline' element={<Deadline />} />
                <Route path='Saved' element={<Saved savedEvent={SavedEvents}/>} />
            </Routes>
          </EventContext.Provider>
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard
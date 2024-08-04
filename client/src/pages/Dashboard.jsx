import React,{useState,useEffect} from 'react'
import './style.css'

function Dashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [searchText, setSearch]=useState('');
  const [searchSkills, setSearchSkills] = useState('');

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const img_ = userDetails && userDetails.profileImg ? storedUserDetails.profileImg : '../src/assets/image.png';
  return (
    <div className="sideContainer">
      
      <div className="sideBarDesign">
        <div className="sid1"></div>
        <div className="sideBar">
        <div className="sideBarHeading"><h3>Select Your Interests</h3></div>
        <div className="sideSearch">
            <div class="search_bar">
                <input type="text" placeholder="Add Your Interest..." onChange={(e)=>setSearchSkills(e.target.value)} value={searchSkills}/>
                <i class="fa fa-search"></i>
            </div>
        </div>
        <div className="interstList"></div>
      </div>
        <div className="sid2"></div>
      </div>
      <div className="mainContent">
        <div className="headerContent">
          <div className="wishUser"><h1>Welcome, {userDetails.userName}</h1></div>
          <div className="generalUI">
            <div className="searchThings">
                <div class="search_bar">
                      <input type="text" placeholder="Search" onChange={(e)=>setSearch(e.target.value)} value={searchText}/>
                      <i class="fa fa-search"></i>
                  </div>
            </div>
            <div className="notifications">
              <i className="fa fa-bell bell" style={{fontSize: "24px"}}></i>
            </div>
            <div className="userProfile">
              <div class="profile">
                <img src={img_} alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div className="navBarClass">
            <ul>
              <li>Home</li>
              <li>Explore</li>
              <li>Applied</li>
              <li>DeadLine</li>
              <li>Saved</li>
            </ul>
            
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard
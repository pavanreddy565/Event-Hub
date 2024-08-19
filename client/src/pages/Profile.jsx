import React ,{useState,useEffect,useMemo} from 'react'
import axios from 'axios';
import '../pages/profile.scss'


function Profile() {
    const [userDetails, setUserDetails] = useState(null);
    
    useEffect(() => {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
          setUserDetails(JSON.parse(storedUserDetails));

        }
        
    }, []);
        
    

    const [skills,setSkills]=useState(userDetails&&userDetails.skills?userDetails.skills:[]);
   
    const [isOpen,setIsOpen]=useState(false);
    const [newSkill,setNewSkill]=useState('');
    const [urlLinks,setUrlLinks]=useState(userDetails&&userDetails.profileLinks?Object(userDetails.profileLinks):{})
    const [urlOpen,setUrlOpen]=useState(false);
    const [platform,setPlatform]=useState('');
    const [platLink,setPlatLink]=useState('');
    const [intern,setIntern]=useState(userDetails&&userDetails.internships?userDetails.internships:[]);
    const [internship,setInternship]=useState({company:'',position:'',duration:'',description:"",link:""});
    const [internOpen,setInternOpen]=useState(false);

    useEffect(()=>{
        setSkills(userDetails&&userDetails.skills?userDetails.skills:[]);
        setUrlLinks(userDetails&&userDetails.profileLinks?Object(userDetails.profileLinks):{})
        setIntern(userDetails&&userDetails.internships?userDetails.internships:[]);
    },[userDetails]);
    const skillsSet = useMemo(() => {
      
      return skills.length > 0 
        ? skills.map((skill, index) => (
            <span key={index} className="skill">{skill}</span>
          ))
        : null;
    }, [skills]);
    const urlSet = useMemo(() => {
        return Object.keys(urlLinks).length > 0 
          ? Object.entries(urlLinks).map(([platform, url]) => {
              // Function to check if an icon exists
              const iconExists = (iconName) => {
                // This is a simple check. You might need a more comprehensive list
                const commonIcons = ['facebook', 'twitter', 'linkedin', 'github', 'instagram'];
                return commonIcons.includes(iconName.toLowerCase());
              };
      
              const iconClass = iconExists(platform) 
                ? `fab fa-${platform.toLowerCase()}` 
                : 'fas fa-link';
      
              return (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                  <i className={iconClass}></i>
                  {platform}
                </a>
              );
            })
          : null;
      }, [urlLinks]);
    const internSet = useMemo(() => {
        return intern.length > 0 ? intern.map((internship, index) => (
            <a href={internship.link.length>0?internship.link:null} key={index}  target="_blank">
                <div  className="internship" >
                    <h3>{internship.company}</h3>
                    <p>Position: {internship.position}</p>
                    <p>Duration: {internship.duration}</p>
                    <p>{internship.description}</p>
                </div>
            </a>
        )):null;
    },[intern])
    const img_ = userDetails && userDetails.profileImg ? userDetails.profileImg : '../src/assets/image.png';

    // Adding new skills
    // function addSkill()

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile_wrap">
            <div className="student-profile">
                <div className="profile-header">
                    <div className="profile-content">
                        <div className="profile-image">
                            <img src={img_} alt={userDetails.name} />
                        </div>
                        <div className="profile-info">
                            <h1>{userDetails.name}</h1>
                            <p className="role">{userDetails.role}</p>
                        </div>
            
                    </div>
                </div>
            
                <div className="profile-details">
                    <div className="detail-item">
                        <i className="fas fa-graduation-cap"></i>
                        <p>{userDetails.branch||"-"}</p>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-id-card"></i>
                        <p>{userDetails.userName||"-"}</p>
                    </div>
                    <div className="detail-item">
                        <i className="fas fa-envelope"></i>
                        <p>{userDetails.email||'-'}</p>
                    </div>
                </div>
            
            
            
                <div className="skills-section">
                    <h2 className="section-title">Skills</h2>
                    <div className="skills-container">
                        { skillsSet}
                        <button className="add-skill" onClick={(e) => {
                            e.preventDefault();
                            setIsOpen((isOpen) => !isOpen);
                          }}>
                          + Add Skill
                        </button>
                    </div>
                </div>
                <div className="internships-section">
                        <h2 className="section-title">Internships</h2>
                        {internSet}
            
            
                        <button className="add-skill" onClick={(e) => {
                            e.preventDefault();
                            setInternOpen((isOpen) => !isOpen);
                          }}>
                          + Add Internships Details
                        </button>
            
                </div>
                <div className="skills-section">
                    <h2 className="section-title">ProfileLinks</h2>
                    <div className="profile-links">
                         {urlSet}
                        <button className="add-skill" onClick={(e) => {
                            e.preventDefault();
                            setUrlOpen((isOpen) => !isOpen);
                          }}>
                          + Add URL
                        </button>
                    </div>
                </div>
                <div class="account-settings-section">
                    {/* <h2>Account Settings</h2> */}
                    <div class="change-password">
                        <button class="change-password-btn" >
                            <i class="fas fa-key"></i>
                            Change Password
                        </button>
                        <button onClick={
                            ()=>{
                                const data={...userDetails,['skills']:skills,['profileLinks']:urlLinks,['internships']:intern}
                                axios.post(`http://localhost:8080/update`,data)
                                .then(result=>{
                                    console.log(result);
                                    if (result.status ===200){
                                        localStorage.setItem('userDetails',JSON.stringify(result.data.userDetails));
                                    }
                                })
                            }
                        }>
                        <i class="fas fa-save"></i>
                            Save Changes
                        </button>
                    </div>
                </div>
            
                {userDetails.resume && (
                    <div className="resume-section">
                        <h2 className="section-title">Resume</h2>
                        <a href={userDetails.resume} className="resume-link" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-file-alt"></i>
                            View Resume
                        </a>
                    </div>
                )}
            
                {isOpen && (
                    <div className="popup">
                      <div className="skill_popup">
                        <span className='cross' onClick={()=>{setIsOpen((open)=>!open)}}>x</span>
                        <h3>Add Skill</h3>
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button onClick={() => {
                          if (newSkill.trim()) {  // Only add non-empty skills
                            setSkills(prevSkills => {
                              const cap=(str)=>{
                                return str.charAt(0).toUpperCase() + str.slice(1);
                              }
                              if(!skills.includes(cap(newSkill.trim()))){
                                return [...prevSkills, cap(newSkill.trim())];
                              }
                              return skills
                            });
                            setNewSkill('');  // Clear the input
                            setIsOpen(false);  // Close the popup
                          }
                        }}>Add</button>
                      </div>
                    </div>
                  )}
                {urlOpen && (
                    <div className="popup">
                        <div className="skill_popup" style={{gap:'.9em'}}>
                        <span className='cross' onClick={()=>{setUrlOpen((open)=>!open)}}>x</span>
                        <h3>Add URL</h3>
                        <input
                            type="text"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            placeholder='Enter Platform Name'
                        />
                        <input
                            type="text"
                            value={platLink}
                            onChange={(e) => setPlatLink(e.target.value)}
                            placeholder='Enter URL'
                        />
                        <button onClick={() => {
                            if (platform.trim()&& platLink.length>0) {  // Only add non-empty skills
                                setUrlLinks(prevLinks => {
                                    const cap = (str) => {
                                    return str.charAt(0).toUpperCase() + str.slice(1);
                                    };
                                    const capitalizedPlatform = cap(platform.trim());
                                    if (!(capitalizedPlatform in prevLinks)) {
                                    return {...prevLinks, [capitalizedPlatform]: platLink};
                                    }
                                    return prevLinks;
                            });
                            setPlatform('');
                            setPlatLink('');  // Clear the input
                            setUrlOpen(false);  // Close the popup
                            }
                        }}>Add</button>
                        </div>
                    </div>
                    )}
                {internOpen && (
                    <div className="popup">
                        <div className="internPopup">
                        <span className='cross' onClick={() => setInternOpen(open => !open)}>x</span>
                        <h3>Add Internship Details</h3>
                        <form className="internship-form">
                            <div className="form-group company">
                                <label htmlFor="company">Company:</label>
                                <input
                                type="text"
                                id="company"
                                value={internship.company}
                                onChange={(e) => setInternship(prevIntern => ({...prevIntern, company: e.target.value}))}
                                required
                                />
                            </div>
                            <div className="form-group position">
                                <label htmlFor="position">Position:</label>
                                <input
                                type="text"
                                id="position"
                                required
                                value={internship.position}
                                onChange={(e) => setInternship(prevIntern => ({...prevIntern, position: e.target.value}))}
                                />
                            </div>
                            <div className="form-group duration">
                                <label htmlFor="duration">Duration:</label>
                                <input
                                type="text"
                                id="duration"
                                value={internship.duration}
                                onChange={(e) => setInternship(prevIntern => ({...prevIntern, duration: e.target.value}))}
                                />
                            </div>
                            <div className="form-group description">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                id="description"
                                value={internship.description}
                                onChange={(e) => setInternship(prevIntern => ({...prevIntern, description: e.target.value}))}
                                />
                            </div>
                            <div className="form-group link">
                                <label htmlFor="link">Link:</label>
                                <input
                                type="text"
                                id="link"
                                value={internship.link}
                                onChange={(e) => setInternship(prevIntern => ({...prevIntern, link: e.target.value}))}
                                />
                            </div>
                            </form>
                        <button type="button" onClick={() => {
                            setIntern(prevIntern => {
                                if (internship.company.length > 0 && internship.position.length > 0) {
                                return [...prevIntern, internship];
                                }
                                return prevIntern;
                            });
                            setInternship({company: '', position: '', duration: '', description: "", link: ""});
                            setInternOpen(false);
                            }}>Add Internship</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
            );
        }

export default Profile;
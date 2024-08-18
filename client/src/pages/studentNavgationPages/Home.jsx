import React from 'react'
import { EventContext } from '../Dashboard'
import Event from './Event'
import './home.scss'

function Home() {
  return (
    
      <div className="home">
        <EventContext.Consumer>
        {({ events, userSkills,AppliedEvents }) => {
          const cap =(str)=>{
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
          }
          const filteredAppliedEvents =events
              .filter(event => event.skills.some(skill => userSkills.includes(cap(skill))))
              .filter(event => AppliedEvents.includes(event.EventName))
              .map(event => (
                <Event key={event.id} val={event} applied={true}/>
              ));
          const filteredEvents =events
                    .filter(event => event.skills.some(skill => userSkills.includes(cap(skill))))
                    .filter(event => ! AppliedEvents.includes(event.EventName))
                    .map(event => (
                      <Event key={event.id} val={event} applied={false}/>
                    ));
          //console.log(filteredEvents);
            return [...filteredEvents, ...filteredAppliedEvents]
          }}

       
        </EventContext.Consumer>
      </div>

  )
}

export default Home
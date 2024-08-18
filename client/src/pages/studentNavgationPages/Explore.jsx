import React from 'react'
import { EventContext } from '../Dashboard'
import Event from './Event'
import './home.scss'

function Explore() {
  return (
    <div className="explore">
      <EventContext.Consumer>
      {({ events, userSkills,AppliedEvents }) => {
        
        const filteredAppliedEvents=events
              .filter(event =>  AppliedEvents.includes(event.EventName))
              .map(event => (
                <Event key={event.id} val={event}  applied={true}/>
              ));
        const filteredEvents =events
                  .filter(event => ! AppliedEvents.includes(event.EventName))
                  .map(event => (
                    <Event key={event.id} val={event} applied={false}/>
                  ));
        //console.log(filteredEvents);
          return  [...filteredEvents, ...filteredAppliedEvents]
        }}

    
      </EventContext.Consumer>
    </div>
  )
}

export default Explore
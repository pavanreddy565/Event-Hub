import React, {useState}from 'react'
import { EventContext } from '../Dashboard'
import Event from './Event'
import './home.scss'

function Applied(props) {
  const [AppliedEvents,setAppliedEvents] = useState(props.appliedEvent)
  
  if (AppliedEvents.length==0){
    return (
      <div className="apply"></div>
    )
  }
  return (
    <div className="apply">
      <EventContext.Consumer>
      {({ events }) => {
        
        
        const filteredEvents =events
                    .filter(event => AppliedEvents.includes(event.EventName))
                    
                    .map(event => (
                      <Event key={event.id} val={event} />
                    ));
        //console.log(filteredEvents);
          return filteredEvents
        }}

    
      </EventContext.Consumer>
    </div>
  )
}

export default Applied
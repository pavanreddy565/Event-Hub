import React, {useState}from 'react'
import { EventContext } from '../Dashboard'
import Event from './Event'
import './home.scss'

function Saved(props) {
  const [SavedEvents,setSavedEvents] = useState(props.savedEvent)

  if (SavedEvents.length==0){
    return (
      <div className="save"></div>
    )
  }
  return (
    <div className="save">
      <EventContext.Consumer>
      {({ events }) => {
        
        
        const filteredEvents =events
                    .filter(event => SavedEvents.includes(event.EventName))
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

export default Saved
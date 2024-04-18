import { useDispatch ,useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvent, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers/convertEventsToDateEvents";
import Swal from "sweetalert2";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const {events, activeEvent} = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);



    const setActiveEvent = (calendarEvent) => {
      dispatch( onSetActiveEvent(calendarEvent) );
    }

    const startSavingEvent = async( calendarEvent ) => {

      try {
        if( calendarEvent.id) {
          // actualizado
          await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent );
          dispatch( onUpdateEvent({ ...calendarEvent, user }) );
          return;
        }
          // creandolo
          const { data } = await calendarApi.post('/events', calendarEvent );
          dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user  }) );
        
      } catch (error) {
        console.log(error);
        Swal.fire('Error al guardar', error.response.data.msg, 'error');
        
      }
      
  }

  const startDeletingEvent = async() => {
    // llegar al backend
    try {
      await calendarApi.delete(`/events/${activeEvent.id}` );
      dispatch( onDeleteEvent() );
      
    } catch (error) {
      console.log(error);
      Swal.fire('Error al elminar evento', error.response.data.msg, 'error');
      
    }
  
  }

  const startLoadingEvents = async() => {

    try {

      const { data } = await calendarApi.get('/events');
      const events = convertEventsToDateEvents( data.eventos );
      dispatch( onLoadEvent( events ) );
      
    } catch (error) {
      console.log('Error cargando los eventos');
      console.log(error);
      
    }

  }



  return {

    activeEvent,
    events,
    hasEventSelected: !!activeEvent,

    setActiveEvent,
    startDeletingEvent,
    startLoadingEvents,
    startSavingEvent,
  
  }
}

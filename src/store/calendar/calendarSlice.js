
import { createSlice } from '@reduxjs/toolkit';
// import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(), 
//     title: 'cumpleaños del jefe',
//     notes: 'hay que comprar pan',
//     start: new Date(),
//     end: addHours( new Date(), 2),
//     bgColor: '#fafafa',
//     user: {
//       _id: '123',
//       name: 'Emiliano'
//     }
// }

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
      isLoadigEvents: true,
      events: [
        // tempEvent
      ],
      activeEvent: null
  },
  reducers: {
    onSetActiveEvent: (state, {payload}) => {

        state.activeEvent = payload;
    }, 
    onAddNewEvent: ( state, {payload}) => {
        state.events.push(payload);
        state.activeEvent = null;
    },
    onUpdateEvent: ( state, {payload}) => {
        state.events = state.events.map( event => {
        if (event.id === payload.id ) {
          return payload;
      }

       return event;

      })
    },
    onDeleteEvent: ( state ) => {
      if (state.activeEvent) {
        state.events = state.events.filter( event => event.id !== state.activeEvent.id );
        state.activeEvent = null;
        
      }

    },
    onLoadEvent: ( state, { payload = [] } ) => {
      state.isLoadigEvents = false;
      // state.events = payload;
      payload.forEach( event => {
        const exits = state.events.some( dbEvent => dbEvent.id === event.id );
        if ( !exits ) {
          state.events.push( event )
          
        }

      })

    },

    onLogoutCalendar: (state) => {
      state.isLoadigEvents = true,
      state.events = [],
      state.activeEvent = null
    }

  }

});


// Action creators are generated for each case reducer function
export const { 
  onSetActiveEvent, 
  onAddNewEvent, 
  onUpdateEvent, 
  onDeleteEvent, 
  onLoadEvent,
  onLogoutCalendar,

 } = calendarSlice.actions;
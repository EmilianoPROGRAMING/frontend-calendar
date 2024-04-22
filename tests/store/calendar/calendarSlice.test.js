import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvent, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('probando el calendarSlice', () => { 

    test('debe de regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );
    });

    test('onSetActiveEvent debe de activar el evento', () => {
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );
    });

    test('onAddNewEvent debe de agregar un evento', () => {
        const newEvent = {
            id: '3', 
            start: new Date('2022-04-19 20:30:00'),
            end: new Date('2022-04-19 23:30:00'),
            title: 'cumpleaños del pepe',
            notes: 'notas asi no sirven'
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent(newEvent) );
        expect(state.events).toEqual([ ...events, newEvent ]);
    });

    test('onUpdateEvent debe de actualizar el evento', () => {
        const updateEvent = {
            id: '1', 
            start: new Date('2022-04-19 20:30:00'),
            end: new Date('2022-04-19 23:30:00'),
            title: 'cumpleaños del nose pete',
            notes: 'notas asi no sirven boludo'
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updateEvent) );
        expect(state.events).toContain( updateEvent );

    });

    test('onDeleteEvent debe de eliminar el evento', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventsState, onDeleteEvent() );
        expect(state.activeEvent).toBe( null ); 
        expect(state.events).not.toContain( events[0] );
    });

    test('onLoadEvent debe de cargar el evento', () => {

        const state = calendarSlice.reducer(initialState, onLoadEvent(events) );
        expect(state.isLoadigEvents).toBeFalsy();
        expect(state.events).toEqual(events)

        const newState = calendarSlice.reducer(state, onLoadEvent(events) );
        expect(state.events.length).toBe( events.length );

    })

    test('onLogoutCalendar debe de sacar el evento ', () => {

        const state = calendarSlice.reducer(calendarWithEventsState, onLogoutCalendar() );
        expect(state).toEqual( initialState );
    });


})

export const events = [
    {
        id: '1', 
        start: new Date('2024-04-19 20:30:00'),
        end: new Date('2024-04-19 23:30:00'),
        title: 'cumpleaños del papa',
        notes: 'notas asi'
    },
    {
        id: '2', 
        start: new Date('2024-04-19 20:30:00'),
        end: new Date('2024-04-19 23:30:00'),
        title: 'cumpleaños de la mama',
        notes: 'notas asi pq si'
    },
]

export const initialState = {
      isLoadigEvents: true,
      events: [],
      activeEvent: null
}

export const calendarWithEventsState = {
      isLoadigEvents: false,
      events: [ ...events ],
      activeEvent: null
}

export const calendarWithActiveEventsState = {
    isLoadigEvents: true,
      events: [ ...events ],
      activeEvent: { ...events[0] }
}
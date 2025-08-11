import { fetchAllEventsForDate, Event } from "./event.js";
import { fetchAllRooms } from "./room.js";

export function fetchRoomsWithEvents(fetch_date) {
  if (!fetch_date) // either date or now
    fetch_date = new Date();

  return fetchAllEventsForDate(fetch_date).then(events => {
    const sortedEvents = events.sort((a, b) => {
      return a.time_start - b.time_start;
    });

    return fetchAllRooms().then(rooms => {
      const roomsWithEvents = rooms.map((room) => {
        const roomEvents = [];
        for (let j = 0; j < sortedEvents.length; j++) {
          const currEvent = sortedEvents[j];

          if (currEvent.room_name != room.name)
            continue;

          roomEvents.push(currEvent);
        }

        return {
          room: room,
          events: roomEvents
        };
      });

      return roomsWithEvents;
    })
  });
}


export function fetchAvailable(fetch_date) {
  if (!fetch_date)
    fetch_date = new Date();

  const dayString = fetch_date.toISOString().split('T')[0];

  return fetchRoomsWithEvents(fetch_date).then(roomsWithEvents => {
    const freiraume = [];

    roomsWithEvents.forEach(roomWithEvents => {
      const { room, events } = roomWithEvents;
      const slots = [];

      let startOfSpan = fetch_date;
      startOfSpan.setHours(8, 0, 0, 0);

      let endOfDay = fetch_date;
      endOfDay.setHours(23, 59, 59, 999);

      for (let i = 0; i <= events.length; i++) { // for each event
        let diff = 0;
        let freiraum_end = new Date();

        if (i < events.length) { // if this is not the end of day
          diff = events[i].time_start - startOfSpan; // subtract previous end from current start
          freiraum_end = events[i].time_start; // the end of the freiraum is the start of the event
        } else { // ... otherwise
          diff = endOfDay - startOfSpan; // subtract previous end from the end of the day
          freiraum_end = endOfDay; // the end of the freiraum is the end of the day
        }

        if (diff > 1800000) { // if there are atleast 30 mins, in which the room is not occupied
          // mark it as a freiraum
          const freiraum = new Event("Freiraum", room.name, "Freiraum", startOfSpan, freiraum_end, dayString);
          slots.push(freiraum);
        }

        if (i < events.length) { // if this is not the end of the day
          startOfSpan = events[i].time_end; // the start of the next freiraum is the end of the current event
        }
      }

      freiraume.push({
        room: room,
        events: slots
      });
    });

    return freiraume;
  });
}


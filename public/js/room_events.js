import { fetchAllEventsForDate, Event } from "./event.js";
import { fetchAllRooms } from "./room.js";
import { FREIRAUM_NAME } from "./utils.js";

export async function fetchRoomsWithEvents(fetch_date) {
  if (!fetch_date) // either date or now
    fetch_date = new Date();

  const events = await fetchAllEventsForDate(fetch_date);

  const sortedEvents = events.sort((a, b) => {
    return a.time_start.getTime() - b.time_start.getTime();
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
}

export async function fetchRoomsWithOccupancy(fetch_date) {
  if (!fetch_date)
    fetch_date = new Date();

  const roomsWithEvents = await fetchRoomsWithEvents(fetch_date);

  const roomsWithOccupancy = [];

  roomsWithEvents.forEach(roomWithEvents => {
    const { room, events } = roomWithEvents;
    const slots = [];

    let startOfSpan = fetch_date;
    startOfSpan = new Date(startOfSpan.setHours(8, 0, 0, 0));

    let endOfDay = fetch_date;
    endOfDay.setHours(23, 59, 59, 999);

    for (let i = 0; i < events.length; i++) { // for each event
      let diff = 0;
      let freiraum_end = new Date();

      diff = events[i].time_start.getTime() - startOfSpan.getTime(); // subtract previous end from current start
      freiraum_end = events[i].time_start; // the end of the freiraum is the start of the event

      if (diff > 1800000) { // if there are atleast 30 mins, in which the room is not occupied
        // mark it as a freiraum
        const freiraum = new Event(FREIRAUM_NAME, room.name, FREIRAUM_NAME, startOfSpan, freiraum_end);
        slots.push(freiraum);
      }

      // push event as well
      slots.push(events[i]);

      startOfSpan = events[i].time_end; // the start of the next freiraum is the end of the current event
    }

    if (endOfDay.getTime() - startOfSpan.getTime() > 1800000) { // if there are atleast 30 mins, in which the room is not occupied
      // mark it as a freiraum
      const freiraum = new Event("Freiraum", room.name, "Freiraum", startOfSpan, endOfDay);
      slots.push(freiraum);
    }

    roomsWithOccupancy.push({
      room: room,
      events: slots
    });
  });

  return roomsWithOccupancy;
}

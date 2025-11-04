const TIMELINE_CONTAINER_CLASS = 'timeline_container';
const TIMELINE_CLASS = 'timeline';
const TIME_CLASS = 'time';
const ROOM_CLASS = 'room';
const EVENT_GROUP_CLASS = 'event-group';
const EVENT_CLASS = 'event';
const FREIRAUM_CLASS = 'freiraum';
const MARQUEE_CLASS = 'marquee';

const INDICATOR_ID = 'indicator';

export class TimelineUI {
  hour_offset = 8;
  hour_width = 101;

  display(roomsWithEvents) {
    const timeline = document.createElement('table');
    timeline.classList.add(TIMELINE_CLASS);

    const timeline_body = document.createElement('tbody');

    const timeline_header_row = document.createElement('tr');
    const thr_name = document.createElement('th');
    thr_name.innerText = 'Raum';
    timeline_header_row.appendChild(thr_name);

    for (let i = this.hour_offset; i < 24; i++) {
      const thr_time = document.createElement('th');
      thr_time.classList.add(TIME_CLASS);
      thr_time.dataset.time = String(i);
      thr_time.innerText = `${String(i).padStart(2, '0')}:00`;
      timeline_header_row.appendChild(thr_time);
    }

    timeline_body.appendChild(timeline_header_row);
    timeline.appendChild(timeline_body);

    roomsWithEvents.forEach(roomWithEvents => {
      const { room, events } = roomWithEvents;

      const tr_room_events = document.createElement('tr');
      const td_room = document.createElement('td');
      td_room.classList.add(ROOM_CLASS);
      td_room.title = `Plätze: ${room.number_of_seats}\n${room.comments}`;
      td_room.innerText = room.name;
      tr_room_events.appendChild(td_room);

      // add events
      const trr_events_div = document.createElement('td');
      trr_events_div.classList.add(EVENT_GROUP_CLASS);
      events.forEach(e => {
        const div_event = document.createElement('div');
        div_event.classList.add(EVENT_CLASS);
        div_event.classList.toggle(FREIRAUM_CLASS, e.name == "Freiraum");

        const time_factor_start = (e.time_start.getHours() - this.hour_offset) + (e.time_start.getMinutes() / 60);
        const time_factor_end = (e.time_end.getHours() - this.hour_offset) + e.time_end.getMinutes() / 60;
        const time_factor_span = time_factor_end - time_factor_start;

        div_event.title = `${e.name}\n${e.time_start}\n${e.time_end}`;
        div_event.style = `left: ${this.hour_width * time_factor_start}px; width: ${this.hour_width * time_factor_span}px;`;

        const event_span = document.createElement('span');
        event_span.innerText = e.name;
        div_event.appendChild(event_span);

        trr_events_div.appendChild(div_event);
      });
      tr_room_events.appendChild(trr_events_div);

      timeline_body.appendChild(tr_room_events);
    });

    let indicator = document.createElement('div');
    indicator.id = INDICATOR_ID;

    let table_container = document.createElement('div');
    table_container.classList.add(TIMELINE_CONTAINER_CLASS);
    table_container.appendChild(indicator);
    table_container.appendChild(timeline);

    // time pos
    timeline.addEventListener("scroll", () => {
      // time pos
      let time_x_pos = this.hour_width * ((new Date()).getHours() - this.hour_offset);

      // scroll to current time
      let timeline = document.getElementsByClassName(TIMELINE_CLASS)[0];
      let curr_left = timeline.scrollLeft;

      // update indicator
      indicator.style.transform = `translateX(${time_x_pos - curr_left + this.hour_width}px)`;
    });

    return table_container;
  }

}

export function loop() {
  const events = document.getElementsByClassName(EVENT_CLASS);
  Array.from(events).forEach((event) => {
    const span = event.childNodes[0];
    console.log(span.clientWidth, event.clientWidth);
    span.classList.toggle(MARQUEE_CLASS, span.clientWidth - event.clientWidth > 0);
  });
}

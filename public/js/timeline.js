import { popup_show } from '/js/popup.js';

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

const TIMELINE_CONTAINER_CLASS = 'timeline_container';
const TIMELINE_CLASS = 'timeline';
const TIME_CLASS = 'time';
const ROOM_CLASS = 'room';
const EVENT_GROUP_CLASS = 'event-group';
const EVENT_CLASS = 'event';
const FREIRAUM_CLASS = 'freiraum';

const INDICATOR_ID = 'indicator';

const HOUR_OFFSET = 8;
const HOUR_WIDTH = 101;

export class TimelineUI {
  display(roomsWithEvents) {
    const timeline = document.createElement('table');
    timeline.classList.add(TIMELINE_CLASS);

    const timeline_header = document.createElement('thead');

    const timeline_header_row = document.createElement('tr');
    const thr_name = document.createElement('th');
    thr_name.innerText = 'Raum';
    timeline_header_row.appendChild(thr_name);

    for (let i = HOUR_OFFSET; i < 24; i++) {
      const thr_time = document.createElement('th');
      thr_time.classList.add(TIME_CLASS);
      thr_time.dataset.time = String(i);
      thr_time.innerText = `${String(i).padStart(2, '0')}:00`;
      timeline_header_row.appendChild(thr_time);
    }

    timeline_header.appendChild(timeline_header_row);
    timeline.appendChild(timeline_header);

    const timeline_body = document.createElement('tbody');
    timeline.appendChild(timeline_body);

    roomsWithEvents.forEach(roomWithEvents => {
      const { room, events } = roomWithEvents;

      const tr_room_events = document.createElement('tr');
      const td_room = document.createElement('td');
      td_room.classList.add(ROOM_CLASS);
      td_room.title = `${room.room_type ? room.room_type + ' ' : ''}\nPlätze: ${room.number_of_seats}\n${room.comments}`;
      td_room.addEventListener('click', (ev) => {
        ev.stopPropagation();
        popup_show(`
          <h4 class="room_id">${room.room_type ? room.room_type + ' ' : ''}</h4>
          <h3>${room.name}</h3>
          <p>Plätze: ${room.number_of_seats}</p>
          <p>${room.comments}</p>
        `);
      });
      td_room.innerText = room.name;
      tr_room_events.appendChild(td_room);

      // add events
      const trr_events_div = document.createElement('td');
      trr_events_div.classList.add(EVENT_GROUP_CLASS);
      events.forEach(e => {
        const div_event = document.createElement('div');
        div_event.classList.add(EVENT_CLASS);
        div_event.classList.toggle(FREIRAUM_CLASS, e.name == "Freiraum");

        const time_factor_start = (e.time_start.getHours() - HOUR_OFFSET) + (e.time_start.getMinutes() / 60);
        const time_factor_end = (e.time_end.getHours() - HOUR_OFFSET) + e.time_end.getMinutes() / 60;
        const time_factor_span = time_factor_end - time_factor_start;

        div_event.title = `${e.name}${e.person ? " - " + e.person : ""}\n${e.time_start}\n${e.time_end}`;
        div_event.style = `left: ${HOUR_WIDTH * time_factor_start}px; width: ${HOUR_WIDTH * time_factor_span}px;`;

        const event_span = document.createElement('span');
        event_span.innerText = e.name;
        div_event.appendChild(event_span);

        div_event.addEventListener('click', (ev) => {
          ev.stopPropagation();
          popup_show(`
            <h4 class="room_id">${room.name}</h4>
            <h3>${e.name}${e.department ? " - " + e.department : ""}</h3>
            <p>${WEEKDAYS[e.time_start.getDay()]} ${("" + e.time_start.getHours()).padStart(2, "0")}:${("" + e.time_start.getMinutes()).padStart(2, "0")} - ${("" + e.time_end.getHours()).padStart(2, "0")}:${("" + e.time_start.getMinutes()).padStart(2, "0")}</p>
            ${e.person ? "<small>Gebucht auf " + e.person + "</small>" : ""}
          `, ev);
        });

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
    update_indicator();
    setInterval(() => update_indicator(), 1000);

    return table_container;
  }
}

export function update_indicator() {
  // first column
  let first_column = document.querySelector('table.timeline > tbody > tr > :first-child');

  if (!first_column) {
    return;
  }

  // time pos
  let now = new Date();
  let time_x_pos = HOUR_WIDTH * (now.getHours() - HOUR_OFFSET) + now.getMinutes() * (HOUR_WIDTH / 60);
  let FIRST_COLUMN_WIDTH = first_column.getBoundingClientRect().width;

  // scroll to current time
  let timeline = document.getElementsByClassName(TIMELINE_CLASS)[0];
  if (!timeline) return;

  // update indicator
  const indicator = document.getElementById(INDICATOR_ID);
  indicator.style.transform = `translateX(${time_x_pos + FIRST_COLUMN_WIDTH}px)`;
  indicator.style.height = `${timeline.getBoundingClientRect().height}px`;
}

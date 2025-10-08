export class TimelineUI {

  constructor() {
    this.hour_offset = 8;
    this.hour_width = 101;
  }

  display(roomsWithEvents) {
    const timeline = document.createElement('table');
    timeline.classList.add('timeline');

    const timeline_body = document.createElement('tbody');

    const timeline_header_row = document.createElement('tr');
    const thr_name = document.createElement('th');
    thr_name.innerText = 'Raum';
    timeline_header_row.appendChild(thr_name);

    for (let i = this.hour_offset; i < 24; i++) {
      const thr_time = document.createElement('th');
      thr_time.classList.add('time');
      thr_time.dataset.time = i;
      thr_time.innerText = `${String(i).padStart(2, '0')}:00`;
      timeline_header_row.appendChild(thr_time);
    }

    timeline_body.appendChild(timeline_header_row);
    timeline.appendChild(timeline_body);

    roomsWithEvents.forEach(roomWithEvents => {
      const { room, events } = roomWithEvents;

      const tr_room_events = document.createElement('tr');
      const td_room = document.createElement('td');
      td_room.classList.add('room');
      td_room.innerText = room.name;
      tr_room_events.appendChild(td_room);

      // add events
      const trr_events_div = document.createElement('td');
      trr_events_div.classList.add('event-group');
      events.forEach(e => {
        const div_event = document.createElement('div');
        div_event.classList.add('event');

        const time_factor_start = (e.time_start.getHours() - this.hour_offset) + (e.time_start.getMinutes() / 60);
        const time_factor_end = (e.time_end.getHours() - this.hour_offset) + e.time_end.getMinutes() / 60;
        const time_factor_span = time_factor_end - time_factor_start;
        div_event.innerText = e.name;
        div_event.title = `${e.name}\n${e.time_start}\n${e.time_end}`;
        div_event.style = `left: ${this.hour_width * time_factor_start}px; width: ${this.hour_width * time_factor_span}px`;

        trr_events_div.appendChild(div_event);
      });
      tr_room_events.appendChild(trr_events_div);

      timeline_body.appendChild(tr_room_events);
    });

    let indicator = document.createElement('div');
    indicator.id = "indicator";

    let table_container = document.createElement('div');
    table_container.classList.add('timeline_container');
    table_container.appendChild(indicator);
    table_container.appendChild(timeline);

    // time pos
    timeline.addEventListener("scroll", () => {
      // time pos
      let time_x_pos = this.hour_width * ((new Date()).getHours() - this.hour_offset);

      // scroll to current time
      let timeline = document.getElementsByClassName("timeline")[0];
      let curr_left = timeline.scrollLeft;

      // update indicator
      let indicator = document.getElementById("indicator");
      indicator.style.transform = `translateX(${time_x_pos - curr_left + this.hour_width}px)`;
    });

    return table_container;
  }
}

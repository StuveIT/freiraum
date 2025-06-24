import { fetchXML } from "/js/fetcher.js";

export class Event {
  constructor(name, room_name, subject, time_start, time_end, dayString) {
    this.name = name;
    this.room_name = room_name;
    this.subject = subject;
    this.time_start = dateFromTime(time_start, dayString);
    this.time_end = dateFromTime(time_end, dayString);

    this.duration = this.time_end - this.time_start;
  }

  toHTML() {
    return `${this.name} (${this.time_start} &mdash; ${this.time_end})`;
  }
}

function dateFromTime(timeString, dayString) {
  return new Date(`${dayString} ${timeString}:00`)
}

function eventMap(properties, namespaces, dayString) {
  // Define namespaces
  const dNS = namespaces.data;

  const Veranstaltung = properties.getElementsByTagNameNS(dNS, 'Veranstaltung')[0];
  // const Dauer = properties.getElementsByTagNameNS(dNS, 'Dauer')[0];
  const Raum = properties.getElementsByTagNameNS(dNS, 'Raum')[0];
  const Betreff = properties.getElementsByTagNameNS(dNS, 'Betreff')[0];
  const AUhrzeit = properties.getElementsByTagNameNS(dNS, 'AUhrzeit')[0];
  const BUhrzeit = properties.getElementsByTagNameNS(dNS, 'BUhrzeit')[0];

  // Store extracted data in an object
  return new Event(
    Veranstaltung ? Veranstaltung.textContent : null,
    // Dauer ? Dauer.textContent : null,
    Raum ? Raum.textContent : null,
    Betreff ? Betreff.textContent : null,
    AUhrzeit ? AUhrzeit.textContent : null,
    BUhrzeit ? BUhrzeit.textContent : null,
    dayString
  );
}

export function fetchAllEventsForDate(date) {
  const dayString = date.toISOString().split('T')[0];

  const url = `http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllEvents()?$filter=(TDate%20eq%20datetime%27${dayString}%27)`;

  return fetchXML(url, (properties, namespaces) => eventMap(properties, namespaces, dayString));
}

export function fetchCurrentEvents() {
  // Create a new Date object representing the current date
  const currentDate = new Date();
  const dayString = currentDate.toISOString().split('T')[0];
  const hourString = currentDate.getHours().toString();
  const minuteString = currentDate.getMinutes().toString();
  const timeString = hourString.concat(minuteString);

  const url = `http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllEvents()?$filter=(TDate%20eq%20datetime%27${dayString}%27)%20and%20Btime%20gt%20${timeString}%20and%20Atime%20lt%20${timeString}&$orderby%20=%20TDate,AUhrzeit,BUhrzeit`;

  return fetchXML(url, eventMap);
}

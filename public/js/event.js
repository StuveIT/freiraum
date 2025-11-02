import { fetchXML } from "./fetcher.js";
import { dateFromTime } from "./utils.js";

export class Event {
  constructor(name, room_name, subject, time_start, time_end) {
    this.name = name;
    this.room_name = room_name;
    this.subject = subject;
    this.time_start = time_start;
    this.time_end = time_end;

    this.duration = this.time_end.getTime() - this.time_start.getTime();
  }

  toHTML() {
    return `${this.name} (${this.time_start} &mdash; ${this.time_end})`;
  }
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

  if (Veranstaltung && Veranstaltung.textContent &&
    Raum && Raum.textContent &&
    Betreff && Betreff.textContent &&
    AUhrzeit && AUhrzeit.textContent &&
    BUhrzeit && BUhrzeit.textContent)
    // Store extracted data in an object
    return new Event(
      Veranstaltung.textContent,
      Raum.textContent,
      Betreff.textContent,
      dateFromTime(dayString, AUhrzeit.textContent),
      dateFromTime(dayString, BUhrzeit.textContent),
    );
  else
    throw Error("Could not parse Event");
}

export function fetchAllEventsForDate(date) {
  const dayString = date.toISOString().split('T')[0];

  const url = `http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllEvents()?$filter=(TDate%20eq%20datetime%27${dayString}%27)`;

  return fetchXML(url, (properties, namespaces) => eventMap(properties, namespaces, dayString));
}

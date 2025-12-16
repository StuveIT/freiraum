import { fetchXML } from "./fetcher.js";
import { dateFromTime } from "./utils.js";

export class Event {
  constructor(name, room_name, subject, time_start, time_end, person, department) {
    this.name = name;
    this.room_name = room_name;
    this.subject = subject;
    this.time_start = time_start;
    this.time_end = time_end;
    this.person = person;
    this.department = department;

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
  const Anforderer = properties.getElementsByTagNameNS(dNS, 'Anforderer')[0];
  const Einheit = properties.getElementsByTagNameNS(dNS, 'Einheit')[0];

  return new Event(
    Veranstaltung ? Veranstaltung.textContent : null,
    Raum ? Raum.textContent : null,
    Betreff ? Betreff.textContent : null,
    AUhrzeit ? dateFromTime(dayString, AUhrzeit.textContent) : null,
    BUhrzeit ? dateFromTime(dayString, BUhrzeit.textContent) : null,
    Anforderer ? Anforderer.textContent : null,
    Einheit ? Einheit.textContent : null
  );
}

export async function fetchAllEventsForDate(date) {
  const dayString = date.toISOString().split('T')[0];

  const overall_url = `http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllEvents()?$filter=(TDate%20eq%20datetime%27${dayString}%27)`;
  const bib_url = `http://134.34.26.182/roomresbib/WcfDataService.svc/GetAllEvents()?$filter=(TDate%20eq%20datetime%27${dayString}%27)`;

  const overall_xml = await fetchXML(overall_url, (properties, namespaces) => eventMap(properties, namespaces, dayString));
  const bib_xml = await fetchXML(bib_url, (properties, namespaces) => eventMap(properties, namespaces, dayString));

  return overall_xml.concat(bib_xml);
}

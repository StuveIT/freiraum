import { fetchXML } from './fetcher.js';

const BLACKLIST = ["BA420", "BA439a", "BA439b", "BA440", "BS522"];

export class Room {
  constructor(id, name, building, room_no, room_code, comments, number_of_seats, room_type) {
    this.id = id;
    this.name = name;
    this.building = building;
    this.room_no = room_no;
    this.room_code = room_code;
    this.comments = comments;
    this.number_of_seats = number_of_seats;
    this.room_type = room_type;
  }
}


export async function fetchAllRooms() {
  const map_to_room = (properties, namespaces) => {
    // Define namespaces
    const dNS = namespaces.data;

    const ResRaumID = properties.getElementsByTagNameNS(dNS, "Veranstaltung")[0];
    const Geb = properties.getElementsByTagNameNS(dNS, "Geb")[0];
    const Raum = properties.getElementsByTagNameNS(dNS, "Raum")[0];
    const Raumnr = properties.getElementsByTagNameNS(dNS, "Raumnr")[0];
    const Raumcode = properties.getElementsByTagNameNS(dNS, "Raumcode")[0];
    const Anmerkungen = properties.getElementsByTagNameNS(dNS, "Anmerkungen")[0];
    const Platzanzahl = properties.getElementsByTagNameNS(dNS, "Platzanzahl")[0];
    const Bezeichnung = properties.getElementsByTagNameNS(dNS, "Bezeichnung")[0];

    // Store extracted data in an object
    return new Room(
      ResRaumID ? ResRaumID.textContent : null,
      Raum ? Raum.textContent : null,
      Geb ? Geb.textContent : null,
      Raumnr ? parseInt(Raumnr.textContent) : null,
      Raumcode ? Raumcode.textContent : null,
      Anmerkungen ? Anmerkungen.textContent : null,
      Platzanzahl ? parseInt(Platzanzahl.textContent) : null,
      Bezeichnung ? Bezeichnung.textContent : null
    );
  };

  const regular_xml = await fetchXML("http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllRooms()?$orderby%20=%20Raum", map_to_room);
  const bib_xml = await fetchXML("http://134.34.26.182/roomresbib/WcfDataService.svc/GetAllRooms()?$orderby%20=%20Raum", map_to_room);

  let overall_xml = regular_xml.concat(bib_xml).sort((a, b) => a.name.localeCompare(b.name)).filter((room) => !BLACKLIST.includes(room.name));

  return overall_xml;
}

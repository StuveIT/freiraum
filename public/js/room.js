import { fetchXML } from '/js/fetcher.js';

export class Room {
  constructor(id, name, building, room_no, room_code, comments) {
    this.id = id;
    this.name = name;
    this.building = building;
    this.room_no = room_no;
    this.room_code = room_code;
    this.comments = comments;
  }

  toHTML() {
    return `<div class="room">
                    <h3>${this.name}</h3>
                    <p>Gebäude: ${this.building}</p>
                    <p>Raumnummer: ${this.room_no}</p>
                    <p>Raum Code: ${this.room_code}</p>
                    <p>Anmerkungen: ${this.comments}</p>
                </div>`;
  }
}

export function fetchAllRooms() {
  return fetchXML("http://134.34.26.182/TestRRM/WcfDataService.svc/GetAllRooms()?$orderby%20=%20Raum", (properties, namespaces) => {
    // Define namespaces
    const dNS = namespaces.data;

    const ResRaumID = properties.getElementsByTagNameNS(dNS, "Veranstaltung")[0];
    const Geb = properties.getElementsByTagNameNS(dNS, "Geb")[0];
    const Raum = properties.getElementsByTagNameNS(dNS, "Raum")[0];
    const Raumnr = properties.getElementsByTagNameNS(dNS, "Raumnr")[0];
    const Raumcode = properties.getElementsByTagNameNS(dNS, "Raumcode")[0];
    const Anmerkungen = properties.getElementsByTagNameNS(dNS, "Anmerkungen")[0];

    // Store extracted data in an object
    return new Room(
      ResRaumID ? ResRaumID.textContent : null,
      Raum ? Raum.textContent : null,
      Geb ? Geb.textContent : null,
      Raumnr ? Raumnr.textContent : null,
      Raumcode ? Raumcode.textContent : null,
      Anmerkungen ? Anmerkungen.textContent : null
    );
  });
}
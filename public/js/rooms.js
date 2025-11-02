const ROOMS_UI_CLASS = 'rooms_ui';
const BUILDING_CLASS = 'building';
const ROOM_CLASS = 'room';

const BUILDING_ID_PREFIX = 'building_';

export class RoomsUI {
  constructor() {

  }

  display(roomsWithEvents) {
    const rooms_elem = document.createElement('div');
    rooms_elem.classList.add(ROOMS_UI_CLASS);

    // SORT BY name and building
    roomsWithEvents.sort((a, b) => a.room.name.localeCompare(b.room.name));
    roomsWithEvents.sort((a, b) => a.room.building.localeCompare(b.room.building));

    // CREATE new building
    const createBuildingElement = (building) => {
      const building_elem = document.createElement('div');
      const building_summary = document.createElement('h1');
      building_summary.innerText = building;
      building_elem.appendChild(building_summary);

      building_elem.classList.add(BUILDING_CLASS);
      building_elem.id = BUILDING_ID_PREFIX + building;

      return building_elem;
    };

    let latestBuilding;
    roomsWithEvents.forEach((roomWithEvents) => {
      const { room, events } = roomWithEvents;
      const building_id = BUILDING_ID_PREFIX + room.building;

      // FIRST BUILDING
      if (!latestBuilding) {
        latestBuilding = createBuildingElement(room.building);
      }

      // NEW BUILDING
      if (latestBuilding.id != building_id) {
        rooms_elem.appendChild(latestBuilding);
        latestBuilding = createBuildingElement(room.building);
      }

      // CHECK for events
      const now = new Date();
      const occupancy = events.find((event) => event.time_start < now < event.time_end);

      // ADD ROOM
      const room_elem = document.createElement('div');
      room_elem.classList.add(ROOM_CLASS);
      room_elem.innerHTML = `
        <h2>${room.name}</h2>
        <table>
          <tr>
            <td><b>Akuell:</b></td>
            <td>${occupancy.name}</td>
          </tr>
          <tr>
            <td><b>Sitzplätze:</b></td>
            <td>${room.number_of_seats}</td>
          </tr>
          <tr>
            <td colspan="2">${room.comments}</td>
          </tr>
        </table>
      `;

      latestBuilding.appendChild(room_elem);
    });

    return rooms_elem;
  }
}

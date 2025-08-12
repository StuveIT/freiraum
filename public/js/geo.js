const MAX_BUILDING_CAPACITY = 1138; // magic number for A

export class GeoUI {
  initialize() {
    let map_container = document.createElement("div");
    map_container.id = "map";

    return map_container;
  }

  async display(roomsWithEvents) {
    let map = L.map('map').setView([47.689749, 9.187857], 17);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    }).addTo(map);

    let geojson = await fetch('/geojson/uni_konstanz.geojson', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());

    let buildings = {};
    roomsWithEvents.forEach(roomWithEvents => {
      const { room, events } = roomWithEvents;

      let now = new Date();
      if (events.filter(event => (event.time_start > now || event.time_end < now) && event.name == "Freiraum").length == 0) {
        if (!buildings[room.building]) // if the building is not in the map yet...
          buildings[room.building] = { // create the required object
            vacant_seats: 0,
            vacant_rooms: [],
          }

        buildings[room.building].vacant_seats += Number(room.number_of_seats); // increment vacant seats
        buildings[room.building].vacant_rooms.push(room); // push vacant room
      }
    });

    L.geoJson(geojson, {
      style: function(feature) {
        let building_name = feature.properties.name;
        building_name = building_name ? building_name.split(' ')[0] : "";
        let building_vacancies = buildings[building_name];

        return { color: `rgba(18, 174, 225,${building_vacancies ? building_vacancies.vacant_seats / MAX_BUILDING_CAPACITY : 0})` };
      }
    }).addTo(map);
  }
}

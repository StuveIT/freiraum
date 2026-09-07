# Freiraum
Freiraum is a local room availability tool for the University of Konstanz, made by students for students.

## Setup
### Docker
The easiest way to run Freiraum, is to use docker compose:
```
docker compose up -d
```
- `-d`: will start the container in detached mode

The project is built and served via an apache web server on port 8097.

### npm
Alternatively install nodejs directly on your system and run:
- `npm i` in the root directory of the project to install all dependencies
- `npm run dev` to start the project in the development environment
- `npm run build` to build the project and get a static website in the `dist` directory

### Nix
For those working with nix, a `flake.nix` is provided for development purposes. Run `nix develop` to enter the development shell.

## Structure
Most of the logic resides in seperate javascript files in [public/js/](public/js/). All is consolidated in the [Freiraum.astro](src/components/Freiraum.astro) file.

### Core Logic
- [event.js](public/js/event.js): holds the **Event** class as well as the `fetchAllEventsForDate` function for events
- [room.js](public/js/room.js): holds the **Room** class as well as the `fetchAllRooms` function for rooms
- [room_events.js](public/js/room_events.js): holds consolidated `fetchRoomsWithEvents` and `fetchRoomsWithOccupancy` functions for rooms with their respective events

### Utility
- [fetcher.js](public/js/fetcher.js): holds the general `fetchXML` function that is used to fetch the remote XML data
- [utils.js](public/js/utils.js): holds all other general utility functions and constants.

### UI
- [timeline.js](public/js/timeline.js): holds the **TimelineUI** class which is the main view of room events on a given date (the standard view when opening the application)
- [rooms.js](public/js/rooms.js): holds the **RoomsUI** class which is the "Räume" tab on in the application
- [geo.js](public/js/geo.js) *(discontinued)*: holds the GeoUI class to display room data on a [leaflet](https://leafletjs.com/) map

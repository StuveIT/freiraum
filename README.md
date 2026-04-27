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

### NPM
Alternatively install nodejs directly on your system and run:
- `npm i` in the root directory of the project to install all dependencies
- `npm run dev` to start the project in the development environment
- `npm run build` to build the project and get a static website in the `dist` directory

### Nix
For those working with nix, a `flake.nix` is provided for development purposes. Run `nix develop` to enter the development shell.

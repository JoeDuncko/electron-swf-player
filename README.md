# ABANDONED, DO NOT USE

Instead, I suggest trying [ruffle, the Flash Player emulator](https://ruffle.rs/demo/) instead.

# electron-swf-player

A simple, modern Adobe Flash .swf player built on Electron.

It uses [PepperFlashPlayer](https://wiki.debian.org/PepperFlashPlayer), the Flash player Chrome used to use, under the hood.

## Installing

- Download the correct version of the app for your platform from [the Releases page](https://github.com/JoeDuncko/electron-swf-player/releases).

Currently only tested on Intel Macs and Windows 10. Builds for other platforms coming soon.

## Developing

Install `node.js`, probably via your package manager.

- `npm install`
- `npm start`

## Building

### Generating icons

- `npm run generate-icons`

Currently all platforms use the macOS icon.

### MacOS

- Be on a Mac
- `npm run make`

### Windows

- Be on a PC
- `npm run make`

### Linux

TBD

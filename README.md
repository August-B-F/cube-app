# Cube App

Electron desktop app for the artist Alberto Frigo. His work is organized as an 8x8x8 meter cube in the Alps, where each project has a code. This app decodes those codes and opens the matching file from a content folder.

![Cube Preview](assets/cube-app-gif.gif)

You enter a project code on a grid. The app looks for a file with that name and any of the supported extensions (`.txt`, `.pdf`, `.mp3`, `.mp4`, `.jpg`, `.png`, `.html`) and displays it inline. Text and HTML are read directly; PDF, audio, video and images open in a built-in viewer. Each project also has an explanation text in `assets/explanations/` (English) and `assets/explanations_it/` (Italian).

UI is English or Italian. Viewed projects are kept in a history list. Runs fullscreen. Tested on Windows and Linux.

## Run

```bash
npm install
npm start
```

Projects load from `/home/user/` by default. Change the `contentFolder` value in `src/js/App.js` to point elsewhere.

Build installers:

```bash
npm run build
```

## License

Educational and non-commercial use. Fork and adapt as you like, but keep attribution to Alberto Frigo.

Contact: august.frigo@gmail.com

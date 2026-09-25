# AI Background Remover

A polished React application for removing backgrounds from uploaded images using a backend AI service. The app lets users upload an image, adjust output quality, run the background-removal process, preview the result, and download the processed image.

## Overview

This project is a lightweight frontend built with React and TypeScript. It connects to a local backend API and provides a simple workflow for image background removal without requiring a complex UI.

## Features

- Drag-and-drop image upload
- Select an image from the local device
- Health check to verify backend connectivity
- Background removal request to the AI processing API
- Adjustable output quality/size slider
- Original and processed image preview
- Download the cleaned image as a PNG
- Clear error messages for invalid input or failed requests

## Tech Stack

- React
- TypeScript
- Create React App
- Fetch API

## How It Works

1. The user uploads or drops an image in the upload area.
2. The image is previewed in the app.
3. The user sets the desired output quality.
4. The app sends the file to the backend endpoint `/remove-bg`.
5. The processed image is displayed and can be downloaded.

## Project Structure

- `src/App.tsx` — main UI and API logic
- `src/App.css` — styling and layout
- `src/index.tsx` — app bootstrap
- `public/` — static assets

## Prerequisites

Before running the app, make sure you have:

- Node.js and npm installed
- A backend service running locally on port 5000

The frontend includes a proxy in `package.json`:

```json
"proxy": "http://localhost:5000"
```

## Required Backend Endpoints

The app expects these endpoints:

- `GET /health` — verifies the API is available
- `POST /remove-bg` — accepts an uploaded image and returns the processed output

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the backend service on port 5000.

3. Run the frontend:

```bash
npm start
```

4. Open the app in the browser:

```text
http://localhost:3000
```

## Usage

1. Click the upload area or drag an image into it.
2. Adjust the quality slider if needed.
3. Click “Remove Background”.
4. Review the processed image.
5. Download the final result.

## Available Scripts

```bash
npm start
```
Runs the app in development mode.

```bash
npm test
```
Runs the test watcher.

```bash
npm run build
```
Creates a production build in the `build` folder.

```bash
npm run eject
```
Ejects the CRA configuration. Use with caution.

## Notes

- Only valid image files are accepted.
- If the backend is unavailable, the app shows a connection error.
- Downloaded output is named `bg-removed.png`.

## License

This project is intended for local development and experimentation unless a separate license is added.
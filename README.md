# Maps App

A modern, Apple-style maps application built with Next.js 15, Turbopack, and Google Maps.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Google Maps API key to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
   ```
   Get a key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).  
   Enable **Maps JavaScript API** and **Places API**.

3. Run the dev server (with Turbopack):
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Next.js 15** with Turbopack
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** — animations
- **Lucide React** — icons
- **next-themes** — dark/light mode with system detection
- **@vis.gl/react-google-maps** — Google Maps integration

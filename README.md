# Weather App (React + TypeScript)

A lightweight weather app built with React and TypeScript: responsive layout, data from OpenWeather. Enter a city — get current weather, humidity/wind, sunrise/sunset, and a forecast.

## Features

* City search and display of **current weather** (°C, feels like, description).
* Local **time and date** for the selected city.
* **Humidity**, **wind speed**, **sunrise/sunset** shown in the city’s local time.
* **5‑day forecast** (from the 5‑day/3‑hour API, aggregated per day).
* Responsive layout (mobile → tablet → desktop).
* Lightweight **CSS** styling.
* Plain `fetch` + `useState`/`useEffect`.

## Tech Stack

* **React 18** + **TypeScript**
* **Vite**
* API: **OpenWeather** (`/data/2.5/weather`, `/data/2.5/forecast`)

## API

Two endpoints are used:

* `GET /data/2.5/weather?q={city}&units=metric&appid={API_KEY}` — current weather
* `GET /data/2.5/forecast?q={city}&units=metric&appid={API_KEY}` — 5‑day forecast (3‑hour step)

## Layout & Responsiveness

* Global layout — **CSS Grid**/**Flex**.
* Breakpoint: `480px` (see `index.css`).

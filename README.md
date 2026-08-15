# Bangalore Pincode Explorer

A lightweight full-stack web app that lets you enter a 6-digit PIN code and discover the corresponding Bangalore-area post offices.

## Features

- Search Bangalore PIN codes
- Shows matching area/post-office names
- Displays branch type, delivery status, district and state
- Quick-search popular Bangalore PIN codes
- Recent searches saved in the browser
- Express backend keeps the postal API call server-side
- Responsive dark UI

## Tech Stack

- **Frontend:** React + Vite + CSS
- **Backend:** Node.js + Express
- **Data:** Postal PIN Code API

The API endpoint used is `https://api.postalpincode.in/pincode/{PINCODE}`. It returns post-office details for a PIN code. The backend filters the response to Karnataka records whose district identifies Bangalore/Bengaluru.

## Project Structure

```text
bangalore-pincode-explorer/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── styles.css
├── .gitignore
└── README.md
```

## Run Locally

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in your terminal, usually `http://localhost:5173`.

If your backend is deployed elsewhere, set:

```bash
VITE_API_URL=https://your-api.example.com/api
```

before running the frontend build.

## API

### `GET /api/health`

Returns a basic health check.

### `GET /api/pincode/:pincode`

Example:

```text
GET /api/pincode/560034
```

Example response shape:

```json
{
  "pincode": "560034",
  "areaCount": 1,
  "areas": [
    {
      "name": "Koramangala",
      "branchType": "Sub Post Office",
      "deliveryStatus": "Delivery",
      "district": "Bangalore South",
      "division": "Bengaluru South",
      "region": "Bengaluru HQ",
      "state": "Karnataka",
      "pinCode": "560034"
    }
  ]
}
```

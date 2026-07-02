# GrainGuard 🌾

GrainGuard is a comprehensive agricultural storage booking platform designed to bridge the gap between farmers and storage facility owners (government, commercial, and peer-to-peer). By digitizing the agricultural storage ecosystem, GrainGuard ensures transparency, secure payments, and optimal crop preservation.

## Features

- **Multi-Role Portal:** Dedicated interfaces for Farmers (to search and book storage) and Facility Owners (to manage bookings and capacity).
- **Smart Storage Discovery:** Search and filter storage units by capacity, price, crop type, and climate-control amenities.
- **Real-Time Capacity Tracking:** Dynamic occupancy meters to monitor available space at storage facilities.
- **Market & Weather Insights:** Integrated weather tracking (temperature/humidity) and market demand analytics to help farmers make informed decisions.
- **Secure Escrow Payments:** Safe transactions where payments are held in escrow until the storage term commences.

## Tech Stack

**Frontend:**
- React (v19)
- Vite 
- TanStack Router (File-based routing)
- Tailwind CSS & Shadcn/Radix UI for styling
- React Query (Data fetching)

**Backend:**
- Python / FastAPI
- Uvicorn

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- npm or bun

### Running the Frontend
1. Navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Backend
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies (assuming a requirements.txt exists):
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

## License
MIT License

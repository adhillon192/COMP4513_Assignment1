# Formula 1 Racing API

A RESTful API providing comprehensive access to Formula 1 racing data from 2019-2023. This API serves information about circuits, drivers, constructors, races, results, qualifying sessions, and championship standings.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
## Live API

**Base URL:** `https://comp4513.assignment1.adhillon.net`

**Test the API:** [https://comp4513.assignment1.adhillon.net/](https://comp4513.assignment1.adhillon.net/)

##  Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Data Coverage](#data-coverage)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

##  Technologies Used
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Row Level Security (RLS)
- **Hosting:** Render
- **Middleware:** CORS, dotenv

##  Features

-  Search drivers by surname
-  Access historical race data (2019-2023)
-  View championship standings
-  Fast qualifying results lookup
-  Filter by circuits, seasons, and date ranges
-  Complete race results with driver and constructor details
-  Secure API with read-only access

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase](https://supabase.com/) account (for database)

### Installation

1. **Clone the Repository:**
```bash
   git clone https://github.com/yourusername/Formula1_RacingAPI.git
   cd Formula1_RacingAPI
```
2. **Install Dependencies:**
```bash
   npm install
```
3. **Set Up Environment Variables:**  
   Create a `.env` file in the root directory:
```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_KEY=your-supabase-anon-key
   PORT=3000
```
4. **Run the Application:**
```bash
   npm start
```
   The API will be available at `http://localhost:3000`
5. **Development Mode (with auto-reload):**
```bash
   npm run dev
```
## API Documentation
| Resource | Endpoint | Description |
|----------|----------|-------------|
| Circuits | [/api/circuits](https://comp4513.assignment1.adhillon.net/api/circuits) | Get all circuits |
| Circuits | [/api/circuits/monza](https://comp4513.assignment1.adhillon.net/api/circuits/monza) | Get circuit details (Monza) |
| Circuits | [/api/circuits/calgary](https://comp4513.assignment1.adhillon.net/api/circuits/calgary) | Get circuit details (Calgary) |
| Constructors | [/api/constructors](https://comp4513.assignment1.adhillon.net/api/constructors) | Get all constructors |
| Constructors | [/api/constructors/ferrari](https://comp4513.assignment1.adhillon.net/api/constructors/ferrari) | Get constructor details (Ferrari) |
| Drivers | [/api/drivers](https://comp4513.assignment1.adhillon.net/api/drivers) | Get all drivers |
| Drivers | [/api/drivers/Norris](https://comp4513.assignment1.adhillon.net/api/drivers/Norris) | Get driver details (Norris) |
| Drivers | [/api/drivers/norris](https://comp4513.assignment1.adhillon.net/api/drivers/norris) | Get driver details (norris, lowercase) |
| Drivers | [/api/drivers/connolly](https://comp4513.assignment1.adhillon.net/api/drivers/connolly) | Get driver details (Connolly) |
| Drivers | [/api/drivers/search/sch](https://comp4513.assignment1.adhillon.net/api/drivers/search/sch) | Search drivers by surname starting with "sch" |
| Drivers | [/api/drivers/search/xxxxx](https://comp4513.assignment1.adhillon.net/api/drivers/search/xxxxx) | Search drivers by surname starting with "xxxxx" |
| Drivers | [/api/drivers/race/1069](https://comp4513.assignment1.adhillon.net/api/drivers/race/1069) | Get drivers in race ID 1069 |
| Races | [/api/races/1034](https://comp4513.assignment1.adhillon.net/api/races/1034) | Get race by ID 1034 |
| Races | [/api/races/season/2021](https://comp4513.assignment1.adhillon.net/api/races/season/2021) | Get all races in 2021 season |
| Races | [/api/races/season/1800](https://comp4513.assignment1.adhillon.net/api/races/season/1800) | Get all races in 1800 season (likely empty) |
| Races | [/api/races/season/2020/5](https://comp4513.assignment1.adhillon.net/api/races/season/2020/5) | Get 5th race of 2020 season |
| Races | [/api/races/season/2020/100](https://comp4513.assignment1.adhillon.net/api/races/season/2020/100) | Get 100th race of 2020 season (likely empty) |
| Races | [/api/races/circuits/7](https://comp4513.assignment1.adhillon.net/api/races/circuits/7) | Get races at circuit ID 7 |
| Races | [/api/races/circuits/7/season/2015/2022](https://comp4513.assignment1.adhillon.net/api/races/circuits/7/season/2015/2022) | Get races at circuit 7 between 2015–2022 |
| Races | [/api/races/circuits/7/season/2022/2022](https://comp4513.assignment1.adhillon.net/api/races/circuits/7/season/2022/2022) | Get races at circuit 7 in 2022 |
| Results | [/api/results/1106](https://comp4513.assignment1.adhillon.net/api/results/1106) | Get results for race ID 1106 |
| Results | [/api/results/driver/max_verstappen](https://comp4513.assignment1.adhillon.net/api/results/driver/max_verstappen) | Get results for driver Max Verstappen |
| Results | [/api/results/driver/connolly](https://comp4513.assignment1.adhillon.net/api/results/driver/connolly) | Get results for driver Connolly |
| Results | [/api/results/drivers/sainz/seasons/2021/2022](https://comp4513.assignment1.adhillon.net/api/results/drivers/sainz/seasons/2021/2022) | Get results for Sainz between 2021–2022 |
| Results | [/api/results/drivers/sainz/seasons/2035/2022](https://comp4513.assignment1.adhillon.net/api/results/drivers/sainz/seasons/2035/2022) | Get results for Sainz between 2035–2022 (invalid range) |
| Qualifying | [/api/qualifying/1106](https://comp4513.assignment1.adhillon.net/api/qualifying/1106) | Get qualifying results for race 1106 |
| Standings | [/api/standings/drivers/1120](https://comp4513.assignment1.adhillon.net/api/standings/drivers/1120) | Get driver standings after race 1120 |
| Standings | [/api/standings/constructors/1120](https://comp4513.assignment1.adhillon.net/api/standings/constructors/1120) | Get constructor standings after race 1120 |
| Standings | [/api/standings/constructors/asds](https://comp4513.assignment1.adhillon.net/api/standings/constructors/asds) | Get constructor standings for "asds" (likely invalid) |


##  Data Coverage

- **Years:** 2019-2023 (most complete data)


**Note:** Data quality is best for years 2019-2023. Earlier years may have incomplete information.

---

### Available Scripts
```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Install dependencies
npm install
```

### Database Schema

The API uses the following Supabase tables:

- `circuits` - Race track information
- `constructors` - Team information
- `drivers` - Driver profiles
- `races` - Race events
- `results` - Race finish results
- `qualifying` - Qualifying session results
- `driver_standings` - Championship standings for drivers
- `constructor_standings` - Championship standings for constructors

### Adding New Endpoints

1. Add route in `server.js`
2. Use Supabase client for database queries
3. Add error handling
4. Update README with new endpoint
5. Test locally before deploying

---

##  Deployment

This API is deployed on [Render](https://render.com) with the following configuration:

**Build Settings:**
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

**Custom Domain:** `comp4513.assignment1.adhillon.net`

### Deployment Steps

1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically on push

**Note:** Free tier apps sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

##  Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Server error

**Error Response Format:**
```json
{
  "error": "Driver not found"
}
```

---

##  Security

- Read-only API (no modifications allowed)
- Supabase Row Level Security (RLS) enabled
- Public read policies for all tables
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

---

##  Known Issues

- Some historical data (pre-2019) may be incomplete
- Qualifying results only available for drivers who advanced through rounds
- First request after sleep takes 30-60 seconds (Render free tier)

---

## 🤝Contributing

This is an academic project. If you find issues or have suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---
##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

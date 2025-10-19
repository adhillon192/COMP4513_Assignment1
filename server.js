// Formula 1 Racing API Server

const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;
// We needed a dynamic port from environment variables. 


// We used the env variables for Supabase credentials in the repo for the Exercise but for 
// production apps, we considered using a more secure method to manage sensitive information. 
// ie a env file kept out of version control.

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Setup
const supabase= createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Root endpoint, taught in labs too :)
app.get('/', (req, res) => {
  res.json({
    message: 'Formula 1 API',
    version: '1.0.0',
    endpoints: {
      circuits: {
        all: '/api/circuits',
        byRef: '/api/circuits/:ref',
        bySeason: '/api/circuits/season/:year'
      },
      constructors: {
        all: '/api/constructors',
        byRef: '/api/constructors/:ref'
      },
      drivers: {
        all: '/api/drivers',
        byRef: '/api/drivers/:ref',
        search: '/api/drivers/search/:substring',
        byRace: '/api/drivers/race/:raceId'
      },
      races: {
        byId: '/api/races/:raceId',
        bySeason: '/api/races/season/:year',
        bySeasonAndRound: '/api/races/season/:year/:round',
        byCircuit: '/api/races/circuits/:ref',
        byCircuitAndSeasons: '/api/races/circuits/:ref/season/:start/:end'
      },
      results: {
        byRace: '/api/results/:raceId',
        byDriver: '/api/results/driver/:ref',
        byDriverAndSeasons: '/api/results/drivers/:ref/seasons/:start/:end'
      },
      qualifying: {
        byRace: '/api/qualifying/:raceId'
      },
      standings: {
        drivers: '/api/standings/drivers/:raceId',
        constructors: '/api/standings/constructors/:raceId'
      }
    }
  });
});

// Circuit Endpoints

// Get all circuits
app.get('/api/circuits', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('circuits')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get circuit by reference
app.get('/api/circuits/:ref', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('circuits')
      .select('*')
      .eq('circuitRef', req.params.ref)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Circuit not found' });
    }
    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Circuit not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get circuits used in a season
app.get('/api/circuits/season/:year', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('races')
      .select(`
        round,
        circuits (*)
      `)
      .eq('year', req.params.year)
      .order('round');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Constructor Endpoints

// Get all constructors
app.get('/api/constructors', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('constructors')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get constructor by reference
app.get('/api/constructors/:ref', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('constructors')
      .select('*')
      .eq('constructorRef', req.params.ref)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Constructor not found' });
    }
    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Constructor not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Driver Endpoints
// Get all drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('surname');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver by reference
app.get('/api/drivers/:ref', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('driverRef', req.params.ref)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get drivers by lastname or some call it surname search (case insensitive)
app.get('/api/drivers/search/:substring', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .ilike('surname', `${req.params.substring}%`)
      .order('surname');

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No drivers found matching that search' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get drivers in a race
app.get('/api/drivers/race/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select(`
        drivers (*)
      `)
      .eq('raceId', req.params.raceId)
      .order('grid');

    if (error) throw error;
    
  // Return nested drivers objects directly
  res.json(data.map(r => r.drivers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Race Endpoints
// GET race by ID
app.get('/api/races/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('races')
      .select(`
        raceId, year, round, name, date, time, url,
        circuits (name, location, country)
      `)
      .eq('raceId', req.params.raceId)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Race not found' });
    }

    // Return the data as-is (includes nested `circuits` object)
    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Race not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

//Get races by circuitId
app.get('/api/races/circuits/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('races')
      .select(`
        raceId, year, round, name, date, time, url,
        circuits (name, location, country)
      `)
      .eq('circuitId', req.params.id)
      .order('year');

    if (error) throw error;

    if (!data || data.length === 0)
      return res.status(404).json({ message: 'No races found for this circuit' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Get races by circuitId within a season range
app.get('/api/races/circuits/:id/season/:start/:end', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('races')
      .select(`
        raceId, year, round, name, date, time, url,
        circuits (name, location, country)
      `)
      .eq('circuitId', req.params.id)
      .gte('year', req.params.start)
      .lte('year', req.params.end)
      .order('year');

    if (error) throw error;

    if (!data || data.length === 0)
      return res.status(404).json({ message: 'No races found in this range' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get races by circuitId for a single season
app.get('/api/races/circuits/:id/season/:year', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('races')
      .select(`
        raceId, year, round, name, date, time, url,
        circuits (name, location, country)
      `)
      .eq('circuitId', req.params.id)
      .eq('year', req.params.year)
      .order('year');

    if (error) throw error;

    if (!data || data.length === 0)
      return res.status(404).json({ message: 'No races found for this season' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Result Endpoints

// Get results by race
app.get('/api/results/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select(`
        resultId, number, grid, position, positionText, positionOrder,
        points, laps, time, milliseconds, fastestLap, rank,
        fastestLapTime, fastestLapSpeed, statusId,
        drivers (driverRef, code, forename, surname),
        races (name, round, year, date),
        constructors (name, constructorRef, nationality)
      `)
      .eq('raceId', req.params.raceId)
      .order('positionOrder', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No results found for this race' });
    }

    // Return nested data directly (includes drivers, races, constructors)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results by driverRef
app.get('/api/results/driver/:ref', async (req, res) => {
  try {
    const driverRef = req.params.ref.toLowerCase();

    // Get driverId from driverRef
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('driverId, driverRef')
      .ilike('driverRef', driverRef) // case-insensitive match
      .single();

    if (driverError) throw driverError;
    if (!driver) {
      return res.status(404).json({ message: `Driver '${driverRef}' not found` });
    }

    // Fetch results for that driverId
    const { data, error } = await supabase
      .from('results')
      .select(`
        resultId, number, grid, position, positionText, positionOrder,
        points, laps, time, milliseconds, fastestLap, rank,
        fastestLapTime, fastestLapSpeed, statusId,
        drivers (driverRef, code, forename, surname),
        races (name, round, year, date),
        constructors (name, constructorRef, nationality)
      `)
      .eq('driverId', driver.driverId)
      .order('raceId', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No results found for driver '${driver.driverRef}'` });
    }

    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(500).json({ error: error.message });
  }
});


// Get results by driver and season range
app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => {
  try {
    const { ref, start, end } = req.params;

    // First get the driver ID
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('driverId')
      .eq('driverRef', ref)
      .single();

    if (driverError) throw driverError;
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Query results with season filtering
   const { data, error } = await supabase
  .from('results')
  .select(`
    resultId, number, grid, position, positionText, positionOrder,
    points, laps, time, milliseconds, fastestLap, rank,
    fastestLapTime, fastestLapSpeed, statusId,
    drivers (driverRef, code, forename, surname),
    races (name, round, year, date),
    constructors (name, constructorRef, nationality)
  `)
  .eq('driverId', driver.driverId)
  .filter('races.year', 'gte', start)
  .filter('races.year', 'lte', end)
  .order('year', { referencedTable: 'races', ascending: false })
  .order('round', { referencedTable: 'races', ascending: false });


    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No results found for this season range' });
    }

    res.json(data);
  } catch (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Qualifying Endpoints

// GET qualifying by race
app.get('/api/qualifying/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('qualifying')
      .select(`
        qualifyId, number, position, q1, q2, q3,
        drivers (driverRef, code, forename, surname),
        races (name, round, year, date),
        constructors (name, constructorRef, nationality)
      `)
      .eq('raceId', req.params.raceId)
      .order('position');

    if (error) throw error;

    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// STANDINGS ENDPOINTS


// GET driver standings by race
app.get('/api/standings/drivers/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('driver_standings')
      .select(`
        driverStandingsId, points, position, positionText, wins,
        drivers (driverRef, code, forename, surname),
        races (name, round, year, date)
      `)
      .eq('raceId', req.params.raceId)
      .order('position');

    if (error) throw error;

    // Return nested driver standings directly (includes `drivers`, `races`)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET constructor standings by race
app.get('/api/standings/constructors/:raceId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('constructor_standings')
      .select(`
        constructorStandingsId, points, position, positionText, wins,
        constructors (name, constructorRef, nationality),
        races (name, round, year, date)
      `)
      .eq('raceId', req.params.raceId)
      .order('position');

    if (error) throw error;

    // Return nested constructor standings directly (includes `constructors`, `races`)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error Handling cause I am good like that
// Handle 404 errors for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Server

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to Supabase at: ${process.env.SUPABASE_URL}`);
});
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());


const apiKey = process.env.OPENWEATHERMAP_API_KEY;

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherResults = await Promise.all(
      cities.map(async (city) => {
        const weatherData = await getWeatherData(city);
        return { [city]: weatherData };
      })
    );

    const result = weatherResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    res.json({ weather: result });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getWeatherData(city) {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/3.0/weather`, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          },        
      params: {
        q: city,
        appid: apiKey,
        units: 'metric', // Change to 'imperial' for Fahrenheit
      },
    });
    return `${response.data.main.temp}C`;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return 'N/A';
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const axios = require('axios');
const moment = require('moment-timezone');

exports.getWeather = async (req, res) => {
    try {
        console.log("Fetching weather data...");

        const latitude = req.query.latitude ? req.query.latitude.trim() : null;
        const longitude = req.query.longitude ? req.query.longitude.trim() : null;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        console.log("Coordinates:", latitude, longitude);

        const response = await axios.get('https://api.met.no/weatherapi/locationforecast/2.0/compact', {
            params: { lat: latitude, lon: longitude },
            headers: {
                'User-Agent': 'WeatherApp/1.0 (contact@example.com)'
            },
        });

        const trimmedResponse = trimData(response);
        return res.status(200).json(trimmedResponse);
    } catch (error) {
        // console.error("Error fetching weather data:", error);
        res.status(500).json({ message: "Failed to fetch weather data", error: error.message });
    }
};

function convertToIST(utcTimeString) {
    return moment.utc(utcTimeString).tz('Asia/Kolkata').format('HH:mm');
}

function trimData(response) {
    const data = response.data;
    const now = moment().tz('Asia/Kolkata');
    const today = now.format('YYYY-MM-DD');

    let todayHigh = -Infinity;
    let todayLow = Infinity;

    const hourly = [];
    const daily = [];
    const details = [];

    for (const timeSeries of data.properties.timeseries) {
        const time = moment.utc(timeSeries.time).tz('Asia/Kolkata');
        const date = time.format('YYYY-MM-DD');

        if (date === today) {
            todayHigh = Math.max(todayHigh, timeSeries.data.instant.details.air_temperature);
            todayLow = Math.min(todayLow, timeSeries.data.instant.details.air_temperature);

            if (time >= now) {
                hourly.push({
                    time: convertToIST(timeSeries.time),
                    temp: Math.round(timeSeries.data.instant.details.air_temperature),
                    humidity: timeSeries.data.instant.details.relative_humidity,
                    wind_speed: timeSeries.data.instant.details.wind_speed,
                    cloud_area_fraction: timeSeries.data.instant.details.cloud_area_fraction,
                    desc: timeSeries.data.next_1_hours ? getDescription(timeSeries.data.next_1_hours.summary.symbol_code) : 'Cloudy',
                    icon: timeSeries.data.next_1_hours ? getWeatherIcon(timeSeries.data.next_1_hours.summary.symbol_code) : 'cloud'
                });
            }
        } else if (date > today) {
            let dayData = daily.find(day => day.date === date);
            if (!dayData) {
                dayData = {
                    date: date,
                    day: time.format('ddd'),
                    high: timeSeries.data.instant.details.air_temperature,
                    low: timeSeries.data.instant.details.air_temperature,
                    icon: 'cloud' // Default to cloud, will update later
                };
                daily.push(dayData);
            } else {
                dayData.high = Math.max(dayData.high, timeSeries.data.instant.details.air_temperature);
                dayData.low = Math.min(dayData.low, timeSeries.data.instant.details.air_temperature);
            }
        }
    }

    daily.forEach(day => {
        const dayDate = day.date;
        const dayCodes = data.properties.timeseries
            .filter(timeSeries => moment.utc(timeSeries.time).tz('Asia/Kolkata').format("YYYY-MM-DD") === dayDate)
            .map(timeseries => ({
                code: timeseries.data.next_6_hours && timeseries.data.next_6_hours.summary && timeseries.data.next_6_hours.summary.symbol_code,
                time: moment.utc(timeseries.time).tz('Asia/Kolkata')
            }))
            .filter(item => item.code !== undefined);

        const daySymbols = dayCodes.filter(item => item.code.includes('_day'));

        if (daySymbols.length > 0) {
            day.icon = getWeatherIcon(daySymbols[0].code);
        }
    });

    const closestEntry = data.properties.timeseries.find(entry => moment.utc(entry.time).tz('Asia/Kolkata') >= now) || data.properties.timeseries[0];

    if (closestEntry) {
        details.push({ name: 'Feels like', quantity: Math.round(closestEntry.data.instant.details.air_temperature), unit: '°C', icon: 'temperature' });
        details.push({ name: 'Humidity', quantity: Math.round(closestEntry.data.instant.details.relative_humidity), unit: '%', icon: 'humidity' });
        details.push({ name: 'Air Speed', quantity: Math.round(closestEntry.data.instant.details.wind_speed), unit: 'm/s', icon: 'air_speed' });
        details.push({ name: 'Air Pressure', quantity: Math.round(closestEntry.data.instant.details.air_pressure_at_sea_level), unit: 'hPa', icon: 'air_pressure' });
    }

    return {
        todayHigh: Math.round(todayHigh),
        todayLow: Math.round(todayLow),
        hourly: hourly,
        details: details,
        daily: daily
    };
}

function getWeatherIcon(symbolCode) {
    const icons = {
        'clearsky_day': 'sun',
        'clearsky_night': 'night',
        'partlycloudy_day': 'partly_cloudy',
        'cloudy': 'cloud',
        'rain': 'rain',
        'snow': 'snow',
        'thunderstorm': 'thunderstorm',
        'fog': 'fog'
    };
    return icons[symbolCode] || 'cloud';
}

function getDescription(symbolCode) {
    const descriptions = {
        'clearsky_day': 'Clear sky',
        'clearsky_night': 'Clear night',
        'partlycloudy_day': 'Partly cloudy',
        'cloudy': 'Cloudy',
        'rain': 'Rainy',
        'snow': 'Snowy',
        'thunderstorm': 'Thunderstorm',
        'fog': 'Foggy'
    };
    return descriptions[symbolCode] || 'Cloudy';
}
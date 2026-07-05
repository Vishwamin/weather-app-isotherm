// Open-Meteo returns WMO weather codes. This maps each code to a
// lucide-react icon name, a short label, and whether it's a "warm" or
// "cool" condition (used to bias the isotherm gradient's hue).
export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'Sun', tone: 'warm' },
  1: { label: 'Mainly clear', icon: 'Sun', tone: 'warm' },
  2: { label: 'Partly cloudy', icon: 'CloudSun', tone: 'neutral' },
  3: { label: 'Overcast', icon: 'Cloud', tone: 'neutral' },
  45: { label: 'Fog', icon: 'CloudFog', tone: 'cool' },
  48: { label: 'Depositing rime fog', icon: 'CloudFog', tone: 'cool' },
  51: { label: 'Light drizzle', icon: 'CloudDrizzle', tone: 'cool' },
  53: { label: 'Moderate drizzle', icon: 'CloudDrizzle', tone: 'cool' },
  55: { label: 'Dense drizzle', icon: 'CloudDrizzle', tone: 'cool' },
  56: { label: 'Light freezing drizzle', icon: 'CloudDrizzle', tone: 'cool' },
  57: { label: 'Dense freezing drizzle', icon: 'CloudDrizzle', tone: 'cool' },
  61: { label: 'Slight rain', icon: 'CloudRain', tone: 'cool' },
  63: { label: 'Moderate rain', icon: 'CloudRain', tone: 'cool' },
  65: { label: 'Heavy rain', icon: 'CloudRainWind', tone: 'cool' },
  66: { label: 'Light freezing rain', icon: 'CloudRain', tone: 'cool' },
  67: { label: 'Heavy freezing rain', icon: 'CloudRainWind', tone: 'cool' },
  71: { label: 'Slight snow fall', icon: 'CloudSnow', tone: 'cool' },
  73: { label: 'Moderate snow fall', icon: 'CloudSnow', tone: 'cool' },
  75: { label: 'Heavy snow fall', icon: 'CloudSnow', tone: 'cool' },
  77: { label: 'Snow grains', icon: 'CloudSnow', tone: 'cool' },
  80: { label: 'Slight rain showers', icon: 'CloudRain', tone: 'cool' },
  81: { label: 'Moderate rain showers', icon: 'CloudRain', tone: 'cool' },
  82: { label: 'Violent rain showers', icon: 'CloudRainWind', tone: 'cool' },
  85: { label: 'Slight snow showers', icon: 'CloudSnow', tone: 'cool' },
  86: { label: 'Heavy snow showers', icon: 'CloudSnow', tone: 'cool' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', tone: 'cool' },
  96: { label: 'Thunderstorm, slight hail', icon: 'CloudLightning', tone: 'cool' },
  99: { label: 'Thunderstorm, heavy hail', icon: 'CloudLightning', tone: 'cool' }
};

export function describeCode(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: 'HelpCircle', tone: 'neutral' };
}

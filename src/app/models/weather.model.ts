export interface WeatherData {
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
  clouds: {
    all: number;
  };
}

export interface WeatherResponse {
  data: WeatherData;
  error?: string;
}

export interface ForecastData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastData[];
  error?: string;
} 
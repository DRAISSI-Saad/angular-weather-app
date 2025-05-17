import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherData, WeatherResponse, ForecastData, ForecastResponse } from './models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = 'c81df06b2d55e7dad2ea455f58a73f4c';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private clientHttp: HttpClient) { }

  getWeatherService(cityname: string): Observable<WeatherResponse> {
    const url = `${this.BASE_URL}?q=${cityname}&appid=${this.API_KEY}&units=metric`;
    
    return this.clientHttp.get<WeatherData>(url).pipe(
      map(data => ({ data })),
      catchError(this.handleError)
    );
  }

  getForecast(cityname: string): Observable<ForecastResponse> {
    const url = `${this.FORECAST_URL}?q=${cityname}&appid=${this.API_KEY}&units=metric`;
    return this.clientHttp.get<{ list: ForecastData[] }>(url).pipe(
      map(data => ({ list: data.list })),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 404) {
        errorMessage = 'Ville non trouvée';
      } else if (error.status === 401) {
        errorMessage = 'Clé API invalide';
      } else {
        errorMessage = `Erreur serveur: ${error.status}`;
      }
    }
    
    return throwError(() => ({ error: errorMessage }));
  }
}

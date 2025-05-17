import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CityImage {
  url: string;
  description: string;
  photographer: string;
  photographerUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityImageService {
  private readonly UNSPLASH_API_KEY = '67trPlFMQ9Yotxel24WwneHh9X-pY6Q-XMFruVfdDjE';
  private readonly UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

  constructor(private http: HttpClient) {}

  getCityImages(cityName: string): Observable<CityImage[]> {
    if (cityName.trim().toLowerCase() === 'dakhla') {
      // Retourner le drapeau du Maroc comme image unique
      return new Observable<CityImage[]>(observer => {
        observer.next([
          {
            url: 'https://flagcdn.com/w1280/ma.png',
            description: 'Drapeau du Maroc',
            photographer: 'Gouvernement du Maroc',
            photographerUrl: 'https://www.maroc.ma/'
          }
        ]);
        observer.complete();
      });
    }
    const headers = {
      'Authorization': `Client-ID ${this.UNSPLASH_API_KEY}`
    };

    // Recherche simple avec le nom de la ville
    const query = `${cityName}`;
    const url = `${this.UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&per_page=5`;

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          return response.results.map((photo: any) => ({
            url: photo.urls.regular,
            description: photo.description || photo.alt_description || `Photo de ${cityName}`,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html
          }));
        }
        return this.getDefaultCityImages(cityName);
      }),
      catchError(this.handleError)
    );
  }

  private getDefaultCityImages(cityName: string): CityImage[] {
    return [{
      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&auto=format&fit=crop',
      description: `Centre-ville de ${cityName}`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com'
    }];
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue lors de la récupération des images';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Clé API Unsplash invalide';
      } else if (error.status === 403) {
        errorMessage = 'Limite de requêtes API dépassée';
      } else {
        errorMessage = `Erreur serveur: ${error.status}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 
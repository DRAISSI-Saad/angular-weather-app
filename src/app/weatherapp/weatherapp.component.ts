import { NgIf, NgFor, NgClass, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { WeatherData, WeatherResponse, ForecastData } from '../models/weather.model';
import { CityImageService, CityImage } from '../services/city-image.service';
import { StorageService } from '../services/storage.service';
import { HttpClientModule } from '@angular/common/http';
import 'animate.css';

declare let L: any;

@Component({
  selector: 'app-weatherapp',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    HttpClientModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './weatherapp.component.html',
  styleUrls: ['./weatherapp.component.css']
})
export class WeatherappComponent implements OnInit, AfterViewInit, OnDestroy {
  cityName: string = '';
  ImageURL: string = '';
  cityImages: CityImage[] = [];
  currentImageIndex: number = 0;
  error: string | null = null;
  cityImage: string = '';

  pays: string = '';
  drapeau: string = '';
  temperature: number = 0;
  pression: number = 0;
  humidete: number = 0;
  humidity: number = 0;
  feelsLike: number = 0;
  clouds: number = 0;
  weatherData: WeatherData | null = null;
  weatherResponse: WeatherResponse | null = null;
  sunriseTimeString: string = '';
  sunsetTimeString: string = '';
  windSpeed: number = 0;
  description: string = '';

  affichageMessage: boolean = false;
  isLoading: boolean = false;
  isDarkMode: boolean = false;

  private map: any;
  private marker: any;
  private isMapInitialized: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private cityImageService: CityImageService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    // On ne touche pas à la carte ici, ni au champ de saisie
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('bg-dark', 'text-light');
      body.classList.remove('bg-light', 'text-dark');
    } else {
      body.classList.add('bg-light', 'text-dark');
      body.classList.remove('bg-dark', 'text-light');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      // Centrer la carte sur Casablanca par défaut
      if (this.map) {
        this.map.setView([33.5731, -7.5898], 12);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    if (!this.isMapInitialized) {
      this.map = L.map('cityMap').setView([33.5731, -7.5898], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      this.isMapInitialized = true;
    }
  }

  private updateMap(lat: number, lon: number) {
    if (!this.map) {
      this.initMap();
    }
    
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    
    this.map.setView([lat, lon], 12);
    this.marker = L.marker([lat, lon]).addTo(this.map)
      .bindPopup(this.cityName)
      .openPopup();
  }

  getweatherData() {
    if (this.cityName.trim() === '') {
      this.error = 'Veuillez entrer un nom de ville';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.affichageMessage = false;
    this.currentImageIndex = 0;

    // Récupérer les images de la ville
    this.cityImageService.getCityImages(this.cityName).subscribe({
      next: (images) => {
        this.cityImages = images;
        if (images.length > 0) {
          this.cityImage = images[0].url;
        }
      },
      error: () => {
        this.cityImages = [{
          url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop',
          description: 'Image par défaut',
          photographer: 'Unsplash',
          photographerUrl: 'https://unsplash.com'
        }];
        this.cityImage = this.cityImages[0].url;
      }
    });

    // Get coordinates for the city (compatible toutes villes)
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.cityName)}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.updateMap(lat, lon);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des coordonnées:', error);
      });

    this.weatherService.getWeatherService(this.cityName).subscribe({
      next: (response) => {
        this.weatherResponse = response;
        this.weatherData = response.data;
        
        // Vérification spéciale pour Dakhla
        if (this.cityName.toLowerCase() === 'dakhla') {
          this.pays = 'Maroc';
          this.drapeau = 'https://flagcdn.com/w320/ma.png';
        } else {
          this.pays = this.weatherData.sys.country;
          this.drapeau = `https://flagcdn.com/w320/${this.weatherData.sys.country.toLowerCase()}.png`;
        }

        this.temperature = Math.round(this.weatherData.main.temp);
        this.pression = this.weatherData.main.pressure;
        this.humidete = this.weatherData.main.humidity;
        this.humidity = this.weatherData.main.humidity;
        this.feelsLike = Math.round(this.weatherData.main.feels_like);
        this.clouds = this.weatherData.clouds.all;
        this.description = this.weatherData.weather[0].description;

        // Enregistrer dans l'historique
        this.storageService.ajouterHistorique({
          ville: this.cityName,
          pays: this.pays,
          temperature: this.temperature,
          date: new Date()
        });

        const sunriseTimestamp = this.weatherData.sys.sunrise * 1000;
        const sunsetTimestamp = this.weatherData.sys.sunset * 1000;
        const sunriseDate = new Date(sunriseTimestamp);
        const sunsetDate = new Date(sunsetTimestamp);

        this.sunriseTimeString = sunriseDate.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        this.sunsetTimeString = sunsetDate.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        this.windSpeed = this.weatherData.wind.speed;
        this.ImageURL = `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`;
        this.affichageMessage = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error;
        this.weatherData = null;
        this.weatherResponse = null;
        this.affichageMessage = false;
        this.isLoading = false;
      }
    });
  }

  nextImage(): void {
    if (this.cityImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.cityImages.length;
      this.cityImage = this.cityImages[this.currentImageIndex].url;
    }
  }

  previousImage(): void {
    if (this.cityImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.cityImages.length) % this.cityImages.length;
      this.cityImage = this.cityImages[this.currentImageIndex].url;
    }
  }

  enregistrerUtilisateur(formdata: NgForm) {
    if (formdata.valid) {
      this.getweatherData();
    }
  }

  getThemeClass(): string {
    if (!this.weatherData) return 'theme-default';
    const main = this.weatherData.weather[0].description.toLowerCase();
    if (main.includes('soleil') || main.includes('clear')) return 'theme-clear';
    if (main.includes('pluie') || main.includes('rain')) return 'theme-rain';
    if (main.includes('nuage') || main.includes('cloud')) return 'theme-clouds';
    if (main.includes('neige') || main.includes('snow')) return 'theme-snow';
    if (main.includes('nuit') || main.includes('night')) return 'theme-night';
    return 'theme-default';
  }
}

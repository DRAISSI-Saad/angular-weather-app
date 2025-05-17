import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, VilleFavorite } from '../services/storage.service';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="favoris-container">
      <h1>Villes Favorites</h1>
      
      <div class="search-form">
        <input 
          type="text" 
          [(ngModel)]="nouvelleVille" 
          placeholder="Entrez le nom d'une ville"
          (keyup.enter)="ajouterVille()"
        >
        <button (click)="ajouterVille()" [disabled]="!nouvelleVille.trim()">
          Ajouter
        </button>
      </div>

      <div class="favoris-list">
        <div class="favoris-empty" *ngIf="favoris.length === 0">
          <p>Aucune ville favorite pour le moment</p>
          <p>Ajoutez des villes à vos favoris</p>
        </div>
        <div class="favoris-item" *ngFor="let ville of favoris">
          <div class="ville-info">
            <h3>{{ ville.nom }}</h3>
            <p>{{ ville.pays }}</p>
            <p class="description">{{ ville.description }}</p>
          </div>
          <div class="ville-temp">
            <span>{{ ville.temperature }}°C</span>
          </div>
          <button class="remove-btn" (click)="removeFavori(ville)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favoris-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-form {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .search-form input {
      flex: 1;
      padding: 0.8rem;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 1rem;
    }

    .search-form input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-form button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .search-form button:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .search-form button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .favoris-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .favoris-item {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .favoris-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .ville-info h3 {
      margin: 0;
      color: white;
      font-size: 1.4rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .ville-info p {
      margin: 0.5rem 0 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .ville-info .description {
      font-style: italic;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    .ville-temp {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .remove-btn {
      background: rgba(255, 0, 0, 0.2);
      border: none;
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.4rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: rgba(255, 0, 0, 0.3);
      transform: scale(1.1);
    }

    .favoris-empty {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      color: white;
    }

    .favoris-empty p:first-child {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .favoris-empty p:last-child {
      color: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 768px) {
      .search-form {
        flex-direction: column;
      }

      .favoris-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .ville-temp {
        font-size: 1.8rem;
      }
    }
  `]
})
export class FavorisComponent implements OnInit {
  favoris: VilleFavorite[] = [];
  nouvelleVille: string = '';

  constructor(
    private storageService: StorageService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.storageService.favoris$.subscribe(favoris => {
      this.favoris = favoris;
    });
  }

  async ajouterVille() {
    if (!this.nouvelleVille.trim()) return;

    try {
      const response = await this.weatherService.getWeatherService(this.nouvelleVille).toPromise();
      if (response && response.data) {
        const ville: VilleFavorite = {
          nom: this.nouvelleVille,
          pays: response.data.sys.country,
          temperature: Math.round(response.data.main.temp),
          description: response.data.weather[0].description
        };

        this.storageService.ajouterFavori(ville);
        this.nouvelleVille = '';
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de la ville:', error);
    }
  }

  removeFavori(ville: VilleFavorite) {
    this.storageService.supprimerFavori(ville);
  }
} 
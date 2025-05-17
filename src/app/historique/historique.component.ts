import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, RechercheHistorique } from '../services/storage.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="historique-container">
      <h1>Historique des Recherches</h1>
      <div class="historique-list">
        <div class="historique-empty" *ngIf="historique.length === 0">
          <p>Aucune recherche effectuée</p>
          <p>Commencez à rechercher des villes</p>
        </div>
        <div class="historique-item" *ngFor="let recherche of historique">
          <div class="recherche-info">
            <h3>{{ recherche.ville }}</h3>
            <p>{{ recherche.pays }}</p>
            <p class="date">{{ recherche.date | date:'dd/MM/yyyy HH:mm' }}</p>
          </div>
          <div class="recherche-temp">
            <span>{{ recherche.temperature }}°C</span>
          </div>
          <button class="clear-btn" (click)="clearHistorique(recherche)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .historique-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .historique-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .historique-item {
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

    .historique-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .recherche-info h3 {
      margin: 0;
      color: white;
      font-size: 1.4rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .recherche-info p {
      margin: 0.5rem 0 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .recherche-info .date {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .recherche-temp {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .clear-btn {
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

    .clear-btn:hover {
      background: rgba(255, 0, 0, 0.3);
      transform: scale(1.1);
    }

    .historique-empty {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      color: white;
    }

    .historique-empty p:first-child {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .historique-empty p:last-child {
      color: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 768px) {
      .historique-item {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .recherche-temp {
        font-size: 1.8rem;
      }
    }
  `]
})
export class HistoriqueComponent implements OnInit {
  historique: RechercheHistorique[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.storageService.historique$.subscribe(historique => {
      this.historique = historique;
    });
  }

  clearHistorique(recherche: RechercheHistorique) {
    this.storageService.supprimerHistorique(recherche);
  }
} 
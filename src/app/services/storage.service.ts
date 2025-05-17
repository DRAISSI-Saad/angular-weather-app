import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface VilleFavorite {
  nom: string;
  pays: string;
  temperature: number;
  description: string;
}

export interface RechercheHistorique {
  ville: string;
  pays: string;
  temperature: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private favorisSubject = new BehaviorSubject<VilleFavorite[]>([]);
  private historiqueSubject = new BehaviorSubject<RechercheHistorique[]>([]);

  favoris$ = this.favorisSubject.asObservable();
  historique$ = this.historiqueSubject.asObservable();

  constructor() {
    // Charger les données du localStorage au démarrage
    const favoris = localStorage.getItem('favoris');
    const historique = localStorage.getItem('historique');

    if (favoris) {
      this.favorisSubject.next(JSON.parse(favoris));
    }

    if (historique) {
      this.historiqueSubject.next(JSON.parse(historique));
    }
  }

  ajouterFavori(ville: VilleFavorite) {
    const favoris = this.favorisSubject.value;
    if (!favoris.some(v => v.nom.toLowerCase() === ville.nom.toLowerCase())) {
      favoris.push(ville);
      this.favorisSubject.next(favoris);
      localStorage.setItem('favoris', JSON.stringify(favoris));
    }
  }

  supprimerFavori(ville: VilleFavorite) {
    const favoris = this.favorisSubject.value.filter(v => v.nom !== ville.nom);
    this.favorisSubject.next(favoris);
    localStorage.setItem('favoris', JSON.stringify(favoris));
  }

  ajouterHistorique(recherche: RechercheHistorique) {
    const historique = this.historiqueSubject.value;
    historique.unshift(recherche); // Ajouter au début
    this.historiqueSubject.next(historique);
    localStorage.setItem('historique', JSON.stringify(historique));
  }

  supprimerHistorique(recherche: RechercheHistorique) {
    const historique = this.historiqueSubject.value.filter(
      r => r.ville !== recherche.ville || r.date !== recherche.date
    );
    this.historiqueSubject.next(historique);
    localStorage.setItem('historique', JSON.stringify(historique));
  }
} 
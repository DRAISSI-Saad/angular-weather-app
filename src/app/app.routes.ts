import { Routes } from '@angular/router';
import { WeatherappComponent } from './weatherapp/weatherapp.component';
import { FavorisComponent } from './favoris/favoris.component';
import { HistoriqueComponent } from './historique/historique.component';

export const routes: Routes = [
  { path: '', component: WeatherappComponent },
  { path: 'favoris', component: FavorisComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: '**', redirectTo: '' }
];

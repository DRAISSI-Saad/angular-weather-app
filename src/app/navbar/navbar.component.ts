import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">WeatherApp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Météo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/favoris" routerLinkActive="active">Favoris</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/historique" routerLinkActive="active">Historique</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {} 
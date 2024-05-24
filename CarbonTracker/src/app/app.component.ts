import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { VariablesGlobales } from './VariablesGlobales';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DatePipe } from '@angular/common';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})

export class AppComponent implements OnInit {
  private compteurAfficheMsgKaraf: number = 0;

  /**
   * Permet d'utiliser des services dans le fichier.
   *
   * @param dialog Gére les boîtes de dialogues
   * @param global Accéde aux variables globaux
   * @param route Gére la navigation entre les routes
   * @param datePipe Formate les dates
   */
  constructor(public dialog: MatDialog, public global:VariablesGlobales, private route:Router, public datePipe: DatePipe) {}

  async ngOnInit(): Promise<void> {
    this.global.clef = nanoid();

    this.route.navigateByUrl('/carbonIntensity');

    await this.global.delay(2000);

    /* Demande de données si la websocket est connectée à KARAF */
    if (this.global.wsCarbonHistory.readyState == WebSocket.OPEN && this.global.ws2CarbonHistory.readyState == WebSocket.OPEN) {
      this.global.wsCarbonHistory.send('Amiens,1, , ,' + this.global.clef)
      console.log("demande carbon");
    }

    setInterval(() => {
      /* Reconnexion des websockets */
      if (this.global.wsCarbonHistory.readyState == WebSocket.CLOSED) {
        this.global.wsCarbonHistory = new WebSocket('ws://localhost:9290/wsCarbonHistory');
      }
      if (this.global.ws2CarbonHistory.readyState == WebSocket.CLOSED) {
        this.global.ws2CarbonHistory = new WebSocket('ws:///localhost:9290/ws2CarbonHistory');
      }
      if (this.global.wsConsoHistory.readyState == WebSocket.CLOSED) {
        this.global.wsConsoHistory = new WebSocket('ws://localhost:9290/wsConsoHistory');
      }
      if (this.global.ws2ConsoHistory.readyState == WebSocket.CLOSED) {
        this.global.ws2ConsoHistory = new WebSocket('ws:///localhost:9290/ws2ConsoHistory');
      }

      /* Affiche le message d'erreur si la communication avec le serveur est coupée */
      if (this.global.wsCarbonHistory.readyState != WebSocket.OPEN || this.global.ws2CarbonHistory.readyState != WebSocket.OPEN || this.global.wsConsoHistory.readyState != WebSocket.OPEN || this.global.ws2ConsoHistory.readyState != WebSocket.OPEN) {
        /* Après 7 secondes sans réponse du serveur, on affiche le message d'erreur */
        if (this.compteurAfficheMsgKaraf >= 6) {
          document.getElementById('ComKaraf')?.classList.remove("d-none")
          document.getElementById('header')?.classList.add("error-com");
          document.getElementById('ComKaraf')?.classList.add("blink");
        }

        /* Incrémente le compteur si la reconnexion n'abouti pas */
        this.compteurAfficheMsgKaraf++;
      } else {
        document.getElementById('ComKaraf')?.classList.add("d-none")
        document.getElementById('header')?.classList.remove("error-com");
        document.getElementById('ComKaraf')?.classList.remove("blink");

        /* Remet le compteur à 0 si toutes les connexions ont été établies */
        this.compteurAfficheMsgKaraf = 0;
      }

    }, 1000)
  }
}

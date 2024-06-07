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
  public hidden = false;

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

    if (this.global.wsConsoHistory.readyState == WebSocket.OPEN && this.global.ws2ConsoHistory.readyState == WebSocket.OPEN) {
      this.global.wsConsoHistory.send('Amiens,1, , ,' + this.global.clef)
      console.log("demande carbon");
    }

    if (this.global.wslastAlerte.readyState == WebSocket.OPEN && this.global.ws2lastAlerte.readyState == WebSocket.OPEN) {
      this.global.wslastAlerte.send(''+this.global.clef)
      console.log("demande last alerte");
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
      if (this.global.wsnewSeuil.readyState == WebSocket.CLOSED) {
        this.global.wsnewSeuil = new WebSocket('ws://localhost:9290/wsnewSeuil');
      }
      if (this.global.ws2newSeuil.readyState == WebSocket.CLOSED) {
        this.global.ws2newSeuil = new WebSocket('ws:///localhost:9290/ws2newSeuil');
      }
      if (this.global.wslastAlerte.readyState == WebSocket.CLOSED) {
        this.global.wslastAlerte = new WebSocket('ws://localhost:9290/wslastAlerte');
      }
      if (this.global.ws2lastAlerte.readyState == WebSocket.CLOSED) {
        this.global.ws2lastAlerte = new WebSocket('ws:///localhost:9290/ws2lastAlerte');
      }
      if (this.global.wsalerteCity.readyState == WebSocket.CLOSED) {
        this.global.wsalerteCity = new WebSocket('ws://localhost:9290/wsalerteCity');
      }
      if (this.global.ws2alerteCity.readyState == WebSocket.CLOSED) {
        this.global.ws2alerteCity = new WebSocket('ws:///localhost:9290/ws2alerteCity');
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

      if (this.global.wslastAlerte.readyState == WebSocket.OPEN && this.global.ws2lastAlerte.readyState == WebSocket.OPEN && this.global.nbAlertes == null) {
        this.global.wslastAlerte.send(''+this.global.clef)
        console.log("demande last alerte");
      }

      this.global.ws2lastAlerte.onmessage = (event) => {
        console.log("data receive alerte: "+event.data);
        let data = JSON.parse(event.data);
        if(data[data.length-1].clef == this.global.clef){
          this.global.nbAlertes = data.length-1;
          this.global.dataAlerte=[];
          for(let index =0; index < data.length-1; index++){
            console.log("for "+index)
            this.global.dataAlerte.push(data[index]);
          }
          console.log("receive data last alerte: "+this.global.dataAlerte)
        }
      }

      this.global.ws2ConsoHistory.onmessage = (event) => {
        console.log("Receive conso: "+event.data);
        let data = JSON.parse(event.data);
        if(data[data.length-1].clef == this.global.clef){
          this.global.dataJsonDemande = [];
          this.global.dataJsonProd = [];
          this.global.dataJsonExport = [];
          if(data[data.length-1].frequence == 1){
            for(let pointeur = 0; pointeur< data.length-1; pointeur++){
              if(data[pointeur].DATE && data[pointeur].POWERCONSUMPTION) {
                this.global.dataJsonDemande.push([data[pointeur].DATE, data[pointeur].POWERCONSUMPTION]);
                this.global.dataJsonProd.push([data[pointeur].DATE, data[pointeur].POWERPRODUCTION]);
                this.global.dataJsonExport.push([data[pointeur].DATE, data[pointeur].POWEREXPORT]);
              }
            }
          }
          else{
            if(data[data.length-1].frequence == 2){
              for(let pointeur: number = 0; pointeur< data.length-1; pointeur++){
                if(data[pointeur].DATE && data[pointeur].POWERCONSUMPTION) {
                  let datePointeur: string = data[pointeur].DATE.split(" ");
                  let hourTab: string[] = datePointeur[1].split(":");
                  let thisHour: number = +hourTab[0]
                  if (thisHour % 2 == 0) {
                    this.global.dataJsonDemande.push([data[pointeur].DATE, data[pointeur].POWERCONSUMPTION]);
                    this.global.dataJsonProd.push([data[pointeur].DATE, data[pointeur].POWERPRODUCTION]);
                    this.global.dataJsonExport.push([data[pointeur].DATE, data[pointeur].POWEREXPORT]);
                  }
                }
              }
            }
            else{
              for(let pointeur = 0; pointeur< data.length-1; pointeur++){
                if(data[pointeur].DATE && data[pointeur].POWERCONSUMPTION) {
                  let datePointeur: string = data[pointeur].DATE.split(" ");
                  let hourTab: string[] = datePointeur[1].split(":");
                  let thisHour: number = +hourTab[0]
                  if (thisHour % 3 == 0) {
                    this.global.dataJsonDemande.push([data[pointeur].DATE, data[pointeur].POWERCONSUMPTION]);
                    this.global.dataJsonProd.push([data[pointeur].DATE, data[pointeur].POWERPRODUCTION]);
                    this.global.dataJsonExport.push([data[pointeur].DATE, data[pointeur].POWEREXPORT]);
                  }
                }
              }
            }
          }
        }
      }
    }, 1000)
  }
}

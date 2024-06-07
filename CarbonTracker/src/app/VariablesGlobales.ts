import { Injectable } from '@angular/core';

@Injectable()
export class VariablesGlobales {

  public connected: any;
  public dataConnected: any;
  public dataJson: any;
  public dataJsonDemande: any;
  public dataJsonProd: any;
  public dataJsonExport: any;
  public clef: string = "";
  public nbAlertes: any;
  public dataAlerte: any;

  /**
   * Permet d'attendre un temps défini, avant de continuer le code
   * ATTENTION ! La fonction parente doit être asynchrone (async)
   *
   * @param ms Temps d'attente en ms
   */
  public wsCarbonHistory = new WebSocket ('ws://localhost:9290/wsCarbonHistory');
  public ws2CarbonHistory = new WebSocket ('ws://localhost:9290/ws2CarbonHistory');
  public wsConsoHistory = new WebSocket ('ws://localhost:9290/wsConsoHistory');
  public ws2ConsoHistory = new WebSocket ('ws://localhost:9290/ws2ConsoHistory');
  public wsnewSeuil = new WebSocket ('ws://localhost:9290/wsnewSeuil');
  public ws2newSeuil = new WebSocket ('ws://localhost:9290/ws2newSeuil');
  public wslastAlerte = new WebSocket ('ws://localhost:9290/wslastAlerte');
  public ws2lastAlerte = new WebSocket ('ws://localhost:9290/ws2lastAlerte');
  public wsalerteCity = new WebSocket ('ws://localhost:9290/wsalerteCity');
  public ws2alerteCity = new WebSocket ('ws://localhost:9290/ws2alerteCity');

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}

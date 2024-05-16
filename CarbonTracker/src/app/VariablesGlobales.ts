import { Injectable } from '@angular/core';

@Injectable()
export class VariablesGlobales {

  public connected: any;
  public dataConnected: any;
  public dataJson: any = [];
  public clef: string = "";

  /**
   * Permet d'attendre un temps défini, avant de continuer le code
   * ATTENTION ! La fonction parente doit être asynchrone (async)
   *
   * @param ms Temps d'attente en ms
   */
  public wsCarbonHistory = new WebSocket ('ws://localhost:9290/wsCarbonHistory');
  public ws2CarbonHistory = new WebSocket ('ws://localhost:9290/ws2CarbonHistory');

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
import { Component, OnInit } from '@angular/core';
import {VariablesGlobales} from "../VariablesGlobales";

@Component({
  selector: 'app-request-power',
  templateUrl: './request-power.component.html',
  styleUrls: ['./request-power.component.css']
})
export class RequestPowerComponent implements OnInit {

  constructor(public global: VariablesGlobales) { }

  ngOnInit(): void {
    if (this.global.wsCarbonHistory.readyState == WebSocket.OPEN && this.global.ws2CarbonHistory.readyState == WebSocket.OPEN) {
      this.global.wsCarbonHistory.send('Amiens,1, , ,' + this.global.clef)
      console.log("demande carbon");
    }

  }

}

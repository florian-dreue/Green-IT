import { Component, OnInit } from '@angular/core';
import {VariablesGlobales} from "../VariablesGlobales";

@Component({
  selector: 'app-seuil',
  templateUrl: './seuil.component.html',
  styleUrls: ['./seuil.component.css']
})
export class SeuilComponent implements OnInit {

  public citySelected: String = "Amiens";
  public seuil: number = 0;

  constructor(public global:VariablesGlobales) { }

  ngOnInit(): void {
    const btns = document.querySelectorAll('.menuButton');
    btns.forEach((btn) => {
      btn.classList.remove('selected');
    });
    document.getElementById('Seuil')?.classList.add('selected');

    setInterval(()=>{
      /* Récupère les données reçues par KARAF*/
      this.global.ws2newSeuil.onmessage = (event) => {
        console.log("data receive: "+event.data);
        let data = JSON.parse(event.data);
        if(data[data.length-1].clef == this.global.clef){
          console.log("receive data newSeuil")
        }
      }
    },1000)
  }

  valid() {
    if(this.citySelected != "" && this.seuil != 0){
      this.global.wsnewSeuil.send(this.citySelected+','+this.seuil+','+' , ,' + this.global.clef)
    }
  }
}

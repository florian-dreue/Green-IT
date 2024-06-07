import { Component, OnInit } from '@angular/core';
import {VariablesGlobales} from "../VariablesGlobales";

@Component({
  selector: 'app-alertes',
  templateUrl: './alertes.component.html',
  styleUrls: ['./alertes.component.css']
})
export class AlertesComponent implements OnInit {

  public displayedColumns = ["VILLE","VALEUR","DATE"]
  constructor(public global:  VariablesGlobales) { }

  ngOnInit(): void {
    const btns = document.querySelectorAll('.menuButton');
    btns.forEach((btn) => {
      btn.classList.remove('selected');
    });
    document.getElementById('Alerte')?.classList.add('selected');
  }

}

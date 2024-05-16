import {Component, Inject, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import {VariablesGlobales} from "../VariablesGlobales";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-carbon-intensity',
  templateUrl: './carbon-intensity.component.html',
  styleUrls: ['./carbon-intensity.component.css']
})
export class CarbonIntensityComponent implements OnInit {

  public dateNow = new Date();
  public dateDeb = new Date();
  public dateDebString: String = "";
  public citySelected: String = "Amiens";
  public hourSelected: String = "1";
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(public global:VariablesGlobales, private _adapter: DateAdapter<any>,@Inject(MAT_DATE_LOCALE) private _locale: string) { }

  ngOnInit(): void {
    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
    this.dateDeb.setDate(this.dateNow.getDate()-7);
    this.dateDeb.setHours(0,0,0);
    let TabLocal: string = this.dateDeb.toLocaleString();
    let splitDate: string[] = TabLocal.split(" ");
    let TabDate: string[] = splitDate[0].split("/");
    this.dateDebString = TabDate[2]+"-"+TabDate[1]+"-"+TabDate[0]+" "+splitDate[1];

    var chartDom = document.getElementById('carbonGraph');
    // @ts-ignore
    var myChart = echarts.init(chartDom);
    var option= {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value'
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          startValue: '2024-05-09 19:00:00'
        },
        {
          type: 'inside'
        }
      ],
      visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 15,
            color: '#93CE07'
          },
          {
            gt: 15,
            lte: 25,
            color: '#FBDB0F'
          },
          {
            gt: 25,
            lte: 35,
            color: '#FC7D02'
          },
          {
            gt: 35,
            lte: 45,
            color: '#FD0100'
          },
          {
            gt: 45,
            color: '#AA069F'
          }
        ],
        outOfRange: {
          color: '#999'
        }
      },
      series: [
        {
          data: this.global.dataJson,
          type: 'line',
          smooth: true
        }
      ]
    };

    option && myChart.setOption(option);

    setInterval(()=>{
      /* Récupère les données reçues par KARAF */
      this.global.ws2CarbonHistory.onmessage = (event) => {
        console.log("data receive: "+event.data);
        let data = JSON.parse(event.data);
        if(data[data.length-1].clef == this.global.clef){
          this.global.dataJson = [];
          for(let pointeur = 0; pointeur< data.length-1; pointeur++){
            this.global.dataJson.push([data[pointeur].DATE, data[pointeur].CARBONINTENSITY])
          }
          var option={
            series: [
              {
                data: this.global.dataJson,
                type: 'line',
                smooth: true
              }
            ]
          }
          option && myChart.setOption(option);
        }
      }
    },1000)

  }

  search() {
    console.log("Recherche: "+ this.range.value.start);
  }
}

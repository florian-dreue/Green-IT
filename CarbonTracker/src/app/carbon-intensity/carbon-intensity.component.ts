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
    const btns = document.querySelectorAll('.menuButton');
    btns.forEach((btn) => {
      btn.classList.remove('selected');
    });
    document.getElementById('CarbonIntensity')?.classList.add('selected');

    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
    this.dateDeb.setDate(this.dateNow.getDate()-7);
    this.dateDeb.setHours(0,0,0);
    let TabLocal: string = this.dateDeb.toLocaleString();
    let splitDate: string[] = TabLocal.split(" ");
    let TabDate: string[] = splitDate[0].split("/");
    this.dateDebString = TabDate[2]+"-"+TabDate[1]+"-"+TabDate[0]+" "+splitDate[1];

    this.appelRoute();

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
          startValue: this.dateDebString
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
            lt: 15,
            color: '#93CE07'
          },
          {
            gt: 15,
            lt: 25,
            color: '#FBDB0F'
          },
          {
            gt: 25,
            lt: 35,
            color: '#FC7D02'
          },
          {
            gt: 35,
            lt: 45,
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
        if(data[data.length-1]?.clef == this.global?.clef){
          this.global.dataJson = [];
          if(data[data.length-1].frequence == 1){
            for(let pointeur = 0; pointeur< data.length-1; pointeur++){
              if(data[pointeur].DATE && data[pointeur].CARBONINTENSITY){
                this.global.dataJson.push([data[pointeur].DATE, data[pointeur].CARBONINTENSITY])
              }
            }
          }
          else{
            if(data[data.length-1].frequence == 2){
              for(let pointeur: number = 0; pointeur< data.length-1; pointeur++){
                if(data[pointeur].DATE && data[pointeur].CARBONINTENSITY) {
                  let datePointeur: string = data[pointeur].DATE.split(" ");
                  let hourTab: string[] = datePointeur[1].split(":");
                  let thisHour: number = +hourTab[0]
                  if (thisHour % 2 == 0) {
                    this.global.dataJson.push([data[pointeur].DATE, data[pointeur].CARBONINTENSITY])
                  }
                }
              }
            }
            else{
              for(let pointeur = 0; pointeur< data.length-1; pointeur++){
                if(data[pointeur].DATE && data[pointeur].CARBONINTENSITY) {
                  let datePointeur: string = data[pointeur].DATE.split(" ");
                  let hourTab: string[] = datePointeur[1].split(":");
                  let thisHour: number = +hourTab[0]
                  if (thisHour % 3 == 0) {
                    this.global.dataJson.push([data[pointeur].DATE, data[pointeur].CARBONINTENSITY])
                  }
                }
              }
            }
          }

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
                startValue: this.dateDebString
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
                  lt: 15,
                  color: '#93CE07'
                },
                {
                  gt: 15,
                  lt: 25,
                  color: '#FBDB0F'
                },
                {
                  gt: 25,
                  lt: 35,
                  color: '#FC7D02'
                },
                {
                  gt: 35,
                  lt: 45,
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
        }
      }
    },1000)

  }

  search() {
    console.log("Recherche: "+ this.range.value.start);
    if (this.global.wsCarbonHistory.readyState == WebSocket.OPEN && this.global.ws2CarbonHistory.readyState == WebSocket.OPEN) {
      if(this.range.value.start == null || this.range.value.end == null){
        this.global.wsCarbonHistory.send(this.citySelected+','+this.hourSelected+','+' , ,' + this.global.clef)
      }
      else{
        let startSplit: string[] = this.range.value.start.toLocaleString().split(" ");
        let startDateSplit: string[]= startSplit[0].split("/");
        let sendStart: string = startDateSplit[2] +"-"+startDateSplit[1]+"-"+startDateSplit[0];
        let endSplit: string[] = this.range.value.end.toLocaleString().split(" ");
        let endDateSplit: string[]= endSplit[0].split("/");
        let sendEnd: string = endDateSplit[2] +"-"+endDateSplit[1]+"-"+endDateSplit[0];
        console.log("deb: "+sendStart+" 00:00:00     end: "+sendEnd+" 24:00:00")
        this.global.wsCarbonHistory.send(this.citySelected+','+this.hourSelected+','+sendStart+' 00:00:00,'+sendEnd+' 24:00:00,' + this.global.clef)
      }
      console.log("demande carbon");
    }
  }

  appelRoute(): void{
    if (this.global.wsCarbonHistory.readyState == WebSocket.OPEN && this.global.ws2CarbonHistory.readyState == WebSocket.OPEN) {
      this.global.wsCarbonHistory.send('Amiens,1, , ,' + this.global.clef)
      console.log("demande carbon");
    }
    else{
      setTimeout(()=>{
        this.appelRoute();
      },500)
    }
  }
}

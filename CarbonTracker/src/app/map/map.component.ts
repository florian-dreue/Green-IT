import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialiser l'instance ECharts
    // @ts-ignore
    const chart = echarts.init(document.getElementById('geoMap'));

    // Charger les données GeoJSON de la carte de la France
    fetch('assets/regions.geojson')
      .then(response => response.json())
      .then(geoJson => {
        // Filtrer les entités correspondant aux DROM-COM
        const featuresSansDOMCOM = geoJson.features.filter((feature: { properties: any; }) => {
          const properties = feature.properties;
          console.log("propriété: "+properties.nom)
          // Ajoutez ici la condition pour filtrer les DROM-COM
          return properties && properties.nom !== "Guadeloupe" && properties.nom !== "Martinique" && properties.nom !== "Guyane" && properties.nom !== "La Réunion" && properties.nom !== "Mayotte"; // Exemple de condition, adaptez selon vos besoins
        });

        // Remplacez les anciennes fonctionnalités par les nouvelles sans les DROM-COM
        geoJson.features = featuresSansDOMCOM;

        // Configurer l'option de la carte
        const option = {
          visualMap: {
            left: 'right',
            min: 0,
            max: 10,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            },
            text: ['High', 'Low'],
            calculable: true
          },
          series: [
            {
              type: 'map',
              map: 'france',
              roam: true,
              data: [
                {name: "Normandie", value:1},
                {name: "Auvergne-Rhône-Alpes", value:2},
                {name: "Bourgogne-Franche-Comté", value:3},
                {name: "Bretagne", value:4},
                {name: "Centre-Val de Loire", value:5},
                {name: "Corse", value:6},
                {name: "Grand Est", value:7},
                {name: "Hauts-de-France", value:8},
                {name: "Île-de-France", value:9},
                {name: "Nouvelle-Aquitaine", value:10},
                {name: "Occitanie", value:3},
                {name: "Pays de la Loire", value:7},
                {name: "Provence-Alpes-Côte d'Azur", value:5},
              ],
              itemStyle: {
                normal: {
                  borderColor: '#fff', // Ajoutez cette propriété pour éviter que les régions ne se superposent
                  borderWidth: 1 // Ajoutez cette propriété pour éviter que les régions ne se superposent
                }
              }
            }
          ]
        };

        // Enregistrez la carte de la France dans ECharts
        echarts.registerMap('france', geoJson ,{});

        // Appliquer l'option à l'instance ECharts
        chart.setOption(option);
      });
  }

}

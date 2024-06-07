import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { CarbonIntensityComponent } from "./carbon-intensity/carbon-intensity.component";
import { RequestPowerComponent } from "./request-power/request-power.component";
import { SeuilComponent } from "./seuil/seuil.component";
import { AlertesComponent } from "./alertes/alertes.component";

const routes: Routes = [
  {path: "map",component: MapComponent},
  {path: "carbonIntensity",component: CarbonIntensityComponent},
  {path: "requestPower",component: RequestPowerComponent},
  {path: "seuil",component: SeuilComponent},
  {path: "alertes",component: AlertesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})

export class AppRoutingModule {}

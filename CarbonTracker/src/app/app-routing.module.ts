import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { CarbonIntensityComponent } from "./carbon-intensity/carbon-intensity.component";
import { RequestPowerComponent } from "./request-power/request-power.component";

const routes: Routes = [
  {path: "map",component: MapComponent},
  {path: "carbonIntensity",component: CarbonIntensityComponent},
  {path: "requestPower",component: RequestPowerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})

export class AppRoutingModule {}

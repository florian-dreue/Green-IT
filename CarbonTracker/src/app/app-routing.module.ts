import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { CarbonIntensityComponent } from "./carbon-intensity/carbon-intensity.component";

const routes: Routes = [
  {path: "map",component: MapComponent},
  {path: "carbonIntensity",component: CarbonIntensityComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})

export class AppRoutingModule {}

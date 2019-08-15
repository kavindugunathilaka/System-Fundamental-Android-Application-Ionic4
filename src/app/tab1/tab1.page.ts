import { Component, OnInit } from '@angular/core';
import {  ToastController,
  IonSpinner,
  Platform,
  LoadingController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  GoogleMapsAnimation,
  MyLocation,
  Marker,
  Environment,
  ILatLng,
  BaseArrayClass } from '@ionic-native/google-maps';

import { Locate, LocationService } from '../services/location.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  map: GoogleMap;
  loading: any;
  locateDatas: Locate[];
  dubList = [];
  points = [];

  constructor(
    private locateService: LocationService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private googleMaps: GoogleMaps
  ) {}

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: "lines"
    });
    await this.loading.present();
    await this.locateService.getLocates().subscribe( rslt => {
      for (let locate of rslt) {
        let latValue = locate.glatitude;
        let lngValue = locate.glongitude;
        let descValue = locate.description;
        this.points.push(
          {
            position: {lat: latValue, lng: lngValue},
            title: descValue,
            iconData: "blue"
          }
        );
      }
       this.platform.ready();
       this.loadMap();
  
    });
  }

  getLocations() {
    this.locateService.getLocates().subscribe( rslt => {

      for (let locate of rslt) {
        let latValue = locate.glatitude;
        let lngValue = locate.glongitude;
        let descValue = locate.description;
        this.points.push(
          {
            position: {lat: latValue, lng: lngValue},
            title: descValue,
            iconData: "blue"
          }
        );
      }
    });
  }

  loadMap() {
    let POINTS: BaseArrayClass<any> = new BaseArrayClass<any>(this.points);

    let bounds: ILatLng[] = POINTS.map((data: any, idx: number) => {
      console.log(data);
      return data.position;
    });

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: bounds
      }
    });

    this.loading.dismiss();

    POINTS.forEach((data: any) => {
      data.disableAutoPan = true;
      let marker: Marker = this.map.addMarkerSync(data);
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(this.onMarkerClick);
      marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(this.onMarkerClick);
    });

  }

  onMarkerClick(params: any) {
    let marker: Marker = <Marker>params[1];
    let iconData: any = marker.get('iconData');
    marker.setIcon(iconData);
  }
  

}

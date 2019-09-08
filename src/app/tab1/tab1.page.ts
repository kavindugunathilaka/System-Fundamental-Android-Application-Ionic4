import { Component, OnInit } from '@angular/core';
import {
  ToastController,
  IonSpinner,
  Platform,
  LoadingController,
  PopoverController } from '@ionic/angular';
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
// import {} from 

import { Locate, LocationService } from '../services/location.service';
import { LocationPopoverPage } from '../pages/location-popover/location-popover.page';

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
  noDataRecord = false;
  isTracking: Boolean = false;

  constructor(
    private popoverCtrl: PopoverController,
    private locateService: LocationService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private googleMaps: GoogleMaps
  ) {}

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'lines'
    });
    await this.loading.present();
    await this.locateService.getLocates().subscribe( rslt => {
      if (rslt.length <= 0 ) { this.noDataRecord = true; }

      for (const locate of rslt) {
        const latValue = locate.glatitude;
        const lngValue = locate.glongitude;
        const descValue = locate.description;
        const imgs = locate.imgsrc;
        const locatId = locate.id;
        let num = 0;
        this.points.push(
          {
              position: {lat: latValue, lng: lngValue},
              // title: locatId,
              title: {image: imgs, id: locatId } ,
              ImgValue: imgs,
              iconData: 'blue',
              IdValue: locatId,
              MarkValue: num++
          }
        );
      }
      this.platform.ready();
      this.loadMap();
      this.loading.dismiss();
    });
    

  }
  startTracking() {
    this.isTracking = true;
  }

  stopTracking() {
    this.isTracking = false;
  }

  loadMap() {
    const POINTS: BaseArrayClass<any> = new BaseArrayClass<any>(this.points);

    const bounds: ILatLng[] = POINTS.map((data: any, idx: number) => {
      console.log(data);
      return data.position;
    });

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: bounds,
        zoom: 10
      }
    });

    this.loading.dismiss();

    POINTS.forEach((data: any) => {
      data.disableAutoPan = true;
      const marker: Marker = this.map.addMarkerSync(data);
      try {
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe( () => {
          this.loading.present();
          const lImg = marker.get('ImgValue');
          const lId = marker.get('IdValue');
          const lNum = marker.get('MarkValue');
          this.popOverTest(lImg, lId, lNum);
        });
      } catch (error) {
        alert('Error : ' + error.message);
      }
    });

  }

  async popOverTest( img: string, id: string, num ) {
    const popover = await this.popoverCtrl.create({
      component: LocationPopoverPage,
      componentProps: {
        location_img: img,
        location_id : id,
        locationMark_num: num
      }
    });
    this.loading.dismiss();
    popover.present();
  }

  doRefresh( event ) {
    setTimeout( () => {
      window.location.reload();
      event.target.complete();
    }, 1000);
  }

}

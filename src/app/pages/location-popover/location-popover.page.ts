import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, NavController } from '@ionic/angular';
import { LocationService, Locate } from 'src/app/services/location.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-location-popover',
  templateUrl: './location-popover.page.html',
  styleUrls: ['./location-popover.page.scss'],
})
export class LocationPopoverPage implements OnInit {

  locationImg = null;
  locationId = null;
  locationData: any;
  imgs = null;
  trash: any;
  nodata = null;
  dataStatusNeg = null;
  resportStatus: string = null;
  testForData: Observable<any>;
  connectionSub: Subscription;
  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private firebaseStorage: AngularFireStorage,
    private locateService: LocationService,
    private navCtrl: NavController
  ) { }

   async ngOnInit() {
    this.locationImg = this.navParams.get('location_img');
    this.locationId = this.navParams.get('location_id');
    this.testForData = await this.locateService.getLocate(this.locationId);
    this.connectionSub = await this.testForData.subscribe((data) => {
      if ( data ) {
        this.dataStatusNeg = false;
        this.imgs = data.imgsrc;
        this.resportStatus = 'data positvie ';
      } else if (this.resportStatus == null) {
        this.dataStatusNeg = true;
        this.resportStatus = 'data neg';
      }
    });
  }

  ionViewDidLeave() {
    this.connectionSub.unsubscribe();
    // window.location.reload();
  }

  cleanTrash() {
    this.locateService.removeLocate(this.locationId)
    .then( () => {
      this.firebaseStorage.storage.refFromURL(this.locationImg).delete();
      this.closePopOver();
    })
    .catch( (err) => {
      alert('Failed to Delete ');
      this.closePopOver();
    });

  }

  closePopOver() {
    this.popoverCtrl.dismiss();
  }
}

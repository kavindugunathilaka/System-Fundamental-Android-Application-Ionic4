import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, NavController } from '@ionic/angular';
import { LocationService, Locate } from 'src/app/services/location.service';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-location-popover',
  templateUrl: './location-popover.page.html',
  styleUrls: ['./location-popover.page.scss'],
})
export class LocationPopoverPage implements OnInit {

  locationImg = null;
  locationId = null;
  locationData: any;
  trash: any;
  nodata = null;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private firebaseStorage: AngularFireStorage,
    private locateService: LocationService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.locationImg = this.navParams.get('location_img');
    this.locationId = this.navParams.get('location_id');
    if (this.locationId === null) {
      this.nodata = 'yes';
    }
  }

  ionViewDidLeave() {
    window.location.reload();
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

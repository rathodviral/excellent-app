import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from '../../../../../node_modules/rxjs';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Utilities } from '../../services/utilities';
import { LocalStorage } from '../../constant/local-storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userProfileForm: FormGroup;
  profileData: any;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService
  ) { }

  private createForm() {
    this.userProfileForm = this.formBuilder.group({
      fullName: ['', []],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', []],
      organization: ['', []],
      city: ['', []]
    });
  }

  private userInfoSubscribe() {
    this.subscription = this.userService.getUserInfoData().subscribe(x => {
      if (!x) {
        this.userProfileForm.reset();
      } else {
        if (!Utilities.isEmptyObj(this.profileData)) {
          this.userProfileForm.setValue(this.profileData);
        }
      }
    });
  }

  ngOnInit() {
    this.userInfoSubscribe();
    this.profileData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
    this.createForm();
    if (!Utilities.isEmptyObj(this.profileData)) {
      this.userProfileForm.setValue(this.profileData);

    }
  }

  profileFormSubmit() {
    const userData = this.userProfileForm.value;

    this.userService.userProfileUpdate(userData).subscribe(data => {
      if (!Utilities.isEmptyObj(data)) {
        // this.commonService.setLocalStorageObject(LocalStorage.UserData, data);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

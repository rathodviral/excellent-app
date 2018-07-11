import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { LocalStorage } from 'src/app/shared/constant/local-storage';
import { UserService } from 'src/app/shared/services/user.service';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  profileData: any;

  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private userService: UserService) { }

  private createForm() {
    this.userProfileForm = this.formBuilder.group({
      fullName: ['', []],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', []],
      organization: ['', []],
      city: ['', []]
    });
  }

  ngOnInit() {
    this.profileData = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'user');
    this.createForm();
    if (!Utilities.isEmptyObj(this.profileData)) {
      this.userProfileForm.setValue(this.profileData);

    }
  }

  profileFormSubmit() {
    const userData = this.userProfileForm.value;
    console.log(userData);

    this.userService.userProfileUpdate(userData).subscribe(data => {
      if (!Utilities.isEmptyObj(data)) {
        // this.commonService.setLocalStorageObject(LocalStorage.UserData, data);
      }
    });
  }

}

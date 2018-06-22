import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AfterViewInit} from "@angular/core";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../modal/user";
import {CommonService} from "../../services/common.service";
import {LocalStorage} from "../../constant/local-storage";
import {Utilities} from "../../services/utilities";

declare var jQuery:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  userLoginForm:FormGroup;
  userRegistrationForm:FormGroup;

  @Output('closeLoginPopup') closeLoginPopup = new EventEmitter<any>();


  constructor(private formBuilder:FormBuilder,
              private userService:UserService,
              private commonService:CommonService) {
  }

  private createForm() {
    this.userLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(10)]]
    });

    this.userRegistrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(10)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      company: ['', Validators.maxLength(80)],
      city: ['', Validators.maxLength(80)]
    });
  }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
  }

  loginFormSubmit() {
    if (this.userLoginForm.valid) {

      const user:FormData = this.commonService.convertObjectToFormData(this.userLoginForm.value);
      this.userService.userLogin(user).subscribe(data => {
        console.log(data);
        if (!Utilities.isEmptyObj(data['token'])) {
          this.commonService.setLocalStorageObject(LocalStorage.UserData, this.commonService.convertObjectInCamelizeKeys(data));
          this.closePopup();

        }
      });
    }
  }

  registrationFormSubmit() {
    if (this.userRegistrationForm.valid) {
      const user:FormData = this.commonService.convertObjectToFormData(this.userRegistrationForm.value);

      this.userService.userRegistration(user).subscribe(data => {
        if (!Utilities.isEmptyObj(data['token'])) {
          this.commonService.setLocalStorageObject(LocalStorage.UserData, this.commonService.convertObjectInCamelizeKeys(data));
          this.closePopup();
        }
      });
    }
  }

  closePopup() {
    this.closeLoginPopup.emit(null);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AfterViewInit } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { UserService } from "../../services/user.service";
import { User } from "../../modal/user";
import { CommonService } from "../../services/common.service";
import { LocalStorage } from "../../constant/local-storage";
import { Utilities } from "../../services/utilities";

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  userLoginForm: FormGroup;
  userRegistrationForm: FormGroup;
  isForgotPasswordShow: boolean;

  @Output('closeLoginPopup') closeLoginPopup = new EventEmitter<any>();


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService
  ) { }

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
    this.isForgotPasswordShow = false;
    this.createForm();
  }

  ngAfterViewInit() { }

  loginFormSubmit() {
    const userData = this.userLoginForm.value;

    if (!Utilities.isEmptyObj(userData['email']) && !Utilities.isEmptyObj(userData['password']) && !this.isForgotPasswordShow) {
      this.userService.userLogin(userData).subscribe(data => {
        if (!Utilities.isEmptyObj(data['token'])) {
          this.commonService.setLocalStorageObject(LocalStorage.UserData, this.commonService.convertObjectInCamelizeKeys(data));
          this.closePopup();
        }
      });
    } else if (!Utilities.isEmptyObj(userData['email']) && Utilities.isEmptyStr(userData['password']) && this.isForgotPasswordShow) {
      const email = { email: userData['email'] };
      this.userService.userForgotPassword(email).subscribe(data => {
        this.closePopup();
      });
    }
  }

  registrationFormSubmit() {
    if (this.userRegistrationForm.valid) {
      // const user: FormData = this.commonService.convertObjectToFormData(this.userRegistrationForm.value);
      const user = this.userRegistrationForm.value;

      this.userService.userRegistration(user).subscribe(data => {
        if (!Utilities.isEmptyObj(data['token'])) {
          this.commonService.setLocalStorageObject(LocalStorage.UserData, this.commonService.convertObjectInCamelizeKeys(data));
          this.closePopup();
        }
      });
    }
  }

  closePopup() {
    this.userLoginForm.reset();
    this.userRegistrationForm.reset();
    this.closeLoginPopup.emit(false);
  }

  changeStateIsForgotPassword() {
    this.isForgotPasswordShow = this.isForgotPasswordShow ? false : true;
    this.userLoginForm.reset();
  }

  ngOnDestroy() {
    this.userLoginForm.reset();
    this.userRegistrationForm.reset();
  }

}

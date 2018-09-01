import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { FilteredData } from "../modal/filtered-data";
import { CommonService } from './common.service';
import { LocalStorage } from '../constant/local-storage';
import { RequestOptions, Headers } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mainUrl: string = `${environment.address}api/buyer/user/`;
  private userInfo = new Subject<any>();


  constructor(private http: HttpClient, private commonService: CommonService, @Optional() @Inject(APP_BASE_HREF) origin: string) { }

  userRegistration(user: any): Observable<any> {
    // const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.mainUrl}registration`;
    // const options = {params: {params:param}};
    return this.http.post<any>(url, user)
      .pipe(
        tap(data => console.log('Register Successfully')),
        catchError(this.handleError<any>('Register', { "status": false, "message": "Register Error" }))
      );
  }

  userLogin(user: any): Observable<any> {
    // const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.mainUrl}login`;
    // const options = {params: {params:param}};
    return this.http.post<any>(url, user)
      .pipe(
        tap(data => console.log('Login Successfully')),
        catchError(this.handleError<any>('Login', { "status": false, "message": "Login Error" }))
      );
  }

  userForgotPassword(email: any): Observable<any> {
    // const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.mainUrl}password_forgot`;
    // const options = {params: {params:param}};
    return this.http.post<any>(url, email)
      .pipe(
        tap(data => console.log('Forgot Password Successfully')),
        catchError(this.handleError<any>('Forgot Password', { "status": false, "message": "Forgot Password Error" }))
      );
  }

  userResetPassword(user: any): Observable<any> {
    // const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.mainUrl}password_reset`;
    // const options = {params: {params:param}};
    return this.http.post<any>(url, user)
      .pipe(
        tap(data => console.log('Reset Password Successfully')),
        catchError(this.handleError<any>('Reset Password', { "status": false, "message": "Reset Password Error" }))
      );
  }

  userProfileUpdate(userData): Observable<any> {
    const token = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token');
    const url = `${this.mainUrl}profile_update`;
    // const options = { headers: { 'x-access-token': token } };
    const options = {
      headers: new HttpHeaders({
        'x-access-token': token
      })
    };

    return this.http.post<any>(url, userData, options)
      .pipe(
        tap(data => console.log('Profile Update Successfully')),
        catchError(this.handleError<any>('Profile Update Error', { status: false, message: 'Profile Update Error' }))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }


  sendUserInfoData(data: any) {
    this.userInfo.next(data);
  }

  clearUserInfoData() {
    this.userInfo.next();
  }

  getUserInfoData(): Observable<any> {
    return this.userInfo.asObservable();
  }
}

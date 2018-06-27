import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { FilteredData } from "../modal/filtered-data";
import { CommonService } from './common.service';
import { LocalStorage } from '../constant/local-storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  mainUrl: string = `${environment.address}api/buyer/user/`;

  constructor(private http: HttpClient, private commonService: CommonService) { }

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

  userProfile(): Observable<any> {
    const token = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token');
    const url = `${this.mainUrl}profile`;
    const options = { headers: { ' x-access-token': token } };
    return this.http.get<any>(url, options)
      .pipe(
        tap(data => console.log('Login Successfully')),
        catchError(this.handleError<any>('Login Error', { status: false, message: 'Login Error' }))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}

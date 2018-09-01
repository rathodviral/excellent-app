import { Injectable, Optional, Inject } from '@angular/core';
import { Filters } from "../shared/modal/filters";
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { FilteredData } from "../shared/modal/filtered-data";
import { CommonService } from '../shared/services/common.service';
import { LocalStorage } from '../shared/constant/local-storage';
import { APP_BASE_HREF } from '@angular/common';

@Injectable()
export class ServicesService {
  dataUrl = `${environment.address}api/buyer/media/`;
  filterUrl = `${environment.address}api/buyer/filters/`;
  locationUrl = `${environment.address}api/buyer/location/search`;
  cartUrl = `${environment.address}api/buyer/campaign/save`;
  mediaUrl = `${environment.address}api/buyer/mediadetail/`;
  private subject = new Subject<any>();


  constructor(private http: HttpClient, private commonService: CommonService, @Optional() @Inject(APP_BASE_HREF) origin: string) {
  }

  getFilteredData(page: string, param: any): Observable<FilteredData[]> {
    const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.dataUrl}${page}?params=${options}`;
    // const options = {params: {params:param}};
    return this.http.get<FilteredData[]>(url)
      .pipe(
        tap(data => console.log('Media Data')),
        catchError(this.handleError<any>('MediaData', { status: false, message: 'No media were found' }))
      );
  }

  getFilters(page: string): Observable<any> {
    const url = `${this.filterUrl}${page}`;
    return this.http.get<Filters[]>(url)
      .pipe(
        tap(data => console.log('Filter Data')),
        catchError(this.handleError<Filters[]>('Filters', []))
      );
  }

  getFilteredDataLocationBase(param: any): Observable<any[]> {
    const options = { params: param };
    return this.http.get<Location[]>(this.locationUrl, options)
      .pipe(
        tap(data => console.log('Location Data')),
        catchError(this.handleError<Location[]>('LocationData', []))
      );
  }

  saveCart(cart): Observable<any> {
    const cartData = { campaign: cart };
    const token = this.commonService.getDataFromLocalStorageObject(LocalStorage.UserData, 'token');
    const options = {
      headers: new HttpHeaders({
        'x-access-token': token
      })
    };
    return this.http.post<any>(this.cartUrl, cartData, options)
      .pipe(
        tap(data => console.log('Cart Save Successfully')),
        catchError(this.handleError<any>('Cart Save Error', { status: false, message: 'Cart Save Error' }))
      );
  }

  getMediaDetail(page: string, alias: string): Observable<FilteredData[]> {
    const url = `${this.mediaUrl}${page}/${alias}`;
    // const options = {params: {params:param}};
    return this.http.get<FilteredData[]>(url)
      .pipe(
        tap(data => console.log('Media Data')),
        catchError(this.handleError<any>('MediaData', { status: false, message: 'No media were found' }))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  sendCartData(data: any) {
    this.subject.next(data);
  }

  clearCartData() {
    this.subject.next();
  }

  getCartData(): Observable<any> {
    return this.subject.asObservable();
  }
}

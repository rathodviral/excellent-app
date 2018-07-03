import { Injectable } from '@angular/core';
import { Filters } from "../shared/modal/filters";
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { LocationFilter, Params } from "../shared/modal/filter-params";
import { FilteredData } from "../shared/modal/filtered-data";

@Injectable()
export class ServicesService {
  dataUrl: string = `${environment.address}api/buyer/media/`;
  filterUrl: string = `${environment.address}api/buyer/filters/`;
  locationUrl: string = `${environment.address}api/buyer/location/search`;
  private subject = new Subject<any>();


  constructor(private http: HttpClient) {
  }

  getFilteredData(page: string, param: any): Observable<FilteredData[]> {
    const options = encodeURIComponent(JSON.stringify(param));
    const url = `${this.dataUrl}${page}?params=${options}`;
    // const options = {params: {params:param}};
    return this.http.get<FilteredData[]>(url)
      .pipe(
        tap(data => console.log('Media Data')),
        catchError(this.handleError<any>('MediaData', { "status": false, "message": "No media were found" }))
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
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

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ServicesService } from "../services.service";

@Injectable()
export class MediaDetailResolver implements Resolve<any> {

    constructor(private servicesService: ServicesService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.servicesService.getMediaDetail('radio', route.params['alias']);
    }
}

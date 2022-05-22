import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {AdminApiService} from "../../../../../@core/abstracts/admin-api.service";
import {User} from "../user.model";

@Injectable()
export class UserViewService extends AdminApiService implements Resolve<any> {
  public rows: any;
  public onUserViewChanged: BehaviorSubject<any>;
  public id;
  public model = User;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    // Set the defaults
    this.onUserViewChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let currentId = route.paramMap.get('id');
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData(currentId)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getApiData(id: string): Promise<any[]> {
    const url = `${this.apiUrl}/user/${id}`;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        this.rows = response;
        this.onUserViewChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}

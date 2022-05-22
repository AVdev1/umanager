import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {User} from "../user.model";
import {AdminApiService} from "../../../../../@core/abstracts/admin-api.service";

@Injectable()
export class UserNewService extends AdminApiService implements Resolve<any> {
  public apiData: any;
  public onUserNewChanged: BehaviorSubject<any>;
  public model = User;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    // Set the defaults
    this.onUserNewChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get API Data
   */
  getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/users-data').subscribe((response: any) => {
        this.apiData = response;
        this.onUserNewChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }


  //TODO: create model
  /**
   * Create new user
   * @param user
   */
  createUser(user: any): Observable<User> {
    const url = `${this.apiUrl}/user`;

    return this.http.post<User>(url, user);
  }
}

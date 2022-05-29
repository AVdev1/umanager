import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {AdminApiService} from "../../../../../@core/abstracts/admin-api.service";
import {User} from "../user.model";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class UserListService extends AdminApiService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public model = User;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, public _toastrService: ToastrService) {
    super(_httpClient);
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
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
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  // const url = `${this.apiUrl}/user`;
  //
  // return this.http.post<User>(url, user);

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/user`).subscribe((response: any) => {
        this.rows = this.model.fromJsonArray(response.items);
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  // getListItems(params): Observable<any> {
  //   let data = convertToFilter(params);
  //
  //   return this.http.get(`${this.apiUrl}/user`, { params: data }).pipe(
  //       map((response: any) => {
  //         const list: any = {};
  //         list.data = this.model.fromJsonArray(response.items);
  //         list.meta = response.meta;
  //         return list;
  //       }),
  //   );
  // };
}

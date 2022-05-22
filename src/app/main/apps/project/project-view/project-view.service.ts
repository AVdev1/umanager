import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {AdminApiService} from "../../../../../@core/abstracts/admin-api.service";
import {Project} from "../project.model";

@Injectable()
export class ProjectViewService extends AdminApiService implements Resolve<any> {
  public rows: any;
  public onProjectViewChanged: BehaviorSubject<any>;
  public id;
  public model = Project;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    // Set the defaults
    this.onProjectViewChanged = new BehaviorSubject({});
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
    const url = `${this.apiUrl}/project/${id}`;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        this.rows = response;
        this.onProjectViewChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}

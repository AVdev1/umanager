import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {Project} from "../project.model";
import {AdminApiService} from "../../../../../@core/abstracts/admin-api.service";
import {ProjectCategoryModel} from "../project-category.model";
import {User} from "../../user/user.model";

@Injectable()
export class ProjectNewService extends AdminApiService implements Resolve<any> {
  public apiData: any;
  public categoryList: any;
  public onProjectNewChanged: BehaviorSubject<any>;
  public model = Project;
  public userList: User[];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    // Set the defaults
    this.onProjectNewChanged = new BehaviorSubject({});
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
      Promise.all([this.getApiData(), this.getProjectCategory('project_category'), this.getUserList()]).then(() => {
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
        this.onProjectNewChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }


  //TODO: create model
  /**
   * Create new project
   * @param project
   */
  createProject(project: any): Observable<Project> {
    const url = `${this.apiUrl}/project`;

    return this.http.post<Project>(url, project);
  }

  /**
   * Get project categories list
   * @param category
   */
  getProjectCategory(category: string): Promise<ProjectCategoryModel> {
    const url = `${this.apiUrl}/catalog/${category}`;

    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/catalog/${category}`).subscribe((response: any) => {
        this.categoryList = response;
        resolve(this.categoryList)
      }, reject);
    })
  }

  /**
   * Get rows
   */
  getUserList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/user`).subscribe((response: any) => {
        this.userList = this.model.fromJsonArray(response.items);
        resolve(this.userList);
      }, reject);
    });
  }
}

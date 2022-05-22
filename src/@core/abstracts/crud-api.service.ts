import { Injectable } from "@angular/core";
import {AdminApiService} from "./admin-api.service";

@Injectable({
  providedIn: "root",
})
export abstract class CrudApiService extends AdminApiService {

  protected model: any;

  // getList(params): Observable<{ data: any[], total: number }> {

  //     const httpParams = {};
  //     Object.keys(params.filter).forEach(key => {
  //         httpParams[`filter[${key}]`] = params.filter[key];
  //     });

  //     return this.http.get(`${this.apiUrl}/${this.model.name.toLowerCase()}/`, { params: httpParams }).pipe(
  //         map((response: any) => {
  //             const list: any = {};
  //             list.data = this.model.fromJsonArray(response.data);
  //             list.total = response.meta.total;
  //             return list;
  //         })
  //     );
  // };

  // getListData(params): Observable<{ data: any[], meta: [] }> {

  //     const httpParams = {};

  //     let data = convertToFilter(params);

  //     return this.http.get(`${this.apiUrl}/${this.model.name.toLowerCase()}`, { params: data }).pipe(
  //         map((response: any) => {
  //             const list: any = {};
  //             list.data = this.model.fromJsonArray(response.items);
  //             list.meta = response.meta;
  //             return list;
  //         })
  //     );
  // };

  // getListOrganizations(params): Observable<{ data: any[], total: number }> {

  //     const httpParams = {};
  //     Object.keys(params.filter).forEach(key => {
  //         httpParams[`filter[${key}]`] = params.filter[key];
  //     });

  //     return this.http.get(`${this.apiUrl}/${this.model.name.toLowerCase()}/`, { params: httpParams }).pipe(
  //         map((response: any) => {
  //             const list: any = {};
  //             list.data = this.model.fromJsonArray(response);
  //             list.total = response.length;
  //             return list;
  //         })
  //     );
  // };
}

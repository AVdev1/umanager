import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: "root",
})
export abstract class AdminApiService extends ApiService {
  constructor(protected http: HttpClient) {
    super(http);
    this.apiUrl = `${this.apiUrl}`;
  }
}

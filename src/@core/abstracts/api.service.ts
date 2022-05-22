import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export abstract class ApiService {
  // protected apiUrl = environment.api.baseUrl + '/api';
  protected apiUrl = environment.api.baseUrl;

  constructor(protected http: HttpClient) {}
}

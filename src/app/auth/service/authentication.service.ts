import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import {AdminApiService} from "../../../@core/abstracts/admin-api.service";
import jwt_decode from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends AdminApiService {
  //public
  public currentUser: Observable<User>;
  public model = User;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    super(_http);
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));

    this.currentUser = this.currentUserSubject.asObservable();

  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Returns the current user
   */
  getCurrentUser() {
    const request = window.localStorage.getItem('currentUser')

    console.log('CURR USER', request)
    return request;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserData', JSON.stringify(jwt_decode(user.token, {header: false})));

            // Display welcome toast!
            const cu =  JSON.parse(window.localStorage.getItem('currentUserData'));
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                  'user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + cu?.name + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserData');
    // notify
    this.currentUserSubject.next(null);
  }
}

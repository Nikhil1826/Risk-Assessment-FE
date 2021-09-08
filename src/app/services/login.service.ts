import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as url from '../../assets/config.json';
import { Login } from '../models/login';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseURL: any = url;
  adminSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.baseURL = this.baseURL.default.baseURL;
  }

  authenticateUser(login: Login): Observable<User> {
    return this.http.post<User>(this.baseURL + 'user/authenticate', login);
  }
}

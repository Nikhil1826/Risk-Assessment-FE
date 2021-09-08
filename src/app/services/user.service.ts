import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as url from '../../assets/config.json';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseURL: any = url;

  constructor(private http: HttpClient) {
    this.baseURL = this.baseURL.default.baseURL;
  }

  getAllUsers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + 'user/getAll/' + userId);
  }

  getUserById(loggedInUserId: number, userId: number): Observable<User> {
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('loggedInUserId', loggedInUserId.toString());
    queryParams = queryParams.append('userId', userId.toString());
    return this.http.get<User>(this.baseURL + 'user/get', {
      params: queryParams
    });
  }

}

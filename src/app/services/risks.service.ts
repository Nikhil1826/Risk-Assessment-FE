import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssessmentRequest } from '../models/AssessmentRequest';
import { UserAssignedRisks } from '../models/UserAssignedRisks';
import * as url from '../../assets/config.json';
import { Risk } from '../models/Risk';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root'
})
export class RisksService {
  baseURL: any = url;

  constructor(private http: HttpClient) {
    this.baseURL = this.baseURL.default.baseURL;
  }

  getRisksAssignedToUser(userId: number): Observable<UserAssignedRisks[]> {
    return this.http.get<UserAssignedRisks[]>(this.baseURL + 'risk/getRisks/' + userId);
  }

  assessRisk(assessmentRequest: AssessmentRequest): Observable<any> {
    return this.http.post(this.baseURL + 'risk/assess', assessmentRequest);
  }

  getAllRisks(userId: number): Observable<Risk[]> {
    return this.http.get<Risk[]>(this.baseURL + 'risk/getAll/' + userId);
  }

  addRisk(risk: Risk, loggedInUserId: number): Observable<Response> {
    return this.http.post<Response>(this.baseURL + 'risk/add/' + loggedInUserId, risk);
  }

  updateRisk(risk: Risk, loggedInUserId: number): Observable<Response> {
    return this.http.put<Response>(this.baseURL + 'risk/update/' + loggedInUserId, risk);
  }

  deleteRisk(riskId: number, loggedInUserId: number): Observable<Response> {
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('riskId', riskId.toString());
    queryParams = queryParams.append('userId', loggedInUserId.toString());
    return this.http.delete<Response>(this.baseURL + 'risk/delete', {
      params: queryParams
    });
  }
}

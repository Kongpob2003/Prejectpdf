import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  constructor(private constants : Constants, private http: HttpClient) {}

  public async login(body:any){
    const url = this.constants.API_ENDPOINT + 'login';
    const response = await lastValueFrom(this.http.post(url,body));
    return response;
  }
}

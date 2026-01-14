import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { lastValueFrom } from 'rxjs';
import { DocumentItemPos } from '../../../model/document_Item_pos';

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

  public async GetFile(){
    const url = this.constants.API_ENDPOINT + 'document/getAll';
    const response = await lastValueFrom(this.http.get(url));
    return response as DocumentItemPos[];
  }
}

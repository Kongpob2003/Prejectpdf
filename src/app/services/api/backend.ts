import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { lastValueFrom } from 'rxjs';
import { DocumentItemPos } from '../../../model/document_Item_pos';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  constructor(private constants: Constants, private http: HttpClient) {}

  // Login
  public async login(body: any) {
    const url = this.constants.API_ENDPOINT + 'login';
    const response = await lastValueFrom(this.http.post(url, body));
    return response;
  }

  // ดึงรายการไฟล์ทั้งหมด
  public async GetFile() {
    const url = this.constants.API_ENDPOINT + 'document/getAll';
    const response = await lastValueFrom(this.http.get(url));
    return response as DocumentItemPos[];
  }

  // อัปโหลดไฟล์
  public async Upload_File(formData: FormData) {
    const url = this.constants.API_ENDPOINT + 'document/upload';
    const response = await lastValueFrom(this.http.post(url, formData));
    return response;
  }

  // ลบไฟล์
  public async DeleteFile(documentId: number) {
    const url = this.constants.API_ENDPOINT + `document/${documentId}`;
    const response = await lastValueFrom(this.http.delete(url));
    return response;
  }

  // ดึงไฟล์เฉพาะ ID
  public async GetFileById(documentId: number) {
    const url = this.constants.API_ENDPOINT + `document/getDoc/${documentId}`;
    const response = await lastValueFrom(this.http.get(url));
    return response;
  }

  // ส่งเอกสารให้อาจารย์
  public async SendDocument(userId: number, fileId: number) {
    const url = this.constants.API_ENDPOINT + `document/docSend/${userId}`;
    const body = { file_id: fileId };
    const response = await lastValueFrom(this.http.post(url, body));
    return response;
  }
}
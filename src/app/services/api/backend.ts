import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { lastValueFrom } from 'rxjs';

import { BoardItemPos } from '../../../model/board_Item_pos';
import { DocumentItemPos } from '../../../model/document_Item_pos';
import { UserLoginRes } from '../../../model/response';


@Injectable({
  providedIn: 'root',
})
export class Backend {
  SendToTeacher(did: any, selectedTeachers: string[], selectedCategory: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private constants: Constants, private http: HttpClient) {}

  // Login
  public async login(body: any) {
    const url = this.constants.API_ENDPOINT + 'login';
    const response = await lastValueFrom(this.http.post(url, body));
    return response;
  }

  // ดึงรายการไฟล์ทั้งหมด + ไม่มี board
  public async GetFile() {
    const url = this.constants.API_ENDPOINT + 'document/noBoard';
    const response = await lastValueFrom(this.http.get(url));
    return response as DocumentItemPos[];
  }

  // ดึงรายการไฟล์ทั้งหมด
  public async GetFileBoard() {
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

  // แก้ไขข้อมูลผู้ใช้
  public async EditUser(body:any,id:Number){
    const url = this.constants.API_ENDPOINT + 'update/' + id;
    const response = await lastValueFrom(this.http.put(url,body));
    return response;
  }

  // แสดงผู้ใช้ทั้งหมด
  public async GetUser(){
    const url = this.constants.API_ENDPOINT + 'professor';
    const response = await lastValueFrom(this.http.get(url));
    return response as UserLoginRes[];
  }

  // ลบผู้ใช้
  public async DeleteUser(uid:Number){
    const url = this.constants.API_ENDPOINT + 'delete/' + uid;
    const response = await lastValueFrom(this.http.delete(url));
    return response;
  }

  // เพิ่มผู้ใช้
  public async AddUser(body:any){
    const url = this.constants.API_ENDPOINT + 'add';
    const response = await lastValueFrom(this.http.post(url,body));
    return response;
  }

  // แสดง board ทั้งหมด
  public async GetBoard(){
    const url = this.constants.API_ENDPOINT + 'board';
    const response = await lastValueFrom(this.http.get(url));
    return response as BoardItemPos[];
  }

  // add board 
  public async AddBoard(formData :any){
    const url = this.constants.API_ENDPOINT + 'board';
    const response = await lastValueFrom(this.http.post(url,formData));
    return response;
  }

  // delete board
  public async DeleteBoard(id :any){
    const url = this.constants.API_ENDPOINT + 'board/' + id;
    const response = await lastValueFrom(this.http.delete(url));
    return response;
  };
  
  //แสดงข้อมูล file เดียว
  public async getDocID(id : any){
    const url = this.constants.API_ENDPOINT + 'getDoc/' + id;
    const response = await lastValueFrom(this.http.get(url));
    return response;
  }

   //แสดงข้อมูล category
  public async getCategory(){
    const url = this.constants.API_ENDPOINT + 'folder/' ; 
    const response = await lastValueFrom(this.http.get(url));
    return response;
  }
  
  //ส่งข้อมูลเอกสาร
  public async sendTeacher(body:any){
    const url = this.constants.API_ENDPOINT + 'folder/sendToTeachers';
    const response = await lastValueFrom(this.http.post(url,body));
    return response;
  }
  
  ///////////////////////////////////////////////////////////////////////////
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

  //

}
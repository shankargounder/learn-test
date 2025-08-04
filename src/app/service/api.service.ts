import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private tests: any[] = [];
  private lastResult: any = null;
  //private baseUrl = "http://localhost:3000"
  constructor(private http: HttpClient){}
  sendQuery(query: string): Observable<any> {
    //return this.http.post('/chat', { query });
    return this.http.post(`/chat`, { query });
  }

  // sendMessage(data: any): Observable<any> {
  //   console.log(data);
  //   return this.http.post('http://localhost:3000/send-message', {data});
  // }

  createTest(testData: any) {
    return this.http.post(`createTests`, testData);
  }

  getAllTests() {
    return this.http.get(`getTest`);
  }

  getFromPython() {
    return this.http.get(`callFromPython`);
  }
  
}
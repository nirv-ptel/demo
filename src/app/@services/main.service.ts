import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private baseUrl: string = environment.apiUrl;
  AUTH_TOKEN: string = 'auth_token';

  constructor(private httpClient: HttpClient) { }

  get(url: string, params?: any): Observable<any> {
    const data = { params, header: this.getAuthHeader() };
    return this.httpClient.get(this.baseUrl + url, data).pipe(catchError(this.errorHeadler.bind(this)));
  }

  // post(url: string, data: any): Observable<any> {
  //   const headers = this.getAuthHeader();
  //   return this.httpClient.post(this.baseUrl + url, data, { headers }).pipe(catchError(this.errorHeadler.bind(this)));
  // }

  post(url: string, data: any, imageFile?: File): Observable<any> {
    const headers = this.getAuthHeader();
    if (imageFile) {
      return this.uploadImage(imageFile).pipe(
        switchMap((base64Image: string) => {
          data.photo = base64Image;
          return this.httpClient.post(this.baseUrl + url, data, { headers });
        })
      );
    } else {
      return this.httpClient.post(this.baseUrl + url, data, { headers });
    }
  }

  delete(url: string): Observable<any> {
    const headers = this.getAuthHeader();
    return this.httpClient.delete(this.baseUrl + url, { headers }).pipe(catchError(this.errorHeadler.bind(this)));
  }

  patch(url: string, data: any, imageFile?: File): Observable<any> {
    const headers = this.getAuthHeader();
    if (imageFile) {
      return this.uploadImage(imageFile).pipe(
        switchMap((base64Image: string) => {
          data.photo = base64Image;
          return this.httpClient.patch(this.baseUrl + url, data, { headers });
        })
      );
    } else {
      return this.httpClient.patch(this.baseUrl + url, data, { headers });
    }  }

  private uploadImage(imageFile: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        observer.next(base64Image);
        observer.complete();
      };
      reader.readAsDataURL(imageFile);
    });
  }

  private errorHeadler(responce: any) {
    const error = responce.error;
    const keys = Object.keys(error);
    let message = error[keys[0]];
    if (responce.status === 401) {
      // auth token delete
      // redirect login page
    }
    if (error[keys[0]] instanceof Array) {
      message = error[keys[0]][0];
    }
    if (keys[0] === 'isTrusted') {

    } else {
      message = keys[0] + ' : ' + message;
    }

    return throwError({ messages: message, error: error })
  }

  private getAuthHeader(): { [header: string]: string | string[] } {
    return {
      Authorization: `Bearer ${localStorage.getItem(this.AUTH_TOKEN)}`
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from './main.service';
import { User } from '../@models/users';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _mainService: MainService) { }

  getAllUser(): Observable<User[]> {
    return this._mainService.get('users').pipe(map((data: User[]) => data as User[]));
  }

  getByIdUser(userId: number): Observable<User> {
    return this._mainService.get(`users/${userId}`).pipe(map((data: User) => data as User));
  }

  createUser(user: User, imageFile?: File): Observable<User> {
    return this._mainService.post('users', user, imageFile);
  }

  deleteUser(userId: number): Observable<any> {
    return this._mainService.delete(`users/${userId}`);
  }

  updateUser(userId: number, user: User, imageFile?: File): Observable<User> {
    return this._mainService.patch(`users/${userId}`, user, imageFile);
  }

}

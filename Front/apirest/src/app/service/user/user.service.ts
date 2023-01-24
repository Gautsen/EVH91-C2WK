import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from 'src/app/Model/Address';
import { User } from 'src/app/Model/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiURL;

  constructor(
    private http: HttpClient
  ) { }

  GetUserInfo() {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  //Pour récupèrer tous les utilisateurs
  GetUsers(){
    return this.http.get<User>(`${this.apiUrl}/users`)
  }


}


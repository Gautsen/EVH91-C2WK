import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL;

  optionRequete = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),// responseType: 'text' as 'json'
  };

public user: Observable<string>;
public userSubject: BehaviorSubject<string>;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    this.userSubject = new BehaviorSubject<string>(localStorage.getItem('token') || '');
    this.user = this.userSubject.asObservable();
  }
  login(username: string, password: string, email: string, adresse: string, postalCode: string, city: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      username: username,
      password: password,
      email : email,
      adresse : adresse,
      postalCode : postalCode,
      city : city
      
    }, this.optionRequete).pipe(
      tap((user: any) => {
        console.log(user);
        this.userSubject.next(user);
      })
    )
  }

  register(username: string, password: string, email: string, adresse: string, postalCode: string, city: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      username: username,
      password: password,
      email : email,
      adresse : adresse,
      postalCode : postalCode,
      city : city,

    }, this.optionRequete);

  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next('');
    this.router.navigate(['/login'])
  }
}


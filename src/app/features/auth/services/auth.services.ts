/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { API_URL } from '@env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${API_URL}/auth/login`, credentials).pipe(
      map(response => {
        if (response.error) {
          return false; //to-do
        }

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('bearer', response.access_token);
        }

        this.currentUserSubject.next(response.data);

        return response.data;
      })
    );
  }

  register(user: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  }) {
    return this.http.post(`${API_URL}/auth/register`, user).pipe(
      map(response => {
        console.log(response);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('bearer');
    }
    this.currentUserSubject.next(null);
  }
}

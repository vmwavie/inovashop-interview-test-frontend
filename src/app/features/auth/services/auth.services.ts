/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
          return false;
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
    email: string;
    password: string;
    confirm_password: string;
  }) {
    return this.http.post<any>(`${API_URL}/auth/register`, user).pipe(
      map(response => {
        if (response.error) {
          return response.error;
        }

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('bearer', response.accessToken);
        }

        return response.data;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('bearer')
      : null;

    const user = this.getUserFromStorage();

    if (!token || !user || !user.id) {
      return of(false);
    }

    return this.http
      .get<any>(`${API_URL}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: user.id,
        },
      })
      .pipe(
        map(response => {
          if (response.error) {
            this.logout();
            return false;
          }

          if (response && response.data.id === user.id) {
            return true;
          } else {
            this.logout();
            return false;
          }
        }),
        catchError(() => {
          this.logout();
          return of(false);
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

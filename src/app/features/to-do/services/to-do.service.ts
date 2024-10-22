/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  constructor(private http: HttpClient) {}

  getAllTasks(page: number): Observable<any> {
    const body = {
      userId: this.getUserId(),
      page: page,
      perPage: '10',
    };

    const bearerToken = this.getBearerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });

    return this.http.post(`${API_URL}/task/search`, body, { headers });
  }

  deleteTaskById(taskId: number): Observable<any> {
    const body = {
      userId: this.getUserId(),
      taskId: taskId,
    };

    const bearerToken = this.getBearerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });

    return this.http.delete(`${API_URL}/task/`, {
      headers: headers,
      body: body,
    });
  }

  private getUserId(): number | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).id : null;
  }

  private getBearerToken(): string | null {
    return localStorage.getItem('bearer');
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@env';
import { Task } from '../models/task.models';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  constructor(private http: HttpClient) {}

  getAllTasks(page: number, perPage: string): Observable<any> {
    const body = {
      userId: this.getUserId(),
      page: page,
      perPage: perPage,
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

  createTask(title: string, description: string): Observable<any> {
    const body = {
      userId: this.getUserId(),
      title,
      description,
    };

    const bearerToken = this.getBearerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });

    return this.http.post(`${API_URL}/task/`, body, { headers });
  }

  updateTask(task: Task): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, last_updated, showDropdown, ...taskWithoutId } =
      task;

    const body = {
      ...taskWithoutId,
      taskId: id,
    };

    const bearerToken = this.getBearerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    });

    return this.http.put(`${API_URL}/task/`, body, { headers });
  }

  private getUserId(): number | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).id : null;
  }

  private getBearerToken(): string | null {
    return localStorage.getItem('bearer');
  }
}

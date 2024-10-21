/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class TaskWebSocketService {
  private socket: ReturnType<typeof io>;
  private messagesSubject$ = new Subject<unknown>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000', {
      auth: {
        userId: this.getUserId(),
      },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('taskUpdated', (data: unknown) => {
      this.messagesSubject$.next({ data, type: 'taskUpdated' });
    });

    this.socket.on('taskDeleted', (data: unknown) => {
      this.messagesSubject$.next({ data, type: 'taskDeleted' });
    });

    this.socket.on('taskCreated', (data: unknown) => {
      this.messagesSubject$.next({ data, type: 'taskCreated' });
    });
  }

  sendMessage(data: any) {
    this.messagesSubject$.next(data);
  }

  getTasks(): Observable<any> {
    return this.messages$.pipe(share());
  }

  private getUserId(): number | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).id : null;
  }

  close(): void {
    this.socket.disconnect();
  }
}

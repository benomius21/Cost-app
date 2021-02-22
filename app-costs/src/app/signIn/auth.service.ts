import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Baselog } from './base.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
    token: string;
    expiresIn: number
    isToken = new BehaviorSubject<boolean>(false);
    
    constructor(private http: HttpClient) { }

    singUp(email: string, password: string) {
        const acc: Baselog = { email: email, password: password };
        this.http.post<{ error: string, message: string }>('http://localhost:3000/signup', acc)
            .subscribe(resp => {
            })
    }

    logIn(email: string, password: string) {
        const acc: Baselog = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/login', acc)
            .subscribe(resp => {
                if (resp.token) {
                    this.expiresIn = resp.expiresIn;
                    this.token = resp.token;
                    this.isToken.next(true);
                    const date = new Date();
                    const future = new Date(date.getTime() + (this.expiresIn * 1000));
                    this.saveTokenLocal(this.token, future);
                    setTimeout(() => {
                        this.logout();
                    }, this.expiresIn* 1000) ;
                }
            })
    }

    autoLog() {
        
        const localObj = this.getTokenLocal();
      
        if (!localObj) {
            return;
        }
        const now = new Date();
        const future = localObj.expires.getTime() - now.getTime();
        if (future > 0) {
            this.token = localObj.token;
            this.isToken.next(true);
            setTimeout(() => {
                this.logout();
            }, future )
        }
    }

    logout() {
        this.token = null;
        this.isToken.next(false);
        this.removeTokenLocal();
    }

    saveTokenLocal(token: string, expiresIn: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expires', expiresIn.toISOString());
        
    }
    removeTokenLocal() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
    }
    getTokenLocal() {
        const tokenLocal = localStorage.getItem('token');
        const expiresLocal = localStorage.getItem('expires');
        if (!tokenLocal || !expiresLocal) {
            return;
        }
        return {
            token: tokenLocal,
            expires: new Date(expiresLocal)
        }

    }
}
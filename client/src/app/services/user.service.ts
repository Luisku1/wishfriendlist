import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

 @Injectable()
 export class UserService{

    public url: string;
    public identity: any;
    public token: string;
    public stats: any;

    constructor(public _http: HttpClient){

        this.url = GLOBAL.url;
        this.identity;
        this.token;
    }

    signUp(user: User): Observable<any>
    {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'signup', params, {headers:headers});
    }


    signIn(user: any, getToken:any = null): Observable<any>
    {
        if(getToken != null)
        {
            user.getToken = getToken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, {headers: headers});
    }

    getIdentity()
    {
        let storageIdentity = localStorage.getItem('identity');
        let identity = JSON.parse(storageIdentity);
        
        if(identity != "undefined")
        {

			this.identity = identity;

		}else{

		    this.identity = null;
		}
	 
		return this.identity;
    }

    getToken()
    {
        let token = localStorage.getItem('token');

        if(token != "undefined")
        {
            this.token = token;
        
        } else {

            this.token = null;
        }

        return this.token;

    }

    getStats()
    {
        let stats = JSON.parse(localStorage.getItem('stats'));

        if(stats != "undefined")
        {
            this.stats = stats;

        } else {

            this.stats = null
        }

        return this.stats;
    }

    getCounters(userId:string = null): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

        if(userId != null)
        {
            return this._http.get(this.url + 'counters/'+userId, {headers:headers});
        
        } else {

            return this._http.get(this.url+'counters', {headers:headers});

        }
    }

    updateUser(user: User): Observable<any>
    {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

        

        return this._http.put(this.url + 'update-user/' + user._id, params, {headers:headers});
    }

    getUsers(page: any = null): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

        return this._http.get(this.url + 'users/' + page, {headers: headers});
    }

    getUser(userId: string): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', this.getToken());

        return this._http.get(this.url + 'user/' + userId, {headers: headers});
    }

 }
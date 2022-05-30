import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService
{
    public url: string;

    constructor(
        private _http: HttpClient
    )
    {
        this.url = GLOBAL.url;
    }

    follow(token:any, follow:any): Observable<any>
    {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'follow', params, {headers: headers});
    }

    unfollow(token:any, userId:any): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.delete(this.url + 'follow/' + userId, {headers: headers});
    }

    getFollowing(token:any, userId:any = null, page: any = 1): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        var url = this.url + 'following';

        if(userId != null)
        {
            url = this.url + 'following/' + userId + '/' + page;
        }

        return this._http.get(url, {headers: headers});
    }

    getFollowed(token:any, userId:any = null, page: any = 1): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        var url = this.url + 'followed';

        if(userId != null)
        {
            url = this.url + 'followed/' + userId + '/' + page;
        }

        return this._http.get(url, {headers: headers});
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()

export class WishObjectService
{
    public url: string;
    constructor(private _http: HttpClient)
    {
        this.url = GLOBAL.url;
    }

    addWishObject(token:any, wishObject:any): Observable<any>
    {
        let params = JSON.stringify(wishObject);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.post(this.url + 'wishobject/', params, {headers: headers}); 
    }

    getWishList(token:any, userId: any = null, page: any = 1): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        var url = this.url + 'wishlist-user'

        if(userId != null)
        {
            url = this.url +'wishlist-user/' + userId + '/' + page
        }
        return this._http.get(url, {headers: headers});
    }

    deleteWishObject(token:any, id:any): Observable<any>
    {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this._http.delete(this.url + 'wishobject/' + id, {headers: headers});
    }
}
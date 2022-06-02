import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WishObject } from '../../models/wishObject';
import { WishObjectService } from '../../services/wishObject.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';

@Component(
    {
        selector: 'wishlist',
        templateUrl: './wishlist.component.html',
        providers: [UserService, WishObjectService],
    }
)

export class WishListComponent implements OnInit
{

    public title: string;
    public identity:any;
    public token:any;
    public url: string;
    public status: string;
    public page:any;
    public nextPage: any;
    public prevPage: any;
    public wishList: WishObject[];
    public userPageId : any;
    public total:any;
    public pages:any;
    public itemsPerPage:any;
    public noMore:boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _wishObjectService: WishObjectService
    )
    {
        this.title = 'Wishlist de'
        this.identity = this._userService.getIdentity();
        this.url = GLOBAL.url;
        this.token = this._userService.getToken();
        this.page = 1;

    }

    ngOnInit()
    {
        console.log('wishList.component cargado');
        this.actualPage();
    }

    actualPage()
    {
        this._route.params.subscribe(
            params =>
            {
                let page = +params['page'];
                this.page = page;
                let userId = params['id'];
                this.userPageId = userId

                if(!params['page'])
                {
                    page = 1;
                }

                if(!page)
                {
                    page = 1;
                
                } else {

                    this.nextPage = page + 1;
                    this.prevPage = page - 1;

                    if(this.prevPage <= 0)
                    {
                        this.prevPage = 1;
                    }
                }
                this.getUser(userId, page);
            }
        );
    }

    getWishList(userId: any, page: any)
    {
        this._wishObjectService.getWishList(this.token, userId, page).subscribe(
            response => {

                if(!response.wishList)
                {
                    this.status = 'error';
                
                } else {

                    this.total = response.totalItems;
                    this.pages = response.pages;
                    this.wishList = response.wishList;

                    if(page > this.pages)
                    {
                        this._router.navigate(['/wishlist', this.identity._id, 1]);
                    }
                }

            },
            error => {

                var errorMessage = <any> error;
                console.log(errorMessage);

                if(errorMessage != null)
                {
                    this.status = 'error';
                }
            }
        );
    }

    public user: User;

    getUser(userId : any, page: any)
    {
        this._userService.getUser(userId).subscribe
        (
            response => 
            {
                if(response.user)
                {
                    this.user = response.user;
                    
                    this.getWishList(userId, page);
                
                } else {

                    this._router.navigate(['/home']);
                }
            },
            error => 
            {
                var errorMessage = <any> error;
                console.log(errorMessage);

                if(errorMessage != null)
                {
                    this.status = 'error';
                }
            }
        )
    }

    refresh()
    {
     
        this.actualPage();
    }

    deleteWishObject(objectId: any)
    {
        this._wishObjectService.deleteWishObject(this.token, objectId).subscribe
        (
            response =>
            {
                this.refresh();
            },
            error =>
            {
                var errorMessage = <any> error;
                console.log(errorMessage);

                if(errorMessage != null)
                {
                    this.status = 'error';
                }
            }
        )
    }
}
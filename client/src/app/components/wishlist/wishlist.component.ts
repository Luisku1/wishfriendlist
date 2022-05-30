import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WishObject } from '../../models/wishObject';
import { WishObjectService } from '../../services/wishObject.service';
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
    public wishList: WishObject[];
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
        this.title = 'Wishlist'
        this.identity = this._userService.getIdentity();
        this.url = GLOBAL.url;
        this.token = this._userService.getToken();
        this.page = 1;

    }

    ngOnInit()
    {
        console.log('wishList.component cargado');
        this.getWishList(this.page);
    }

    getWishList(page:any, loading:boolean = false)
    {
        this._wishObjectService.getWishList(this.token, page).subscribe
        (
            response =>
            {
                if(response.wishList)
                {
                    this.total = response.totalItens;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;

                    this.status = 'success';
                    console.log(this.wishList);

                    if(this.total <= 4)
                    {
                        this.noMore = true;
                    }

                    if(!loading)
                    {
                        this.wishList = response.wishList;
                    
                    } else {

                        var arrayPublications = this.wishList;
                        var arrayPivot = response.publications;
                        this.wishList = arrayPublications.concat(arrayPivot);

                        $("html, body").animate({ scrollTop: $('html').prop("scrollHeight")}, 500);
                    }

                    if(this.pages == 0)
                    {
                        page = 0;
                    }

                    if(page > this.pages)
                    {
                        //this._router.navigate(['/home']);
                    }

                } else {

                    this.status = 'error';
                }
            },
            error => 
            {
                var errorMessage = <any>error;
                if(errorMessage != null)
                {
                    this.status = 'error';
                }
            }   
        );
    }
   

    loadMore()
    {
        this.page += 1;

        if(this.page == this.pages)
        {
            this.noMore = true;
        }

        this.getWishList(this.page, true);

    }

    refresh()
    {
        this.getWishList(1);
    }

    deleteWishObject(id: any)
    {
        this._wishObjectService.deleteWishObject(this.token, id).subscribe(

            response => 
            {
                this.refresh()
            },
            error =>
            {
                console.log(<any>error)
            }
        )
    }
}
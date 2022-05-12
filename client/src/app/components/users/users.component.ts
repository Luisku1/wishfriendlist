import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service'
import { GLOBAL } from '../../services/global';

@Component(
    {
        selector: 'users',
        templateUrl: './users.component.html',
        providers: [UserService, FollowService]
    }
)

export class UsersComponent implements OnInit
{
    public title: string;
    public identity: any;
    public token: any;
    public page:any;
    public nextPage: any;
    public prevPage: any;
    public total:any;
    public pages:any;
    public users: User[];
    public status: string;
    public url: string;
    public follows: any;

    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    )
    {
        this.title = 'Usuarios';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void 
    {
        console.log('Componente users cargando...');
        this.actualPage();
    }

    actualPage()
    {
        this._route.params.subscribe(
            params =>
            {
                let page = +params['page'];
                this.page = page;

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

                this.getUsers(page);

            }

        );
    }

    getUsers(page: any)
    {
        this._userService.getUsers(page).subscribe(
            response => {

                if(!response.users)
                {
                    this.status = 'error';
                
                } else {

                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.usersFollowing;


                    if(page > this.pages)
                    {
                        this._router.navigate(['/users', 1]);
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

    public followUserOver:any;

    mouseEnter(userId:any)
    {
        this.followUserOver = userId;

    }

    mouseLeave(userId:any)
    {
        this.followUserOver = 0;

    }

    followUser(followed:any)
    {
        var follow = new Follow('', this.identity._id, followed);

        this._followService.follow(this.token, follow).subscribe(
            response =>
            {
                if(!response.follow)
                {
                    this.status = 'error';
                
                } else {

                    this.status = 'success';
                    this.follows.push(followed);
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
        );
    }

    unfollowUser(followed:any)
    {
        this._followService.unfollow(this.token, followed).subscribe(

            response =>
            {
                var search = this.follows.indexOf(followed);
                
                if(search != -1)
                {
                    this.follows.splice(search, 1);
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
        );
    }

}
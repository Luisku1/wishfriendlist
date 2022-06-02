import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component(
    {
        selector: 'profile',
        templateUrl: './profile.component.html',
        providers: [UserService, FollowService]
    }
)


export class ProfileComponent implements OnInit
{
    public title: string;
    public user: User;
    public status: string;
    public identity: any;
    public token: any;
    public stats: any;
    public url: any;
    public followed: any;
    public following: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    )
    {
        this.title = 'Perfil';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.followed = false;
        this.following = false;
    }

    ngOnInit(): void {
        
        this.loadPage()

    }

    loadPage()
    {
        this._route.params.subscribe
        (
            params => 
            {
                let userId = params['id'];

                this.getUser(userId)
            },
            error => {

                console.log('error aqui');
            }
        );
    }

    getUser(userId:any)
    {
        this._userService.getUser(userId).subscribe
        (
            response =>
            {
                if (response.user)
                {
                    this.user = response.user;
                    this.getCounters(this.user._id)
                
                    if(response.value.following && response.value.following._id)
                    {
                        this.following = true;

                    } else {

                        this.following = false;
                    }

                    if(response.value.followed && response.value.followed._id)
                    {
                        this.followed = true;
                    
                    } else {

                        this.followed = false;
                    }

                } else {
                    
                    this.status = 'error';
                }
            },
            error => 
            {
                console.log(<any> error);
                this._router.navigate(['/profile', this.identity._id]);
            }
        );
    }

    getCounters(userId: any)
    {
        this._userService.getCounters(userId).subscribe
        (
            response =>
            {
                this.stats = response;
            },
            error => 
            {
                console.log(<any>error)
            }
        );
    }

    follow(followed:any)
    {
        var follow = new Follow('', this.identity._id, followed);

        this._followService.follow(this.token, follow).subscribe(

            response =>
            {
                this.following = true;
            },
            error =>
            {
                console.log(<any>error);
            }
        );
    }

    unfollow(followed: any)
    {
        this._followService.unfollow(this.token, followed).subscribe(

            response => 
            {
                this.following = false;
            },
            error =>
            {
                console.log(<any>error);
            }

        );
    }

    public followUserOver: any;

    mouseEnter(userId: any)
    {
        this.followUserOver = userId;
    }

    mouseLeave()
    {
        this.followUserOver = 0;
    }

}
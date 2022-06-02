import { Component, OnInit, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { WishObject } from '../../models/wishObject';
import { NgForm } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { WishObjectService } from '../../services/wishObject.service';


@Component(
    {
        selector: 'sidebarWish',
        templateUrl: './sidebarWish.component.html',
        providers: [UserService, WishObjectService, UploadService]
    }
)



export class SideBarWishComponent implements OnInit, DoCheck
{
    public identity: any;
    public token: any;
    public stats: any;
    public url: string;
    public status: string;
    public wishObject: WishObject;

    

    constructor
    (
        private _userService: UserService, 
        private _wishObjectService: WishObjectService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _uploadService: UploadService,
    )
    {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
        this.wishObject = new WishObject("","","","", this.identity._id);
    }

    ngOnInit(): void 
    {        
        console.log('El componente sidebar.component ha sido cargado');
    }

    ngDoCheck()
    {
        this.stats = this._userService.getStats()
    }

    onSubmit(form: NgForm, $event:any)
    {
        this._wishObjectService.addWishObject(this.token, this.wishObject).subscribe(

            response => 
            {
                if(response.wishObject)
                {
                    this._router.navigate(['/wishlist', this.wishObject.user, 1]);
                    
                    } else {

                        //this._router.navigate(['/wishlist', this.identity._id, 1]);
                    }
                    
                    this.status = 'success';
                    form.reset();
                    this.sended.emit({send: 'true'});
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

    //Output
    @Output() sended = new EventEmitter();
    sendPublication(event:any)
    {
        console.log(event);
    }

}
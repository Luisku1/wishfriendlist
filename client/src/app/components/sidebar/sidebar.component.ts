import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';


@Component(
    {
        selector: 'sidebar',
        templateUrl: './sidebar.component.html',
        providers: [UserService]
    }
)



export class SidebarComponent implements OnInit, DoCheck
{
    public identity: any;
    public token: any;
    public stats: any;
    public url: string;
    public status: string;

    constructor(private _userService: UserService)
    {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        
        console.log('El componente sidebar.component ha sido cargado');

    }

    ngDoCheck()
    {
        this.stats = this._userService.getStats()
    }



}
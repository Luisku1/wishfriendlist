import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({

    selector: 'home',
    templateUrl: './home.component.html',
    providers: [UserService,]
})

export class HomeComponent implements OnInit
{
    public title: string;
    public identity:any;

    constructor(
        private _userService : UserService
    )
    {
        this.title = 'Bienvenido a Wish Friend List';
        this.identity = _userService.getIdentity();
    }

    ngOnInit() {
        
        console.log('home.component cargado!!');

    }
}
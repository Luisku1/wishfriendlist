import { Component, OnInit } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component(
    {
        selector: 'signUp',
        templateUrl: './signUp.component.html',
        providers: [UserService]
    }
)

export class SignUpComponent implements OnInit
{
    public title: string;
    public user: User;
    public status: string;

    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService

    )
    {
        this.title = 'Regístrate';
        this.status= '';
        this.user = new User("", "", "", "", "", "", "", "");
    }

    ngOnInit()
    {
        console.log('Componente de Sign Up cargando...');
    }

    onSubmit(form: NgForm)
    {
        this._userService.signUp(this.user).subscribe(
            response => {

                if(response.user && response.user._id)
                {
                    this.status = 'success';
                    form.reset();
                
                } else {

                    this.status = 'error';
                }

            },
            error => {

                console.log(<any> error);
            }
        );
    }
}
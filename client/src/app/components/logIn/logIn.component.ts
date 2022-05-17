import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params, provideRoutes } from '@angular/router';
import { identity } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component(
    {
        selector: 'logIn',
        templateUrl: './logIn.component.html',
        providers: [UserService]
    }
)

export class LogInComponent implements OnInit
{
    public title: string;
    public user:any;
    public status:string;
    public identity: any;
    public token: string;

    constructor
    (

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService

    )
    {
        
        this.status;
        this.title = 'Identificate';
        this.user = new User("", "", "", "", "", "", "", "");
        this.identity;
        this.token;
    }

    ngOnInit()
    {
        console.log('Componente de LogIn cargando...');
    }

    onSubmit()
    {

        this._userService.signIn(this.user, false).subscribe(

            response => 
            {
                this.identity = response.user;
                console.log(this.identity);

                if(!this.identity || !this.identity._id)
                {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    this.status ='error';
                
                } else {

                    //Persistir datos del usuario
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                
                    //Generar token
                    this.getToken()
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

    getToken()
    {
        this._userService.signIn(this.user, true).subscribe(

            response => 
            {
                this.token = response.token;

                console.log(this.token);

                if(this.token.length <= 0)
                {
                    this.status ='error';   
                
                } else {

                    //Persistir token del usuario
                    localStorage.setItem('token', JSON.stringify(this.token));

                    //Conseguir los contadores y estadísticas del usuario

                    this.getCounters();
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

    getCounters()
    {
        this._userService.getCounters().subscribe(
            response =>
            {
                localStorage.setItem('stats', JSON.stringify(response));
                this.status = 'success';
                this._router.navigate(['/home']);
            },
            error =>
            {

                console.log(<any> error);
            }
        )
    }
}
import { Component, OnInit, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { NgForm } from '@angular/forms';


@Component(
    {
        selector: 'sidebar',
        templateUrl: './sidebar.component.html',
        providers: [UserService, PublicationService]
    }
)



export class SidebarComponent implements OnInit, DoCheck
{
    public identity: any;
    public token: any;
    public stats: any;
    public url: string;
    public status: string;
    public publication: Publication;

    

    constructor(
        private _userService: UserService, 
        private _publicationService: PublicationService,
        private _route: ActivatedRoute,
        private _router: Router
    )
    {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.url = GLOBAL.url;
        this.publication = new Publication("","","","","","", this.identity._id);
    }

    ngOnInit(): void {
        
        console.log('El componente sidebar.component ha sido cargado');

    }

    ngDoCheck()
    {
        this.stats = this._userService.getStats()
    }

    onSubmit(form: NgForm)
    {
        
        this._publicationService.addPublication(this.token, this.publication).subscribe(

            response => 
            {
                if(response.publication)
                {
                    //this.publication = response.publication;
                    this.status = 'success';
                    form.reset();
                    this._router.navigate(['/timeline']);
                
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

    //Output
    @Output() sended = new EventEmitter();
    sendPublication(event:any)
    {
        console.log(event);
        this.sended.emit({send: 'true'});
    }

}
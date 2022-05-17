import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Moment } from 'moment';

@Component(
    {
        selector: 'timeline',
        templateUrl: './timeline.component.html',
        providers: [UserService, PublicationService],
    }
)

export class TimelineComponent implements OnInit
{

    public title: string;
    public identity:any;
    public token:any;
    public url: string;
    public status: string;
    public page:any;
    public publications: Publication[];
    public total:any;
    public pages:any;
    public itemsPerPage:any;
    public noMore:boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    )
    {
        this.title = 'Timeline'
        this.identity = this._userService.getIdentity();
        this.url = GLOBAL.url;
        this.token = this._userService.getToken();
        this.page = 1;

    }

    ngOnInit()
    {
        console.log('timeline.component cargado');
        this.getPublications(this.page);
    }

    getPublications(page:any, loading:boolean = false)
    {
        this._publicationService.getPublications(this.token, page).subscribe
        (
            response =>
            {
                if(response.publications)
                {
                    this.total = response.totalItens;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;

                    this.status = 'success';
                    console.log(this.publications);

                    if(this.total <= 4)
                    {
                        this.noMore = true;
                    }

                    if(!loading)
                    {
                        this.publications = response.publications;
                    
                    } else {

                        var arrayPublications = this.publications;
                        var arrayPivot = response.publications;

                        this.publications = arrayPublications.concat(arrayPivot);

                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500);

                    }

                    if(this.pages == 0)
                    {
                        page = 0;
                    }

                    if(page > this.pages)
                    {
                        this._router.navigate(['/home']);
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
        if(this.page == this.pages)
        {
            this.noMore = true;
        
        } else {

            this.page += 1;
        }

        this.getPublications(this.page, true);

    }

    refresh()
    {
        this.getPublications(1);
    }  
}
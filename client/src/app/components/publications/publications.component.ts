import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';

@Component(
    {
        selector: 'publications',
        templateUrl: './publications.component.html',
        providers: [UserService, PublicationService],
    }
)

export class PublicationsComponent implements OnInit
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
    @Input() user: string;

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
        this.getPublications(this.user, this.page);
    }

    getPublications(user: any, page:any, loading:boolean = false)
    {
        this._publicationService.getPublicationsUser(this.token, user, page).subscribe
        (
            response =>
            {
                if(response.publications)
                {
                    this.total = response.totalItens;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;

                    this.status = 'success';

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

                        $("html, body").animate({ scrollTop: $('html').prop("scrollHeight")}, 500);

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
        this.page += 1;

        if(this.page == this.pages)
        {
            this.noMore = true;
        }

        this.getPublications(this.page, true);

    }

    refresh()
    {
        this.getPublications(this.user, 1);
    }
}
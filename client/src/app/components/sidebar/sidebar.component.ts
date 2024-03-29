import { Component, OnInit, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { NgForm } from '@angular/forms';
import { UploadService } from '../../services/upload.service';


@Component(
    {
        selector: 'sidebar',
        templateUrl: './sidebar.component.html',
        providers: [UserService, PublicationService, UploadService]
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
        private _router: Router,
        private _uploadService: UploadService,
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

    onSubmit(form: NgForm, $event:any)
    {
        
        this._publicationService.addPublication(this.token, this.publication).subscribe(

            response => 
            {
                if(response.publication)
                {

                    if(this.filesToUpload && this.filesToUpload.length)
                    {
                        //subir imagen
                        this._uploadService.makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                        .then(

                            (result:any) =>
                            {
                                this.publication.file = result.publication.image;
                                this._router.navigate(['/timeline']);
                            }
                        );
                    
                    } else {

                        this._router.navigate(['/timeline']);
                    }
                    
                    this.status = 'success';
                    form.reset();
                    this.sended.emit({send: 'true'});
                
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

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput:any)
    {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    //Output
    @Output() sended = new EventEmitter();
    sendPublication(event:any)
    {
        console.log(event);
    }

}
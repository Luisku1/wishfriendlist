import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent implements DoCheck, OnInit {
  public title:string;
  public identity: any;
  public url:string;
  public stats: any;

  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService,
  )
  {
    this.title = 'Wish Friend List';
    this.identity = null;
    this.url = GLOBAL.url;
  }

  ngOnInit()
  {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
  }

  ngDoCheck()
  {
    this.identity = this._userService.getIdentity();
    this.stats = this._userService.getStats();
  }

  logout()
  {
    localStorage.clear();
    this.identity = null;

    this._router.navigate(['/login']);

  }

}

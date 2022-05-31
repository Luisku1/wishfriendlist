import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

//Componentes
import { LogInComponent } from "./components/logIn/logIn.component";
import { SignUpComponent } from "./components/signUp/signUp.component";
import { HomeComponent } from "./components/home/home.component";
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from "./components/followed/followed.component";
import { WishListComponent } from "./components/wishlist/wishlist.component";

const appRoutes: Routes = [

    {path: '', component: HomeComponent},
    {path:'home', component: HomeComponent},
    {path: 'login', component: LogInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'myData', component: UserEditComponent},
    {path: 'editUser', component: UserEditComponent},
    {path: 'users/:page', component: UsersComponent},
    {path: 'users', component: UsersComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: 'profile/:id', component: ProfileComponent},
    {path: 'siguiendo/:id/:page', component: FollowingComponent},
    {path: 'followme/:id/:page', component: FollowedComponent},
    {path: 'wishlist/:id/:page', component: WishListComponent},
    {path: '**', component: HomeComponent}

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
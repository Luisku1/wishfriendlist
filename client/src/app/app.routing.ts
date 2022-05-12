import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

//Componentes
import { LogInComponent } from "./components/logIn/logIn.component";
import { SignUpComponent } from "./components/signUp/signUp.component";
import { HomeComponent } from "./components/home/home.component";
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path:'home', component: HomeComponent},
    {path: 'login', component: LogInComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'myData', component: UserEditComponent},
    {path: 'editUser', component: UserEditComponent},
    {path: 'users/:page', component: UsersComponent},
    {path: 'users', component: UsersComponent},
    {path: '**', component: HomeComponent},
    

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
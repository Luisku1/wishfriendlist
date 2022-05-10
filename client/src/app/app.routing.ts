import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

//Componentes
import { LogInComponent } from "./components/logIn/logIn.component";
import { SignUpComponent } from "./components/signUp/signUp.component";
import { HomeComponent } from "./components/home/home.component";

const appRoutes: Routes = [
    {path: '', component: LogInComponent},
    {path:'home', component: HomeComponent},
    {path: 'login', component: LogInComponent},
    {path: 'signup', component: SignUpComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
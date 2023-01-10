// import { ExtraOptions, RouterModule, Routes } from '@angular/router';
// import { NgModule } from '@angular/core';
// import { EsriMapComponent } from './pages/esri-map/esri-map.component';
// import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { LogoutComponent } from './logout/logout.component';
// import { ExpenseGuard } from './expense.guard';
// import { ExpenseEntryListComponent } from './expense-entry-list/expense-entry-list.component';
// import { ExpenseEntryComponent } from './expense-entry/expense-entry.component';
// import { AppComponent } from './app.component';


// export const routes: Routes = [
//   {
//     path: 'home',
//     component: HomeComponent,
//   },
//   {
//     path: 'map',
//     component: EsriMapComponent,
//   },
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full',
//   },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'logout', component: LogoutComponent },
//   { path: 'expenses', component: ExpenseEntryListComponent, canActivate: [ExpenseGuard]},
//   { path: 'expenses/detail/:id', component: ExpenseEntryComponent, canActivate: [ExpenseGuard]},
//   { path: '', redirectTo: 'home', pathMatch: 'full' }
// ];

// const config: ExtraOptions = {
//   useHash: false,
// };

// @NgModule({
//   imports: [RouterModule.forRoot(routes, config)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {
// }

import { NgModule } from '@angular/core';
import {ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EsriMapComponent } from './pages/esri-map/esri-map.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'map',
    component: EsriMapComponent,
  }
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

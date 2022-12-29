import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EsriMapComponent } from "./pages/esri-map/esri-map.component";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ExpenseEntryComponent } from './expense-entry/expense-entry.component';
import { ExpenseEntryListComponent } from './expense-entry-list/expense-entry-list.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { RegisterComponent } from "./register/register.component";


@NgModule({
  declarations: [AppComponent, 
    EsriMapComponent, 
    LoginComponent, 
    LogoutComponent, 
    ExpenseEntryComponent, 
    ExpenseEntryListComponent, 
    RegisterComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

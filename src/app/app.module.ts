// import { BrowserModule } from "@angular/platform-browser";
// import { NgModule } from "@angular/core";

// import { AppComponent } from "./app.component";
// import { EsriMapComponent } from "./pages/esri-map/esri-map.component";
// import { AppRoutingModule } from "./app-routing.module";
// import { LoginComponent } from './login/login.component';
// import { LogoutComponent } from './logout/logout.component';
// import { ExpenseEntryComponent } from './expense-entry/expense-entry.component';
// import { ExpenseEntryListComponent } from './expense-entry-list/expense-entry-list.component';
// import { ReactiveFormsModule } from '@angular/forms'; 
// import { RegisterComponent } from "./register/register.component";

// import { environment } from '../environments/environment';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// import { FirebaseService } from './services/database/firebase';
// import { FirebaseMockService } from './services/database/firebase-mock';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { MatTabsModule } from '@angular/material/tabs';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatListModule } from '@angular/material/list';

// import { FlexLayoutModule } from '@angular/flex-layout';
// //import { AuthService } from "./shared/services/auth.service";


// @NgModule({
//   declarations: [AppComponent, 
//     EsriMapComponent, 
//     LoginComponent, 
//     LogoutComponent, 
//     ExpenseEntryComponent, 
//     ExpenseEntryListComponent, 
//     RegisterComponent
//   ],
//   imports: [BrowserModule,
//     AppRoutingModule,
//     ReactiveFormsModule,
//     BrowserAnimationsModule,
//     MatTabsModule,
//     MatButtonModule,
//     MatDividerModule,
//     MatListModule,
//     FlexLayoutModule,
//     AngularFireModule.initializeApp(environment.firebase, 'AngularDemoArcGIS'),
//     AngularFireDatabaseModule],
//   providers: [
//     FirebaseService,
//     FirebaseMockService
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HotToastModule } from '@ngneat/hot-toast';
import { LandingComponent } from './components/landing/landing.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './components/profile/profile.component';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { FirebaseService } from './services/database/firebase';
import { FirebaseMockService } from './services/database/firebase-mock';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    LandingComponent,
    HomeComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    MatMenuModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase, 'AngularDemoArcGIS'),
    AngularFireDatabaseModule
  ],
  providers: [
    FirebaseService,
    FirebaseMockService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Set our map properties
  mapCenter = [-122.4194, 37.7749];
  basemapType = 'satellite';
  mapZoomLevel = 12;
  // isUserLoggedIn = false;

  user$ = this.usersService.currentUserProfile$;

  constructor(public authService: AuthService,
    public usersService: UsersService,
    private router: Router) {}
  
//   ngOnInit() {
//     let storeData = localStorage.getItem("isUserLoggedIn");
//     console.log("StoreData: " + storeData);

//     if( storeData != null && storeData == "true")
//        this.isUserLoggedIn = true;
//     else


//        this.isUserLoggedIn = false;
//  }
  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}


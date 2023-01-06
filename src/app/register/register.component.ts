import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { Subscription } from "rxjs";
import { FirebaseService, User } from "src/app/services/database/firebase";

@Component({
   selector: 'app-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

   userName: string;
   password: string;
   formData: FormGroup;
   message: string;
   error: boolean;

   exists: boolean = false;
//      // firebase sync
//   isConnected: boolean = false;
  subscriptionList: Subscription;
  subscriptionObj: Subscription;
   

   constructor(private authService : AuthService, private router : Router, private fbs: FirebaseService) { 
    this.error = false
    this.message = ""
   }

   ngOnInit() {
      this.formData = new FormGroup({
         userName: new FormControl(""),
         password: new FormControl(""),
      });
      this.error = false
      this.message = ""
   }

   
//Pare ca se blocheaza de la subscribe
// de aici inteleg ca cu subscribe ai vedea lista: https://stackoverflow.com/questions/51126463/angularfiredatabase-does-not-retrieve-data
   findUser(name: string) {
      this.subscriptionList = this.fbs.getChangeFeedList().subscribe((users: User[]) => {
        console.log("got new items from list: ", users);
        for (let user of users) {
         if(user.username == name) {
            this.exists = true;
            //break;
         }
        }
      });

      this.subscriptionList.unsubscribe()
    }

    

   onClickSubmit(data: any) {
      this.userName = data.userName;
      this.password = data.password;
      this.message = "";
      this.error = false;

      console.log("Register page: " + this.userName);
      console.log("Register page: " + this.password);
      this.fbs.connectToDatabase;
      this.findUser(this.userName);

     // if (localStorage.getItem(this.userName) != null) {
      if(this.exists == true) {
         this.error = true;
         this.message += " Username already exists! " ;
      }
      if(!data) {
         this.error = true;
         this.message += " Fields cannot be empty!";
      } else {
         if(!data.userName) {
            this.error = true;
            this.message += " Username cannot be empty!";
         } 
         if(!data.password) {
            this.error = true;
            this.message += " Password cannot be empty!";
         }
         if (data.userName != null && this.userName.indexOf(' ') >= 0) {
            this.error = true;
            this.message += " Username cannot contain whitespaces!";
         }
         if (data.password && this.password.length < 6) {
            this.error = true;
            this.message += " Password cannot be shorter than 6 characters!";
         }  
      }
      if(this.error == false) {
         if(this.userName != "admin") {
            this.fbs.addUser(this.userName, this.password, "no");
         } else {
            this.fbs.addUser(this.userName, this.password, "yes");
         }
         this.authService.login(this.userName, this.password)
         .subscribe( data => { 
            console.log("Is Login Success: " + data); 
      
         this.router.navigate(['/login']); 
         });
      }
   }

}
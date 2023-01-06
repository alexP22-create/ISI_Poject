import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as intl from 'esri/intl';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   userName: string;
   password: string;
   formData: FormGroup;
   message: string;
   error: boolean;
   constructor(public authService : AuthService, private router : Router) {
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

   onClickSubmit(data: any) {
      this.userName = data.userName;
      this.password = data.password;
      this.message = "";
      this.error = false;

      console.log("Login page: " + this.userName);
      console.log("Login page: " + this.password);

      this.authService.login(this.userName, this.password)
         .subscribe( data => { 
            console.log("Is Login Success: " + data);

         if(!data) {
            this.error = true;
            this.message += " Wrong credentials!";
         }
         
         if (this.userName.length != 0 && this.userName.indexOf(' ') >= 0) {
            this.error = true;
            this.message += " Username cannot contain whitespaces!";
         }
         if (this.userName.length == 0) {
            this.error = true;
            this.message += " Username cannot be empty!";
         }
         if (this.password.length == 0) {
            this.error = true;
            this.message += " Password cannot be empty!";
         } 
         if(this.error == false) {
            this.router.navigate(['/home']);
         }
      });
   }
}

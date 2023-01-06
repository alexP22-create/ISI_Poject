import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
   

   constructor(private authService : AuthService, private router : Router) { 
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

      console.log("Register page: " + this.userName);
      console.log("Register page: " + this.password);

      if (localStorage.getItem(this.userName) != null) {
         this.error = true;
         this.message += " Username already exists!";
      }
      if (this.userName.indexOf(' ') >= 0) {
         this.error = true;
         this.message += " Username cannot contain whitespaces!";
      }
      if (this.password.length < 6) {
         this.error = true;
         this.message += " Password cannot be shorter than 6 characters!";
      }  
      if(this.error == false) {
         localStorage.setItem(this.userName, this.password);
         this.authService.login(this.userName, this.password)
         .subscribe( data => { 
            console.log("Is Login Success: " + data); 
      
           if(data) this.router.navigate(['/home']); 
         });
      }
   }
}
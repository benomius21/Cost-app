import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFrom: FormGroup;
  isToken = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginFrom = this.fb.group({
       email: new FormControl(),
       pass: new FormControl()
    });
  }

  onSubmit(){
   this.getValues();
   this.authService.isToken.subscribe(odg =>{
     this.isToken = odg;
     if(this.isToken){
      this.router.navigate(['/items']);
     }
   })
  
  }

  getValues(){
    const email = this.loginFrom.get('email').value;
    const pass  = this.loginFrom.get('pass').value;
    this.authService.logIn(email, pass);
    }
}

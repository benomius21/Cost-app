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
  token: string;
  isToken = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.token = this.authService.token 
      const test = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZCI6Imh0dHA6XC9cL2V4YW1wbGUuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsImRhdGEiOnsiaWQiOiIxODkiLCJmaXJzdF9uYW1lIjoicXdlIiwibGFzdF9uYW1lIjoiZXdxIiwidXNlcl9lbWFpbCI6ImJAZ21haS5jb20ifX0.9EJ0eDY0jkwq26LFmp_cSf5dbG0QNrWxns1yqnU5jJI'
      if(this.token == test){
        console.log('isto je');
      }
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
       console.log('caooooooo');
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

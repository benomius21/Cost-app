import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  singUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.singUpForm = this.fb.group({
        email: new FormControl(),
        pass: new FormControl()
    });
  }
 
  onSubmit(){
    this.getValues();
  }

  getValues(){
  const email = this.singUpForm.get('email').value;
  const pass  = this.singUpForm.get('pass').value;
  this.authService.singUp(email, pass);
  }

}

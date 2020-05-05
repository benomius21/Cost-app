import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../signIn/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  token= false;
  sub: Subscription;

  constructor(private authServis: AuthService, private router: Router) { }

  ngOnInit(): void {
     this.sub = this.authServis.isToken.subscribe(odg =>{
        this.token = odg;
        });
      
  }
  logout(){
    this.authServis.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}

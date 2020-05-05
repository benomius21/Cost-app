import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './items/item/item.component';
import { ItemdetailComponent } from './items/itemdetail/itemdetail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServisService } from './items/servis.service';
import { NewItemComponent } from './items/new-item/new-item.component';
import { InputService } from './items/input.service';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from '@angular/router'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestComponent } from './items/test/test.component';
import { LoginComponent } from './signIn/login/login.component';
import { SignupComponent } from './signIn/signup/signup.component';
import { AuthService } from './signIn/auth.service';
import { AuthIntercepter } from './signIn/auth-intercepter';
import { AuthGuard } from './signIn/auth.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'items', component: ItemsComponent, children: [
      { path: '', component: TestComponent },
      { path: ':id', component: ItemdetailComponent }
    ]
  },
  { path: 'new', component: NewItemComponent, canActivate: [AuthGuard] }

]

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemComponent,
    ItemdetailComponent,
    NewItemComponent,
    HeaderComponent,
    TestComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthIntercepter, multi: true },
    ServisService,
    InputService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

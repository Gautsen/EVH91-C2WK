import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './container/admin/admin.component';
import { HomeComponent } from './container/home/home.component';
import { LoginComponent } from './container/login/login.component';
import { ProductsComponent } from './container/products/products.component';
import { ProfileComponent } from './container/profile/profile.component';
import { RegisterComponent } from './container/register/register.component';
import { PanierComponent } from './container/panier/panier.component';
import { AuthGuard } from './common/auth.guard';
import { AboutComponent } from './container/about/about.component'

const routes: Routes = [
  {path : '', component: HomeComponent},
  {path : 'login', component: LoginComponent},
  {path : 'register', component: RegisterComponent},
  {path : 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path : 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path : 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path : 'panier', component: PanierComponent, canActivate: [AuthGuard]},
  {path : 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

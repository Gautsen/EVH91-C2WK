import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Model/User';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user : User = {username: '', role_id: 0, email: '', password: '', adresse: '', city: '', postalCode: '', id: 0};
  isLogged : boolean = false;

  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._authService.user.subscribe(data => {
      if (data) {
        this.isLogged = true;
      }
      else {
        this.isLogged = false;
      }
    });
  }
    

  logout(): void {
    this._authService.logout();
  }
  

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/_service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService
            , public rooute: Router
            , private toast: ToastrService) { }

  ngOnInit() {
  }

  showMenu() {
    return this.rooute.url !== '/user/login';
  }

  loggedIn() {
    this.authService.loggedIn();
  }

  entrar() {
    this.rooute.navigate(['/user/login']);
  }

  logout() {
    localStorage.removeItem('token');
    this.toast.show('Log Out');
    this.rooute.navigate(['/user/login']);
  }

  userName() {
    return sessionStorage.getItem('username');
  }

}

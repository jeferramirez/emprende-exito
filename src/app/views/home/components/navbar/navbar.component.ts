import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showNavigateButtons = false;

  constructor(public router: Router , private location:Location) { }

  ngOnInit(): void {

   this.router.events
     .pipe(filter(e => e instanceof NavigationEnd))
     .subscribe( ()=> {
      this.showNavigateButtons = true;
      if (this.location.path() == '/home/lista-reportes') {
        this.showNavigateButtons = false;
      }
      if (this.location.path() == '/home/gestion-matriculas') {
        this.showNavigateButtons = false;

      }
   })
  }

  logOut(): void{
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

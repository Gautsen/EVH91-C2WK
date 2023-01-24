import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  constructor(
    private http: HttpClient
  ) { }

  products: any;

    ngOnInit() : void{
      this.http.get('http://localhost:3000/products').subscribe(data => {
        this.products = data;
      });
    }

  }
  
  
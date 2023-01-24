import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Produits } from 'src/app/Model/Produits';
import { User } from 'src/app/Model/User';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user : User = {username: '', role_id: 0, email: '', password: '', adresse: '', city: '', postalCode: '', id: 0};
  closeResult = '';
  produits : any;
  images : any;
  multipleImages = [];


  constructor(
    private http: HttpClient,
    private _userService: UserService,
    private router : Router,
    private modalService: NgbModal
    
    
  ) { }

  ngOnInit(): void {
    this._userService.GetUserInfo().subscribe(data => {
      this.user = data;
    });
    
  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSubmit(f: NgForm) {
    //Recuperer l'id de l'utilisateur
    const id = this.user.id;
    console.log(id);
    const url = `http://localhost:3000/user/update/${id}`;
    this.http.put(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

 


  onAddProduct(f: NgForm) {
    const url = 'http://localhost:3000/product/add';
    this.http.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
        console.log(result);
      });
    this.modalService.dismissAll(); //dismiss the modal
    }

    SelectImage(event:any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        console.log(file);
        this.images = file;
      }
    }
    
    OnSubmitImage() {
      //construct form data
      const formData = new FormData();
      formData.append('file', this.images);

      //post request to express server
      this.http.post<any>("http://localhost:3000/file", formData)
        .subscribe((res) => {
          console.log(res);
          } , (err) => {
          console.log(err);
        });
}
}
 
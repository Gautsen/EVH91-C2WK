import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/Model/User';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  closeResult = '';
  user : any;
  produits : any;


  constructor(
    private http: HttpClient,
    private _userService: UserService,
    private modalService: NgbModal,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/users').subscribe(data => { 
      this.user = data;
    });
    this.http.get('http://localhost:3000/products').subscribe(data => {
      this.produits = data;
    }
    );
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
    const url = 'http://localhost:3000/users/add';
    this.http.post(url, f.value)
      .subscribe((result) => {
        this.router.navigate(['/admin']);
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  onDelete(f: NgForm){
    const id = f.value.id;
    const url = `http://localhost:3000/users/delete/${id}`;
    this.http.delete(url, f.value)
      .subscribe((result) => {
        console.log(result);
        this.router.navigate(['/admin']).then(() => {
          location.reload();
        });
      }
    );
    this.modalService.dismissAll(); //dismiss the modal
  }

  onEdit(f: NgForm){
    const id = f.value.id;
    const url = `http://localhost:3000/users/edit/${id}`;
    this.http.put(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      }
    );
    this.modalService.dismissAll(); //dismiss the modal
  }

  onDeleteProduit(f: NgForm){
    const id = f.value.id;
    const url = `http://localhost:3000/products/delete/${id}`;
    this.http.delete(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      }
    );
    this.modalService.dismissAll(); //dismiss the modal
  }

  onAddProduit(f: NgForm){
    const url = 'http://localhost:3000/products/add';
    this.http.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  onEditProduit(f: NgForm){
    const id = f.value.id;
    const url = `http://localhost:3000/products/edit/${id}`;
    this.http.put(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      }
    );
    this.modalService.dismissAll(); //dismiss the modal
  }
} 









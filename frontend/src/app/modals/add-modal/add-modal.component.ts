import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/_services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit {
  @ViewChild('addFormModal') addFormModal: any;
  closeResult: any;
  @Output('callByChildEvent') callByChildEvent = new EventEmitter<any>();
  _storeSub: any;

  constructor(
    private dataService: DataService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) { }

  // form group for addForm
  addForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    state: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z \-\']+')
    ]),
    zip: new FormControl('', [
      Validators.required
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    qty: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    item: new FormControl('', [
      Validators.required
    ]),
  });

  // flag for form submit
  addFormSubmitted: boolean = false;

  ngOnInit(): void {
  }

  // open modal action
  openAddFormModal() {
    this.modalService.open(this.addFormModal, { centered: true, windowClass: 'custom-modal', size: 'lg', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // dismiss modal action
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // submitting the add from
  addAction(): void {
    if (this.addFormSubmitted) {
      return;
    }

    this.addFormSubmitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
      alert('One or more fields are invalid or empty. Please check');
      return;
    }
    
    // save record
    this._storeSub = this.dataService.saveRecord({
      name: this.addForm.getRawValue().name,
      state: this.addForm.getRawValue().state,
      zip: this.addForm.getRawValue().zip,
      amount: this.addForm.getRawValue().amount,
      qty: this.addForm.getRawValue().qty,
      item: this.addForm.getRawValue().item,
    }).subscribe({
      next: (x: any) => {
        let res: any = x;
        this.toastrService.success(res.message);
        this.addForm.reset();
        this.callByChildEvent.next('callByChildAction');
        this.modalService.dismissAll();        
      },
      error: (err: Error) => {
        let errRes: any;
        errRes = err;
        this.toastrService.error(errRes.error.message);
        //console.error(err)
        this.addFormSubmitted = false;
      },
      complete: () => {
        this.addFormSubmitted = false;
      },
    });
  }

  // getter for addForm
  get getAddForm() { return this.addForm.controls; }

  //key press event for quantity field
  qtyKeyPressEvent(event: any) {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}

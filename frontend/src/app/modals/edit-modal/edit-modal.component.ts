import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {
  @ViewChild('editFormModal') editFormModal: any;
  @Input('row') row: any;
  @Output('callByChildEvent') callByChildEvent = new EventEmitter<any>();

  closeResult: any;
  holdRowObj: any;
  // form group for editForm
  editForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
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

  // flag for edit form submission
  editFormSubmitted: boolean = false;
  // property for updatd record observable
  _updateSub: any;

  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private toastrService: ToastrService
  ) { }
  
  isFormValueChanged: boolean = false;

  ngOnInit(): void {

    // subscribe to edit form value change observable
    this.editForm.valueChanges.subscribe((result) => {
      if (
        this.holdRowObj?.id === this.editForm.getRawValue()?.id &&
        this.holdRowObj?.name === this.editForm.getRawValue()?.name &&
        this.holdRowObj?.state === this.editForm.getRawValue()?.state &&
        this.holdRowObj?.zip === this.editForm.getRawValue()?.zip &&
        this.holdRowObj?.amount === this.editForm.getRawValue()?.amount &&
        this.holdRowObj?.qty === this.editForm.getRawValue()?.qty &&
        this.holdRowObj?.item === this.editForm.getRawValue()?.item
      ) {
        // set false if value not changed
        this.isFormValueChanged = false;
      } else {
        // set true if value changed
        this.isFormValueChanged = true;
      }
    });
  }

  ngOnChanges(): void {
    // holding row value in obj on value change;
    this.holdRowObj = this.row;
    //console.log(this.holdRowObj);
    this.editForm.patchValue({
      id: this.row?.id,
      name: this.row?.name,
      state: this.row?.state,
      zip: this.row?.zip,
      amount: this.row?.amount,
      qty: this.row?.qty,
      item: this.row?.item,
    });
  }

  // edit form action
  editAction(): void {    

    if (this.editFormSubmitted) {
      return;
    }

    this.editFormSubmitted = true;
    // stop here if form is invalid
    if (this.editForm.invalid) {
      alert('Edit form is not valid.');
      return;
    }

    if(!this.row) {
      alert('Something went wrong.')
    }
    // update record
    this._updateSub = this.dataService.updateRecord({
      id: this.editForm.getRawValue().id,
      name: this.editForm.getRawValue().name,
      state: this.editForm.getRawValue().state,
      zip: this.editForm.getRawValue().zip,
      amount: this.editForm.getRawValue().amount,
      qty: this.editForm.getRawValue().qty,
      item: this.editForm.getRawValue().item,
    }, this.row.id).subscribe({
      next: (x: any) => {
        let res: any = x;
        this.toastrService.success(res.message);
        this.editForm.reset();
        this.callByChildEvent.next('callByChildAction');
        this.modalService.dismissAll();        
      },
      error: (err: Error) => {
        let errRes: any;
        errRes = err;
        this.toastrService.error(errRes.error.message);
        //console.error(err)
        this.editFormSubmitted = false;
      },
      complete: () => {
        this.editFormSubmitted = false;
      },
    }); 
  }

  //open modal action
  openEditFormModal() {
    this.modalService.open(this.editFormModal, { centered: true, windowClass: 'custom-modal', size: 'lg', backdrop: 'static' }).result.then((result) => {
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

  // getter for editForm
  get getEditForm() { return this.editForm.controls; }

  //key press event for quantity field
  qtyKeyPressEvent(event: any) {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}

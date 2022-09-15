import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { DataService } from '../_services/data.service';
import { ButtonComponent } from '../agbutton/button/button.component';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { AddModalComponent } from '../modals/add-modal/add-modal.component';
import { ToastrService } from 'ngx-toastr';
import { GridReadyEvent, IsRowSelectable, RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // access the template of EditModalComponent
  @ViewChild(EditModalComponent, { static: true }) editFormTem: any;
  // access the template of AddModalComponent
  @ViewChild(AddModalComponent, { static: true }) addFormTem: any;

  list: Array<any> = [];
  selectedRows: Array<any> = [];
  _getAllRecord: any;
  row: any;
  _deleteSub: any;
  deleteActionSubmit: boolean = false;

  rowSelection: 'single' | 'multiple' = 'multiple';
  rowData: Array<any> = [];

  private gridApi!: GridApi<any>;

  components = {
    'buttonComponent': ButtonComponent
  };

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService
  ) { }

  ngOnDestroy(): void {
    // unsubscribe the observables on destroy
    if(this._getAllRecord) { this._getAllRecord.unsubscribe(); }
    if(this._deleteSub) { this._deleteSub.unsubscribe(); }
  }

  //column default configuration
  columnDefs = [
    { headerName: 'Id', field: 'id', width: 70, headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: 'Name', field: 'name', resizable: true, width: 330 },
    { headerName: 'State', field: 'state', resizable: true, width: 270 },
    { headerName: 'Zip', field: 'zip', resizable: true, width: 100 },
    { headerName: 'Amout', field: 'amount', resizable: true, width: 100 },
    { headerName: 'Qty', field: 'qty', resizable: true, width: 100 },
    { headerName: 'Item', field: 'item', resizable: true, width: 100 },
  ];

  // row selectable configuration
  public isRowSelectable: IsRowSelectable = (params: RowNode<any>) => {
    return true;
  };

  //on cell value change action
  onCellValueChanged(event: any) {
    console.log(event);
  }

  defaultColDef = {
    sortable: true,
    resizable: true
  };

  ngOnInit(): void {

  }

  //action for edit button
  onEditButtonClick() {
    this.row = this.selectedRows[0];
    this.editFormTem.openEditFormModal();
  }

  // get all record 
  getAllRecord() {
    this._getAllRecord = this.dataService.getAllRecord().subscribe({
      next: (x: any) => {
        let res: any = x;
        this.list = res.data;
        this.selectedRows = [];
      },
      error: (err: Error) => {
        let errRes: any;
        errRes = err;
        console.log();
        this.toastrService.error(errRes.error.message);
      },
      complete: () => {

      }
    });
  }

  // on cell click event
  onCellClicked(e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  //action for add button
  addBtnAction() {
    this.addFormTem.openAddFormModal();
  }

  // call this action by child component
  callByChildAction(): void {
    this.getAllRecord();
  }

  // delete action
  deleteAction(): void {
    // if selected row length is 0 then noting will happen    
    if(this.selectedRows.length == 0) {
      return;
    }
    // confirmation
    if (!confirm('Are you sure, you want to delete records?')) {
      return;
    }

    if (this.deleteActionSubmit) {
      return;
    }
    this.deleteActionSubmit = true;

    // fetching all ids from selected rows
    let ids: Array<any> = [];
    this.selectedRows.forEach((element) => {
      ids.push(element.id);
    });
    
    this._deleteSub = this.dataService.deleteRecord(ids).subscribe({
      next: (x: any) => {
        this.deleteActionSubmit = false;
        let res = x;
        this.toastrService.success(res.message);
        this.getAllRecord();
      },
      error: (err: Error) => {
        let errRes: any;
        errRes = err;
        this.deleteActionSubmit = false;
        this.toastrService.error(errRes.error.message);
      },
      complete: () => {
        this.deleteActionSubmit = false;
      },
    });
  }

  // row selection change action
  onSelectionChanged(event: any) {
    this.selectedRows = this.gridApi.getSelectedRows();
    //console.log(this.selectedRows);
  }

  // grid ready action
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getAllRecord();
  }

}

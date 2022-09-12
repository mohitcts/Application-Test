import { Component, OnInit, ViewChild } from '@angular/core';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { DataService } from '../_services/data.service';
import { ButtonComponent } from '../agbutton/button/button.component';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { AddModalComponent } from '../modals/add-modal/add-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ColDef, FirstDataRenderedEvent, GridReadyEvent, IsRowSelectable, RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(EditModalComponent, { static: true }) editModal: any;
  @ViewChild(AddModalComponent, { static: true }) addModal: any;

  list: Array<any> = [];
  selectedRows: Array<any> = [];
  _list: any;
  row: any;
  _deleteSub: any;
  deleteActionSubmit: boolean = false;

  rowSelection: 'single' | 'multiple' = 'multiple';
  rowData: Array<any> = [];

  private gridApi!: GridApi<any>;

  public isRowSelectable: IsRowSelectable = (params: RowNode<any>) => {
    return true;
  };

  components = {
    'buttonComponent': ButtonComponent
  };

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService
  ) { }

  //column default configuration
  columnDefs = [
    { headerName: 'Id', field: 'id', width: 70, headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: 'Name', field: 'name', resizable: true, width: 330 },
    { headerName: 'State', field: 'state', resizable: true, width: 270 },
    { headerName: 'Zip', field: 'zip', resizable: true, width: 100 },
    { headerName: 'Amout', field: 'amount', resizable: true, width: 100 },
    { headerName: 'Qty', field: 'qty', resizable: true, width: 100 },
    { headerName: 'Item', field: 'item', resizable: true, width: 100 },
    /* {
      headerName: 'Edit', cellRenderer: 'buttonComponent', cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: 'Edit'
      },
      resizable: true, width: 100
    }, {
      headerName: 'Delete', cellRenderer: 'buttonComponent', cellRendererParams: {
        onClick: this.onDeleteButtonClick.bind(this),
        label: 'Delete'
      },
      resizable: true, width: 100
    } */
  ];

  onCellValueChanged(event: any) {
    console.log(event);
  }

  defaultColDef = {
    sortable: true,
    resizable: true
  };

  ngOnInit(): void {
    //this.getAll();
  }

  //action for edit button
  onEditButtonClick() {
    //this.row = params.data;
    this.row = this.selectedRows[0];
    this.editModal.openModal();
    //console.log(this.row);
  }

  //action for delete button
  /* onDeleteButtonClick(params: any) {
    this.deleteAction(params.data);
  }
  */

  // get all record 
  getAllRecord() {
    this._list = this.dataService.getAll().subscribe({
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
    this.addModal.openModal();
  }

  // call this action by child component
  callByChildAction(): void {
    this.getAllRecord();
  }

  // delete action
  deleteAction(): void {
    
    if(this.selectedRows.length == 0) {
      return;
    }

    if (!confirm('Are you sure?')) {
      return;
    }

    if (this.deleteActionSubmit) {
      return;
    }

    this.deleteActionSubmit = true;
    // fetch all ids
    let ids: Array<any> = [];
    this.selectedRows.forEach((element) => {
      ids.push(element.id);
    });
    
    this._deleteSub = this.dataService.delete(ids).subscribe({
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

  onSelectionChanged(event: any) {
    this.selectedRows = this.gridApi.getSelectedRows();
    console.log(this.selectedRows);
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getAllRecord();
  }

}

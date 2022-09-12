import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AddModalComponent } from './add-modal.component';

describe('AddModalComponent', () => {
  let component: AddModalComponent;
  let fixture: ComponentFixture<AddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModalComponent ],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test case for contain default value
  it('should contain a default value for the AddForm', () => {
    expect(component.addForm.value).toEqual({
      name: '',
      state: '',
      zip: '',
      amount: '',
      qty: '',
      item: '',
    });
  });

  // test case for add form invalid check
  it('AddForm invalid when empty', () => {
    expect(component.addForm.valid).toBeFalsy();
  });

  // test case for check validation affForm with defautl record
  it('should be valid if AddForm value is valid', () => {
    component.addForm.setValue({
      name: 'Brie larson',
      state: 'Noida',
      zip: '201345',
      amount: '10',
      qty: '1',
      item: '212RFRER',
    });

    expect(component.addForm.valid).toEqual(true);
  });

});

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { EditModalComponent } from './edit-modal.component';

describe('EditModalComponent', () => {
  let component: EditModalComponent;
  let fixture: ComponentFixture<EditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditModalComponent ],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // test case for contain default value
  it('should contain a default value for the EditForm', () => {
    expect(component.editForm.value).toEqual({
      id: '',
      name: '',
      state: '',
      zip: '',
      amount: '',
      qty: '',
      item: '',
    });
  });

  // test case for add form invalid check
  it('EditForm invalid when empty', () => {
    expect(component.editForm.valid).toBeFalsy();
  });

  // test case for check validation affForm with defautl record
  it('should be valid if EditForm value is valid', () => {
    component.editForm.setValue({
      id: '1',
      name: 'Brie larson',
      state: 'Noida',
      zip: '201345',
      amount: '100.00',
      qty: '1',
      item: '212RFRER',
    });

    expect(component.editForm.valid).toEqual(true);
  });
});

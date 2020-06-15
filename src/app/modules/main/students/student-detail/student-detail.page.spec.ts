import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailPage } from './student-detail.page';

describe('StudentDetailPage', () => {
  let component: StudentDetailPage;
  let fixture: ComponentFixture<StudentDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

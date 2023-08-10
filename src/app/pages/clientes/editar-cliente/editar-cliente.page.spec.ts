import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarClientePage } from './editar-cliente.page';

describe('EditarClientePage', () => {
  let component: EditarClientePage;
  let fixture: ComponentFixture<EditarClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

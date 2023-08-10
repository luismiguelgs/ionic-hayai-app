import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevoClientePage } from './nuevo-cliente.page';

describe('NuevoClientePage', () => {
  let component: NuevoClientePage;
  let fixture: ComponentFixture<NuevoClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CajaPage } from './caja.page';

describe('CajaPage', () => {
  let component: CajaPage;
  let fixture: ComponentFixture<CajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

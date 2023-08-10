import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImpagosPage } from './impagos.page';

describe('ImpagosPage', () => {
  let component: ImpagosPage;
  let fixture: ComponentFixture<ImpagosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpagosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImpagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

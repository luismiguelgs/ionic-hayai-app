import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private wide: boolean = false;

  public appPages = [
    {
      titulo: 'Inicio',
      url: 'home',
      icon: 'home-outline'
    },
    {
      titulo: 'Pedidos',
      url: 'pedidos',
      icon: 'create-outline'
    },
    {
      titulo: 'Clientes',
      url: 'clientes',
      icon: 'people-outline'
    },
    {
      titulo: 'Productos',
      url: 'productos',
      icon: 'layers-outline'
    },
    {
      titulo: 'Caja',
      url: 'caja',
      icon: 'wallet-outline'
    },
    {
      titulo: 'Impagos',
      url: 'impagos',
      icon: 'cash-outline'
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  onLogout()
  {}
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  username = '';
  password = '';
  message = '';

  constructor(
    private auth: AuthService,
    private router: Router 
  ) {}

  doLogin() {
    this.auth.login(this.username, this.password).subscribe(res => {
      if (res.success) {
        // this.message = '✅ Login exitoso. Token generado: ' + res.token;
          // ✅ Redirigir a tabs
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
      } else {
        this.message = '❌ ' + res.message;
      }
    });
  }
}

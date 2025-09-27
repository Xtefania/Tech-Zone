import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'assets/user.json'; // Archivo local

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.get<any>(this.usersUrl).pipe(
      map(data => {
        const user = data.users.find((u: any) => u.username === username && u.password === password);

        if (user) {
          // Generamos un "token falso"
          const fakeToken = 'fake-jwt-token-' + new Date().getTime();
          
          // Guardar en Preferences
          Preferences.set({
            key: 'auth',
            value: JSON.stringify({ token: fakeToken, user })
          });

          return { success: true, token: fakeToken, user };
        } else {
          return { success: false, message: 'Credenciales inválidas' };
        }
      })
    );
  }

  async logout() {
    await Preferences.remove({ key: 'auth' });
  }

  async getAuthData() {
    const res = await Preferences.get({ key: 'auth' });
    return res.value ? JSON.parse(res.value) : null;
  }
}

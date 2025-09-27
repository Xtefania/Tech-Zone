import { Component, OnInit  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})


export class Tab1Page implements OnInit {

  noticias: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getNoticias();
  }

  getNoticias() {
    const url = 'https://google-news13.p.rapidapi.com/technology?lr=en-US';
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': '45a7390bb8mshfad62026a5ac758p1962bfjsn348f1e606a17',
      'X-RapidAPI-Host': 'google-news13.p.rapidapi.com'
    });

    

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Respuesta completa de la API:', data);
        this.noticias = data.items || data.articles || []; 
      },
      error: (err) => {
        console.error('Error al cargar noticias', err);
      }



    });
  }
}
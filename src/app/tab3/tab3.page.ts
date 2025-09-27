import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  carrito: any[] = [];

  constructor(private cartService: CartService) {}

  ionViewWillEnter() {
    this.carrito = this.cartService.getCarrito();
  }

  aumentar(item: any) {
    this.cartService.aumentarCantidad(item);
  }

  disminuir(item: any) {
    this.cartService.disminuirCantidad(item);
  }

  total() {
    return this.cartService.calcularTotal();
  }

  limpiar() {
    this.cartService.limpiarCarrito();
    this.carrito = [];
  }
}
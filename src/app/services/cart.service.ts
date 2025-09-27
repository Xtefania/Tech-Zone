import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito: any[] = [];

  getCarrito() {
    return this.carrito;
  }

  agregarProducto(producto: any) {
    const existente = this.carrito.find(p => p.id === producto.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  aumentarCantidad(producto: any) {
    const existente = this.carrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    }
  }

  disminuirCantidad(producto: any) {
    const existente = this.carrito.find(p => p.id === producto.id);
    if (existente && existente.cantidad > 1) {
      existente.cantidad -= 1;
    }
  }

  limpiarCarrito() {
    this.carrito = [];
  }

  calcularTotal() {
    return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }
}
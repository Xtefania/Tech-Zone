import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { Preferences } from '@capacitor/preferences';
import { CartService } from '../services/cart.service'; //Carrito

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})

export class Tab2Page {

  // Lista de productos y sus datos
  productos = [  
    {
      id: 'monitor5', 
      nombre: 'Monitor Gamer Gigabyte 25″',
      precio: 823000,
      imagen: 'assets/monitor5.JPG',
      categoria: 'monitores'
    },
      {
      id: 'monitor3',
      nombre: 'Monitor MSI 49″',
      precio: 6200000,
      imagen: 'assets/monitor3.JPG',
      categoria: 'monitores'
    },
    {
      id: 'ram3',
      nombre: 'Predator Hermes 48GB RAM',
      precio: 1807000,
      imagen: 'assets/ram3.JPG',
      categoria: 'ram'
    },
    {
      id: 'ram2',
      nombre: 'Memoria RAM 32GB',
      precio: 444000,
      imagen: 'assets/ram2.JPG',
      categoria: 'ram'
    }
  ];

  categorias: { nombre: string, productos: any[] }[] = [];

  constructor(
    public photoService: PhotoService,
    private cartService: CartService   //Carrito
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
    // Recuperar fotos personalizadas de Preferences
    for (let producto of this.productos) {
      const { value } = await Preferences.get({ key: `foto-${producto.id}` });
      if (value) {
        producto.imagen = value; // Reemplaza imagen por la guardada
      }
    }

    // Agrupar productos por categoría
    const categoriasUnicas = [...new Set(this.productos.map(p => p.categoria))];

    this.categorias = categoriasUnicas.map(cat => ({
      nombre: cat,
      productos: this.productos.filter(p => p.categoria === cat)
    }));
  }

  async cambiarImagen(index: number, categoria: string) {
    const nuevaFoto: UserPhoto | undefined = await this.photoService.addNewToGallery();

    if (nuevaFoto?.webviewPath) {
      const categoriaObj = this.categorias.find(c => c.nombre === categoria);

      if (categoriaObj) {
        const producto = categoriaObj.productos[index];
        producto.imagen = nuevaFoto.webviewPath;


        //  Guardar nueva foto en Preferences con clave única
        await Preferences.set({
          key: `foto-${producto.id}`,
          value: producto.imagen
        });
      }
    }
  }
  agregarAlCarrito(producto: any) {
    this.cartService.agregarProducto(producto);
    console.log("Carrito:", this.cartService.getCarrito());
  }
}
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  // Toma y guarda la nueva foto
  public async addNewToGallery(): Promise<UserPhoto> {

  // Capturar foto
  const capturedPhoto = await Camera.getPhoto({
    resultType: CameraResultType.Uri,  // Usa URI, mejor rendimiento
    source: CameraSource.Camera,        // abrir cámara directamente 
    quality: 100     // highest quality (0 to 100)
  });


  // Guardar imagen y mostrarla en la galería
  const savedImageFile = await this.savePicture(capturedPhoto);
  this.photos.unshift(savedImageFile);


  await Preferences.set({
  key: this.PHOTO_STORAGE,
  value: JSON.stringify(this.photos),
});

  //  Retornar la nueva foto
    return savedImageFile;
  }

  //Carga fotos almacenadas
  public async loadSaved() {  
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];


    for (let photo of this.photos) {
      try{
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

    // Web mostrar como base64
    photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    } catch (e) {
        console.warn('No se pudo leer archivo guardado:', photo.filepath, e);
      }
    }

}

  //Guardar en disco
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    // Convierta una foto al formato base64, requerido por la API del sistema de archivos para guardar
    const base64Data = await this.readAsBase64(photo);

    // Escribe el archivo en el directorio de datos.
    const fileName = Date.now() + '.jpeg';
    await Filesystem.writeFile({
    //const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Utiliza webPath para mostrar la nueva imagen en lugar de base64 
    // ya cargado en la memoria
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  //Convertir imagen a Base64
  private async readAsBase64(photo: Photo): Promise<string>  {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
}

private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(blob);


  //reader.onload = () => {
    //  resolve(reader.result);
  //};
  //reader.readAsDataURL(blob);
});

}

// export interface UserPhoto {
//   filepath: string;
//   webviewPath?: string;
// }



/*  this.photos.unshift({
    filepath: "soon...",
    webviewPath: capturedPhoto.webPath!
  }); */




export class User {

  username: string ;
  email: string ;
  apellido: string ;
  nombre: string ;
  celular: string;
  telefono: string;
  estado: string;
  id?: string;




  constructor({ apellido, email,  username,  nombre, celular ,  telefono, id , estado}) {

    this.apellido = apellido;
    this.email = email;
    this.username = username;
    this.nombre = nombre;
    this.celular = celular;
    this.telefono = telefono;
    this.id = id;
    this.estado = estado;

  }
}

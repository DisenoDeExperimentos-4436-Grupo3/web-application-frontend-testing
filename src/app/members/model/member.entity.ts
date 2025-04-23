export class Member {
  id: number;
  fullName: string; // Nombre completo como cadena de texto
  email: string; // Email como cadena de texto
  streetAddress: string; // Dirección como cadena de texto
  role: string; // Rol como cadena de texto

  constructor() {
    this.id = 0;
    this.fullName = ''; // Inicializado como cadena vacía
    this.email = ''; // Inicializado como cadena vacía
    this.streetAddress = ''; // Inicializado como cadena vacía
    this.role = ''; // Inicializado como cadena vacía
  }
}


  import { Role } from './role.entity';
  import { PersonName } from './person-name.entity'; // Importa PersonName

  export class Member {
      id: number;
      personName: PersonName;  // Cambiado para usar PersonName

      role: string;  // Cambiado para que sea una cadena simple, si no necesitas propiedades adicionales en Role

      constructor() {
          this.id = 0;
          this.personName = new PersonName('');  // Asigna un nuevo objeto PersonName

          this.role = '';  // Define como una cadena vacía si el rol es solo texto
      }
  }

import { History } from './history.entity';

export class Issue {
    id: number;
    title: string;
    sprintAssociate: string;
    description: string;
    status: string;
    priority: string;
    assignedTo: string;
    madeBy: string;
    resolutionDate: string ;
    createdIn: string;
    history: History[];  // Cambiar el tipo a un array de History

    constructor() {
        this.id = 0;
        this.title = "";
        this.sprintAssociate = "";
        this.description = "";
        this.status = "";
        this.priority = "";
        this.assignedTo = "";
        this.madeBy = "";
        this.resolutionDate = "";  // Puede ser null, por eso añadimos esta posibilidad
        this.createdIn = "";
        this.history = [];  // Inicializar como un array vacío de History
    }
}

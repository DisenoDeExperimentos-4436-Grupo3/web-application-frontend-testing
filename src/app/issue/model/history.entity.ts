export class History {
    id: number;
    createdDate: string;
    madeBy: string;
    eventName: string;
    description: string;

    constructor() {
        this.id = 0;
        this.createdDate = "";
        this.madeBy = "";
        this.eventName = "";
        this.description = "";
    }
}

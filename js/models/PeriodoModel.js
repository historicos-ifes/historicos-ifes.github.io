class Periodo {
    constructor(Numero) {
        this.Numero = Numero;
        this.Materias = new Array();
    }
    addMateria(materia) {
        this.Materias.push(materia);
    }
}

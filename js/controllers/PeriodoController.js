class PeriodoController {
    constructor(materias) {
        this._periodos = new Array();
        this._materias = materias;
    }
    separaPeriodos(numPeriodos) {
        for (let index = 1; index <= numPeriodos; index++) {
            this.separaPeriodo(index);
        }
        this.ordenaPeriodos();
        return this._periodos;
    }
    ordenaPeriodos() {
        this._periodos = this._periodos.map(item => {
            item.Materias = item.Materias.sort((a, b) => (a.Ordem > b.Ordem) ? 1 : -1);
            return item;
        });
    }
    separaPeriodo(numPeriodo) {
        let materias = this._materias;
        var per = new Periodo(numPeriodo);
        materias.forEach(materia => {
            if (materia.Periodo == numPeriodo)
                per.addMateria(materia);
        });
        this.addPeriodo(per);
    }
    addPeriodo(periodo) {
        this._periodos.push(periodo);
    }
}

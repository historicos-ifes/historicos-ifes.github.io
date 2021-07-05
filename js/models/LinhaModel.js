class Linha {
    constructor(numLinha, periodos) {
        this.Colunas = new Array();
        this._periodos = periodos;
        this.Numero = numLinha;
        this.Id = `rowMaterias${numLinha}`;
        this.Elemento = document.querySelector(`#${this.Id}`);
        this.getColunas(numLinha);
    }
    getColunas(numLinha) {
        this._periodos.forEach(periodo => {
            let materia = periodo.Materias.filter(obj => {
                return obj.Ordem == numLinha;
            });
            if (materia.length > 0)
                this.addColuna(materia[0]);
            else
                this.addVazio();
        });
    }
    addColuna(materia) {
        this.Colunas.push(`<td style="border: 1px solid black;vertical-align: middle;" onClick="MarkAsFeito(this)" id="mat${materia.Id}" class="${materia.Feito.toString() == "true" ? ' bg-success' : ' bg-warning'}"><p><strong>${materia.Titulo}</strong></p></td>`);
    }
    addVazio() {
        this.Colunas.push(`
            <td></td>
        `);
    }
    getHtml() {
        return this.Colunas.join(" ");
    }
}

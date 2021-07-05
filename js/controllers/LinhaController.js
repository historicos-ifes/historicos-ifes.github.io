class LinhaController {
    constructor(periodos, qtdMaterias) {
        this._linhas = new Array();
        for (let linha = 1; linha <= qtdMaterias; linha++) {
            this._linhas.push(new Linha(linha, periodos));
        }
    }
    Init() {
        this._linhas.forEach(linha => {
            linha.Elemento.innerHTML = linha.getHtml();
        });
    }
}

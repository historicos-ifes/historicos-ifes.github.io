var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class HistoricoController {
    constructor() {
        this._materiaController = new MateriaController();
        this._dataUrl = "https://json.extendsclass.com/bin/7f45feede9d5";
        this.usuarioFront = null;
        this._usuario = null;
        this._url = null;
        this._qtdMaterias = 0;
        this._qtdPeriodos = 0;
    }
    getMaterias() {
        return this._materias;
    }
    Setup(location) {
        return __awaiter(this, void 0, void 0, function* () {
            this._materias = yield this._materiaController.loadMaterias(this._url, location);
            this._qtdPeriodos = Math.max.apply(Math, this._materias.map(function (o) { return o.Periodo; }));
            this._qtdMaterias = Math.max.apply(Math, this._materias.map(function (o) { return o.Ordem; }));
            this.insereElementosPeriodos(this._qtdPeriodos);
            this.insereElementosLinhas(this._qtdMaterias);
            this._periodoController = new PeriodoController(this._materias);
            this._periodos = yield this._periodoController.separaPeriodos(this._qtdPeriodos);
            this._linhaController = new LinhaController(this._periodos, this._qtdMaterias);
        });
    }
    Update() {
        return __awaiter(this, void 0, void 0, function* () {
            this._periodoController = new PeriodoController(this._materias);
            this._periodos = yield this._periodoController.separaPeriodos(this._qtdPeriodos);
            this._linhaController = new LinhaController(this._periodos, this._qtdMaterias);
        });
    }
    Init() {
        this._linhaController.Init();
    }
    VerificaDependencias(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const found = this._materias.find(x => x.Id == id);
                if (found) {
                    const foundMateria = found;
                    const depend = foundMateria.Dependencias;
                    if (depend.length > 0) {
                        depend.forEach((matId, ind) => {
                            if (this._materias.find(x => x.Id == matId && x.EstadoId == 3) != null) {
                                if (ind == depend.length - 1) {
                                    resolve(true);
                                }
                                return;
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    alterarEstado(id, novoEstadoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var element = document.getElementById(id);
            var idNum = parseInt(id.split("mat")[1]);
            var mudou = yield this.ChangeInObj(idNum, novoEstadoId);
            if (mudou) {
                switch (novoEstadoId) {
                    case 1: //Não concluída
                        if (element.classList.contains("bg-primary"))
                            element.classList.remove("bg-primary");
                        if (element.classList.contains("bg-success"))
                            element.classList.remove("bg-success");
                        if (!element.classList.contains("bg-danger"))
                            element.classList.add("bg-danger");
                        break;
                    case 2: //Cursando
                        if (element.classList.contains("bg-danger"))
                            element.classList.remove("bg-danger");
                        if (element.classList.contains("bg-success"))
                            element.classList.remove("bg-success");
                        if (!element.classList.contains("bg-primary"))
                            element.classList.add("bg-primary");
                        break;
                    case 3: //Concluída
                        if (element.classList.contains("bg-primary"))
                            element.classList.remove("bg-primary");
                        if (element.classList.contains("bg-danger"))
                            element.classList.remove("bg-danger");
                        if (!element.classList.contains("bg-success"))
                            element.classList.add("bg-success");
                        break;
                }
            }
        });
    }
    ChangeInObj(id, estadoId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this._materias.length; index++) {
                const element = this._materias[index];
                if (element.Id == id) {
                    this._materias[index].EstadoId = estadoId;
                    yield this.Update();
                    return true;
                }
            }
            return false;
        });
    }
    EditarMateria(materia) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this._materias.length; index++) {
                const element = this._materias[index];
                if (element.Id == materia.Id) {
                    this._materias[index].CargaHoraria = materia.CargaHoraria;
                    this._materias[index].Dependencias = materia.Dependencias;
                    this._materias[index].EstadoId = materia.EstadoId;
                    this._materias[index].Ordem = materia.Ordem;
                    this._materias[index].Periodo = materia.Periodo;
                    this._materias[index].Titulo = materia.Titulo;
                    yield this.Update();
                    $('#btnTypePassword').click();
                    return true;
                }
            }
            return false;
        });
    }
    salvarHistorico(p) {
        return __awaiter(this, void 0, void 0, function* () {
            $.ajax({
                url: this._url,
                type: "PUT",
                headers: {
                    "Security-key": p,
                },
                data: JSON.stringify(this._materias),
                success: function (result) {
                    $("#close2").click();
                    toastr["success"]("Histórico salvo com sucesso!", "Sucesso");
                },
                error: function (error) {
                    toastr["error"]("Senha incorreta!", "Erro");
                }
            });
        });
    }
    setUser(p) {
        return __awaiter(this, void 0, void 0, function* () {
            this.usuarioFront = p;
            this._usuario = null;
            yield $.getJSON(this._dataUrl, (data) => {
                if (data) {
                    data.forEach(user => {
                        if (user.USER == p) {
                            this._usuario = user.USER;
                            this._url = user.URL;
                        }
                    });
                    if (this._usuario != null) {
                        toastr["success"]("Dados carregados com sucesso! Aguarde um pouco que seu historico irá aparecer.", "Sucesso");
                        $("#close1").click();
                        return;
                    }
                    else {
                        this.usuarioFront = null;
                        this._usuario = null;
                        toastr["error"]("Falha ao carregar seus dados(1)!", "Erro");
                        return;
                    }
                }
            }).fail(function () {
                this.usuarioFront = null;
                this._usuario = null;
                toastr["error"]("Falha ao carregar seus dados(2)!", "Erro");
                return;
            });
        });
    }
    insereElementosPeriodos(num) {
        var lst = new Array();
        for (let index = 1; index <= num; index++) {
            lst.push(`<th scope="col">${index}º Período</th>`);
        }
        var html = lst.join(" ");
        document.querySelector("#periodosHeader").innerHTML = html;
    }
    insereElementosLinhas(num) {
        var lst = new Array();
        for (let index = 1; index <= num; index++) {
            lst.push(`<tr  id="rowMaterias${index}"></tr>`);
        }
        var html = lst.join(" ");
        document.querySelector("#tabelaBody").innerHTML = html;
    }
}

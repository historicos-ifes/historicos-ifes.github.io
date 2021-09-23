var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var idTimeout = null;
toastr.options.closeButton = false;
toastr.options.debug = false;
toastr.options.newestOnTop = false;
toastr.options.progressBar = false;
toastr.options.positionClass = "toast-top-right";
toastr.options.preventDuplicates = false;
toastr.options.onclick = null;
toastr.options.showDuration = 300;
toastr.options.hideDuration = 1000;
toastr.options.timeOut = 2000;
toastr.options.extendedTimeOut = 1000;
toastr.options.showEasing = "swing";
toastr.options.hideEasing = "linear";
toastr.options.showMethod = "fadeIn";
toastr.options.hideMethod = "fadeOut";
const controller = new HistoricoController();
const debug = location.protocol.includes("file") ? true : false;
var _materias;
var materiaEditAtual = null;
var loadedState = {
    aInternal: false,
    aListener: function (val) { },
    set value(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get value() {
        return this.aInternal;
    },
    registerListener: function (listener) {
        this.aListener = listener;
    },
    ativo: true
};
$('#tabelaBody').on('DOMNodeInserted', function (e) {
    loadedState.value = true;
    $('#tabelaBody').unwrap('DOMNodeInserted');
});
$('#btnEditMateria').attr('disabled', 'true');
$('#btnTypePassword').attr('disabled', 'true');
loadedState.registerListener(function (val) {
    if (loadedState.ativo) {
        loadedState.ativo = false;
        $('#btnEditMateria').removeAttr('disabled');
        $('#btnTypePassword').removeAttr('disabled');
    }
});
function getUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (debug) {
            $('#user-load').val("joao-casagrande");
            $("#btnCarregar").click();
        }
        else {
            const queryString = document.location.search;
            const urlParams = new URLSearchParams(queryString);
            const user = urlParams.get("user");
            if (user) {
                const exists = yield controller.checkUser(user);
                if (exists) {
                    toastr["success"](`Usuário '${user}' encontrado. Carregando dados..`);
                    setTimeout(() => {
                        $('#user-load').val(user);
                        $("#btnCarregar").click();
                    }, 1000);
                }
                else {
                    toastr["warning"](`Usuário '${user}' inexistente. Insira manualmente o usuário.`);
                    $("#btnTypeUser").click();
                }
            }
            else {
                $("#btnTypeUser").click();
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        hideLoading();
        hideContent();
        drawCanvas();
        getUser();
        updateContent();
        setTimeout(function () {
        }, 2000);
    });
}
function verificaDependencias(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var idNum = parseInt(id.split("mat")[1]);
        return yield controller.VerificaDependencias(idNum);
    });
}
function alterarEstado(param) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = param.id;
        var ver = yield verificaDependencias(id);
        if (id) {
            var estadoIdAtual = getEstadoIdByClassName(param);
            if (estadoIdAtual > 0) {
                var nextEstado = getNextEstadoId(estadoIdAtual);
                if (!ver && nextEstado == 3)
                    toastr["warning"]("Você ainda não concluiu as pendências dessa matéria.");
                else if (nextEstado > 0)
                    yield controller.alterarEstado(id, nextEstado);
            }
        }
    });
}
function getNextEstadoId(estadoidAtual) {
    switch (estadoidAtual) {
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 1;
    }
}
function getEstadoIdByClassName(el) {
    if (el.classList.contains("bg-danger"))
        return 1;
    if (el.classList.contains("bg-primary"))
        return 2;
    if (el.classList.contains("bg-success"))
        return 3;
    return -1;
}
function setVisible(id, visible) {
    document.getElementById(id).style.display = visible ? 'block' : 'none';
}
function hideLoading() {
    setVisible('loadAnimation', false);
}
function showLoading() {
    setVisible('loadAnimation', true);
}
function showContent() {
    document.getElementById('tbCntn').style.display = 'block';
}
function hideContent() {
    document.getElementById('tbCntn').style.display = 'none';
}
$('#btnSalvar').on('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
        showLoading();
        let p = $('#pssw-save').val();
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield controller.salvarHistorico(p);
            hideLoading();
        }), 1000);
    });
});
$("#showPass").on('click', function () {
    var checkBox = $("#showPass");
    if (checkBox.prop("checked"))
        $("#pssw-save").prop('type', 'text');
    else
        $("#pssw-save").prop('type', 'password');
});
$("#btnTypePassword").on('click', function () {
    $("#showPass").prop("checked", false);
    $("#pssw-save").val("").prop('type', 'password');
});
$("form").bind("keypress", function (e) {
    if (e.keyCode == 13) {
        var targetId = e.target.id;
        e.preventDefault();
        if (targetId == "user-load")
            $('#btnCarregar').click();
        if (targetId == "pssw-save")
            $('#btnSalvar').click();
        return false;
    }
});
$("#btnTypeUser").on("click", () => {
    $("#user-load").val("");
    setTimeout(function () {
        $("#user-load").focus();
    }, 1000);
});
$("#btnCarregar").on("click", () => {
    showLoading();
    controller.setUser($('#user-load').val().toString());
    hideLoading();
});
function updateContent() {
    return __awaiter(this, void 0, void 0, function* () {
        idTimeout = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (controller.usuarioFront != null) {
                showLoading();
                yield controller.Setup(window.location);
                controller.Init();
                hideLoading();
                showContent();
                clearTimeout(idTimeout);
            }
        }), 1000);
    });
}
function drawCanvas() {
    var cores = ["#d9534f", "#5cb85c", "#0275d8"];
    cores.forEach((element, index) => {
        var canvas = document.getElementById(`legenda${index + 1}`);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = element;
        ctx.fillRect(0, 0, 30, 30);
    });
}
$('#btnEditMateria').on('click', (e) => {
    limpaCamposEditMateria();
    var materias = controller.getMaterias();
    this._materias = materias;
    var selectMaterias = $('#dropdownMaterias');
    materias.forEach(element => {
        selectMaterias.append(`<option id="${element.Id}"  value="${element.Id}">${element.Titulo}</option>`);
    });
});
function getEstadoColorBootstrap(id) {
    switch (id) {
        case 1:
            return 'danger';
        case 2:
            return 'primary';
        case 3:
            return 'success';
    }
}
function getEstadoName(id) {
    switch (id) {
        case 1:
            return 'Não Concluído';
        case 2:
            return 'Cursando';
        case 3:
            return 'Concluído';
    }
}
function btnAddDependVisibile() {
    const valEl = $('#dropdownMaterias').val();
    const visible = valEl != null ? (parseInt(valEl.toString()) != 0 ? true : false) : false;
    document.getElementById('btnAddDepend').style.visibility = visible ? 'visible' : 'hidden';
    document.getElementById('alterarMateriaBodyWrapper').style.visibility = visible ? 'visible' : 'hidden';
    document.getElementById('alterarMateriaBodyWrapper').style.display = visible ? 'block' : 'none';
}
$('#dropdownMaterias').on("change", function () {
    btnAddDependVisibile();
    var idMat = $(this).find('option:selected').attr('id');
    const found = _materias.find(element => element.Id == parseInt(idMat));
    materiaEditAtual = found;
    if (found) {
        toggleEditFieldsDisabled(false);
        $("#editMateriaModalTitulo").text(`Alterando Matéria #${found.Id}`);
        $("#editEstado").val(found.EstadoId.toString());
        $("#editTitulo").val(found.Titulo);
        $("#editCargaHoraria").val(found.CargaHoraria);
        $("#editPeriodo").val(found.Periodo);
        $("#editOrdem").val(found.Ordem);
        var el = $('#listaDependenciasEdit');
        if (found.Dependencias.length > 0) {
            el.html("");
            el.append(`
            <div class="row">
                <div class="col-9">
                    <b><span class="text-dark">Título</span></b>
                </div>
                <div class="col-3">
                    <b><span class="text-dark">Estado</span></b>
                
                </div>
            </div>`);
            found.Dependencias.forEach(Dep => {
                const foundDep = _materias.find(materia => materia.Id == Dep);
                el.append(`
                <div id="Dep${foundDep.Id}" class="row">
                    <div class="col-9">
                        ${foundDep.Titulo}
                    </div>
                    <div class="col-3">
                    <span class="badge badge-${getEstadoColorBootstrap(foundDep.EstadoId)}">${getEstadoName(foundDep.EstadoId)}</span>
                    <span onclick="removeDepend(this)" title="Remover Dependência" class="badge badge-danger"><i class="fas fa-trash-alt"></i></span>
                    </div>
                </div>
              `);
            });
        }
        else {
            setZeroDependenciesHtml();
        }
    }
    else {
        limpaCamposEditMateria();
    }
});
function toggleEditFieldsDisabled(disabled) {
    if (disabled) {
        $("#editTitulo").attr('disabled', 'true');
        $("#editCargaHoraria").attr('disabled', 'true');
        $("#editPeriodo").attr('disabled', 'true');
        $("#editOrdem").attr('disabled', 'true');
        $("#btnEditar").attr('disabled', 'true');
    }
    else {
        $("#editTitulo").removeAttr('disabled');
        $("#editCargaHoraria").removeAttr('disabled');
        $("#editPeriodo").removeAttr('disabled');
        $("#editOrdem").removeAttr('disabled');
        $("#btnEditar").removeAttr('disabled');
    }
}
function limpaCamposEditMateria() {
    var selectMaterias = $('#dropdownMaterias');
    selectMaterias.html("");
    selectMaterias.append('<option id="0" selected readonly disabled value="0">Escolha uma matéria</option>');
    $("#editMateriaModalTitulo").text("Alterar Matéria");
    $("#dropdownMaterias").val("0");
    $("#editEstado").val("0");
    $("#editTitulo").val("");
    $("#editCargaHoraria").val("");
    $("#editPeriodo").val("");
    $("#editOrdem").val("");
    $('#listaDependenciasEdit').html('');
    toggleEditFieldsDisabled(true);
    ;
    btnAddDependVisibile();
}
$("#btnEditar").on('click', function () {
    return __awaiter(this, void 0, void 0, function* () {
        var ok = true;
        var editId = materiaEditAtual.Id;
        var editTit = $("#editTitulo").val().toString();
        var editEstado = $("#editEstado").val().toString();
        var editCargaHoraria = $("#editCargaHoraria").val().toString();
        var editPeriodo = $("#editPeriodo").val().toString();
        var editOrdem = $("#editOrdem").val().toString();
        if (!isNum(editEstado)) {
            ok = false;
            toastr["error"]("Estado inválido!", "Erro");
        }
        if (!isNum(editPeriodo)) {
            ok = false;
            toastr["error"]("Coluna deve ser um número!", "Erro");
        }
        if (!isNum(editCargaHoraria)) {
            ok = false;
            toastr["error"]("Carga Horária deve ser um número!", "Erro");
        }
        if (!isNum(editOrdem)) {
            ok = false;
            toastr["error"]("Linha deve ser um número!", "Erro");
        }
        if (!isEmpty(editEstado)) {
            ok = false;
            toastr["error"]("Estado não pode ser vazio!", "Erro");
        }
        if (!isEmpty(editPeriodo)) {
            ok = false;
            toastr["error"]("Coluna não pode ser vazio!", "Erro");
        }
        if (!isEmpty(editCargaHoraria)) {
            ok = false;
            toastr["error"]("Carga Horária não pode ser vazio!", "Erro");
        }
        if (!isEmpty(editOrdem)) {
            ok = false;
            toastr["error"]("Linha não pode ser vazio!", "Erro");
        }
        if (!isEmpty(editTit)) {
            ok = false;
            toastr["error"]("Título não pode ser vazio!", "Erro");
        }
        var editDependencias = [];
        var possuiDependencias = $("#listaDependenciasEdit").html().includes("Dep");
        if (possuiDependencias) {
            var temp = getDependencias();
            if (temp.length == 0)
                ok = false;
            else
                editDependencias = temp;
        }
        if (ok) {
            showLoading();
            var materiaEditada = new Materia(editTit, parseInt(editCargaHoraria), parseInt(editPeriodo), parseInt(editOrdem), parseInt(editEstado), editId, editDependencias);
            var res = yield controller.EditarMateria(materiaEditada);
            if (res) {
                toastr["success"]("Matéria editada com sucesso!", "Sucesso");
                $("#close3").click();
            }
            else {
                toastr["error"]("Erro ao editar matéria!", "Erro");
            }
            hideLoading();
        }
        else {
            toastr["error"]("Erro ao editar matéria!", "Erro");
        }
    });
});
function isNum(val) {
    return /^\d+$/.test(val);
}
function isEmpty(val) {
    return !/^ *$/.test(val);
}
function getDependencias() {
    var lst = [];
    var lstDivs = $("#listaDependenciasEdit").find("div[id]").toArray();
    lstDivs.forEach(div => {
        var _a;
        var divId = (_a = div === null || div === void 0 ? void 0 : div.getAttribute('id')) === null || _a === void 0 ? void 0 : _a.toString();
        var splt = divId.split("Dep");
        if (splt.length != 2) {
            var tit = $(`#${divId}`).find('div').first().text();
            toastr["error"](`Dependencia '${tit}' inválida!`, "Erro");
            return new Array();
        }
        else {
            lst.push(parseInt(splt[1]));
        }
    });
    return lst;
}
function addDepend(param) {
    $("#addNewDepend").modal('show');
    var materias = this._materias;
    var selectMaterias = $('#dropdownMaterias2');
    materias.forEach(element => {
        selectMaterias.append(`<option id="${element.Id}"  value="${element.Id}">${element.Titulo}</option>`);
    });
    $('#dropdownMaterias2').val("0");
}
$('#dropdownMaterias2').on("change", function () {
    var materias = _materias;
    var idMat = $(this).find('option:selected').attr('id');
    const found = materias.find(element => element.Id == parseInt(idMat));
    if (found) {
        var el = $('#listaDependenciasEdit');
        var possuiDependencias = $("#listaDependenciasEdit").html().includes("Dep");
        if (!possuiDependencias) {
            el.html("");
            el.append(`<div id="Dep${found.Id}" class="row">
                <div class="col-9">
                    ${found.Titulo}
                </div>
                <div class="col-3">
                <span class="badge badge-${getEstadoColorBootstrap(found.EstadoId)}">${getEstadoName(found.EstadoId)}</span>
                <span onclick="removeDepend(this)" title="Remover Dependência" class="badge badge-danger"><i class="fas fa-trash-alt"></i></span>
                </div>
            </div>`);
        }
        else {
            var dependencias = getDependencias();
            if (dependencias.indexOf(parseInt(idMat)) >= 0) {
                toastr["warning"]("Dependência já está presente.");
            }
            else {
                el.append(`<div id="Dep${found.Id}" class="row">
                    <div class="col-9">
                        ${found.Titulo}
                    </div>
                    <div class="col-3">
                    <span class="badge badge-${getEstadoColorBootstrap(found.EstadoId)}">${getEstadoName(found.EstadoId)}</span>
                    <span onclick="removeDepend(this)" title="Remover Dependência" class="badge badge-danger"><i class="fas fa-trash-alt"></i></span>
                    </div>
                </div>`);
            }
        }
    }
    $("#addNewDepend").modal('hide');
});
function removeDepend(_this) {
    var parent = _this.closest("div .row");
    parent.remove();
    var totalCount = $("#listaDependenciasEdit > div").length;
    if (totalCount == 0)
        setZeroDependenciesHtml();
}
function setZeroDependenciesHtml() {
    var el = $('#listaDependenciasEdit');
    el.html(`
         <div class="card bg-secondary col-12" style="width:100%;">
            <div class="card-body">
                <p class="card-text text-white"><b>Essa matéria não possui dependências.</b></p>
            </div>
        </div>`);
}
main();

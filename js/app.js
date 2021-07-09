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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        hideLoading();
        hideContent();
        drawCanvas();
        $("#btnTypeUser").click();
        updateContent();
    });
}
function alterarEstado(param) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = param.id;
        if (id) {
            var estadoIdAtual = getEstadoIdByClassName(param);
            if (estadoIdAtual > 0) {
                var nextEstado = getNextEstadoId(estadoIdAtual);
                if (nextEstado > 0)
                    yield controller.alterarEstado(id, getNextEstadoId(estadoIdAtual));
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
    if (el.classList.contains("bg-warning"))
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
        //
        let p = $('#pssw-save').val();
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield controller.salvarHistorico(p);
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
        //$('#btnSalvar').click();
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
});
function updateContent() {
    return __awaiter(this, void 0, void 0, function* () {
        idTimeout = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (controller.usuarioFront != null) {
                showLoading();
                yield controller.Setup();
                controller.Init();
                hideLoading();
                showContent();
                clearTimeout(idTimeout);
            }
        }), 5000);
    });
}
function drawCanvas() {
    var c1 = document.getElementById("legenda1");
    var c2 = document.getElementById("legenda2");
    var c3 = document.getElementById("legenda3");
    var ctx1 = c1.getContext("2d");
    var ctx2 = c2.getContext("2d");
    var ctx3 = c3.getContext("2d");
    ctx1.fillStyle = "#f0ad4e";
    ctx1.fillRect(0, 0, 30, 30);
    ctx2.fillStyle = "#5cb85c";
    ctx2.fillRect(0, 0, 30, 30);
    ctx3.fillStyle = "#0275d8";
    ctx3.fillRect(0, 0, 30, 30);
}
main();

class Materia {
    constructor(Titulo, CargaHoraria, Periodo, Ordem, EstadoId, Id, Dependencias) {
        this.Dependencias = [];
        this.Titulo = Titulo;
        this.CargaHoraria = CargaHoraria;
        this.Periodo = Periodo;
        this.Ordem = Ordem;
        this.EstadoId = EstadoId;
        this.Id = Id;
        this.Dependencias = Dependencias;
    }
}

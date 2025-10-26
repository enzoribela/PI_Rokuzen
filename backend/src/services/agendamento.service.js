const Agendamento = require("../models/Agendamento.model")

const {
  INTERVALO_TERAPEUTA_MINUTOS,
  INTERVALO_SALA_MINUTOS
} = require("../constants/validation.constants")


const minutosParaMs = (minutos) => minutos * 60 * 1000

async function checaDisponibilidade(inicio, fim, terapeutaId, salaId, agendamentoIdParaIgnorar = null) {

  const inicioTime = new Date(inicio).getTime()
  const fimTime = new Date(fim).getTime()

  // --- 1. Calcula os Blocos Virtuais de Tempo ---

  const intervaloTerapeutaMs = minutosParaMs(INTERVALO_TERAPEUTA_MINUTOS)
  const virtualStartTerapeuta = new Date(inicioTime - intervaloTerapeutaMs)
  const virtualEndTerapeuta = new Date(fimTime + intervaloTerapeutaMs)

  const intervaloSalaMs = minutosParaMs(INTERVALO_SALA_MINUTOS)
  const virtualStartSala = new Date(inicioTime - intervaloSalaMs)
  const virtualEndSala = new Date(fimTime + intervaloSalaMs)

  // --- 2. Constrói a Query de Conflito ---

  // Se estivermos editando, precisamos ignorar o próprio agendamento da checagem
  const queryBase = {}
  if(agendamentoIdParaIgnorar)
    queryBase._id = {$ne: agendamentoIdParaIgnorar} // $ne = Not Equal

  // Procura por QUALQUER agendamento que conflite com o bloco do terapeuta OU da sala
  const conflitoEncontrado = await Agendamento.findOne({
    ...queryBase, // Adiciona o filtro _id: { $ne: ... } se existir
    $or: [
      // Condição A: Conflito de Terapeuta
      {
        terapeuta: terapeutaId,
        inicio: { $lt: virtualEndTerapeuta },
        fim: { $gt: virtualStartTerapeuta }
      },
      // Condição B: Conflito de Sala
      {
        sala: salaId,
        inicio: { $lt: virtualEndSala },
        fim: { $gt: virtualStartSala }
      }
    ]
  })

  return conflitoEncontrado
}

// Exporta a função para ser usada pelos controllers
module.exports = {
  checaDisponibilidade
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao } from './transacao.schema';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
@Injectable()
export class TransacoesService {
  constructor(@InjectModel(Transacao.name) private readonly model: Model<Transacao>) {}
  async criar(dados: CriarTransacaoDto) { return this.model.create(dados); }
  async listar() {
    const historico = await this.model.find().lean().exec();
    // Soma em centavos para evitar residuos de ponto flutuante.
    let receitas = 0, despesas = 0, impulso = 0;
    for (const transacao of historico) {
      const centavos = Math.round(transacao.valor * 100);
      if (transacao.tipo === 'receita') receitas += centavos;
      else if (transacao.tipo === 'despesa') {
        despesas += centavos;
        if (transacao.consumoConsciente === false) impulso += centavos;
      }
    }
    return { historico, metricas: {
      saldoTotal: (receitas - despesas) / 100,
      totalDespesas: despesas / 100,
      totalGastoImpulso: impulso / 100,
    } };
  }
}

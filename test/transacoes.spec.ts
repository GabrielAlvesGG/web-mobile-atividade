import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { TransacoesService } from '../src/transacoes/transacoes.service';
import { Transacao } from '../src/transacoes/transacao.schema';
import { CriarTransacaoDto } from '../src/transacoes/dto/criar-transacao.dto';
async function montar(historico: object[]) {
  const model = {
    find: jest.fn().mockReturnValue({ lean: () => ({ exec: async () => historico }) }),
    create: jest.fn(async (dados) => ({ _id: 'exemplo', ...dados })),
  };
  const modulo = await Test.createTestingModule({ providers: [TransacoesService,
    { provide: getModelToken(Transacao.name), useValue: model }], }).compile();
  return { service: modulo.get(TransacoesService), model };
}
describe('Transacoes', () => {
  it('calcula metricas e preserva historico; receita nao conta como impulso', async () => {
    const historico = [
      { valor: 3000, tipo: 'receita', consumoConsciente: false },
      { valor: 1000, tipo: 'despesa', consumoConsciente: true },
      { valor: 150, tipo: 'despesa', consumoConsciente: false },
    ];
    const { service } = await montar(historico);
    expect(await service.listar()).toEqual({ historico, metricas: {
      saldoTotal: 1850, totalDespesas: 1150, totalGastoImpulso: 150,
    } });
  });
  it('retorna zeros sem registros', async () => {
    const { service } = await montar([]);
    expect((await service.listar()).metricas).toEqual({ saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 });
  });
  it('calcula centavos e saldo negativo', async () => {
    const { service } = await montar([
      { valor: 0.1, tipo: 'despesa', consumoConsciente: false },
      { valor: 0.2, tipo: 'despesa', consumoConsciente: false },
    ]);
    expect((await service.listar()).metricas).toEqual({ saldoTotal: -0.3, totalDespesas: 0.3, totalGastoImpulso: 0.3 });
  });
  it('encaminha cadastro ao banco', async () => {
    const { service, model } = await montar([]);
    const dados: CriarTransacaoDto = { descricao: 'Luz', valor: 100, tipo: 'despesa', categoria: 'Moradia', consumoConsciente: true };
    await service.criar(dados);
    expect(model.create).toHaveBeenCalledWith(dados);
  });
  it('valida campos e aceita booleano false', async () => {
    const dados = { descricao: 'Roupas', valor: 150, tipo: 'despesa', categoria: 'Lazer', consumoConsciente: false };
    expect(await validate(plainToInstance(CriarTransacaoDto, dados))).toHaveLength(0);
    for (const alteracao of [{ tipo: 'outro' }, { valor: -1 }, { valor: 1.001 }, { consumoConsciente: 'false' }, { descricao: '  ' }]) {
      expect((await validate(plainToInstance(CriarTransacaoDto, { ...dados, ...alteracao }))).length).toBeGreaterThan(0);
    }
  });
});

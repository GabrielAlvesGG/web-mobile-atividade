import { Body, Controller, Get, Post } from '@nestjs/common';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { TransacoesService } from './transacoes.service';
@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly service: TransacoesService) {}
  @Post()
  criar(@Body() dados: CriarTransacaoDto) { return this.service.criar(dados); }
  @Get()
  listar() { return this.service.listar(); }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ collection: 'transacoes', versionKey: false })
export class Transacao {
  @Prop({ required: true, trim: true })
  descricao!: string;
  @Prop({ required: true, min: 0.01 })
  valor!: number;
  @Prop({ required: true, enum: ['receita', 'despesa'] })
  tipo!: string;
  @Prop({ required: true, trim: true })
  categoria!: string;
  @Prop({ required: true })
  consumoConsciente!: boolean;
}
export const TransacaoSchema = SchemaFactory.createForClass(Transacao);

import { IsBoolean, IsIn, IsNumber, IsString, Matches, Min } from 'class-validator';
export class CriarTransacaoDto {
  @IsString()
  @Matches(/\S/)
  descricao!: string;
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0.01)
  valor!: number;
  @IsIn(['receita', 'despesa'])
  tipo!: 'receita' | 'despesa';
  @IsString()
  @Matches(/\S/)
  categoria!: string;
  @IsBoolean()
  consumoConsciente!: boolean;
}

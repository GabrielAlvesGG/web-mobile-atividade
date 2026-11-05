import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesModule } from './transacoes/transacoes.module';
@Module({
  imports: [MongooseModule.forRootAsync({ useFactory: () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('Configure MONGODB_URI no .env.');
    return { uri };
  } }), TransacoesModule],
})
export class AppModule {}

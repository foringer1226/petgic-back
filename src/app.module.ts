import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@petgic.ahybavw.mongodb.net/?retryWrites=true&w=majority&appName=petgic`,
    ),
    OrderModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

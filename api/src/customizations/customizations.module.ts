import { Module } from '@nestjs/common';
import { CustomizationsService } from './customizations.service';
import { CustomizationsController } from './customizations.controller';
import { Customization } from './entities/customization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Customization])],
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
})
export class CustomizationsModule {}

import { Module } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [CacheModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService, CacheService],
})
export class CotizacionesModule {}

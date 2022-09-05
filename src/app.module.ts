import { Module } from '@nestjs/common';
import { CotizacionesModule } from './modules/cotizaciones/cotizaciones.module';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [CotizacionesModule, CacheModule],
})
export class AppModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { Dolar } from './dto/cotizaciones-dto';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Get()
  findAll(
    @Query('dolar') dolar?: Dolar,
    @Query('evolucion') evolucion?: boolean,
  ) {
    if (dolar && !Object.values(Dolar).includes(dolar)) {
      return { error: 'Dolar no valido' };
    }
    if (!dolar && evolucion) {
      return { error: 'No se puede pedir evolucion sin dolar' };
    }
    return this.cotizacionesService.findAll(dolar, evolucion);
  }
}

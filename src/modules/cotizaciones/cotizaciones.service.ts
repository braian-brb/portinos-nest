import { Injectable } from '@nestjs/common';
import { Dolar } from './dto/cotizaciones-dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CotizacionesService {
  constructor(private readonly cacheService: CacheService) {}
  async findAll(dolar?: Dolar, evolucion?: boolean) {
    const cache = this.cacheService.getContentCache(dolar, evolucion);
    if (cache) {
      return cache;
    }

    const urls = getCotizacionesUrl(dolar, evolucion);
    const cotizaciones = await Promise.all(
      urls.map(async (url) => {
        const data = await getDataAPI(url);
        return data;
      }),
    );
    this.cacheService.saveResponse(cotizaciones);
    return cotizaciones;
  }
}

const getCotizacionesUrl = (dolar?: Dolar, evolucion?: boolean) => {
  const baseUrl = 'https://api-dolar-argentina.herokuapp.com/api';
  let CotizacionesUrls: string[];
  if (!dolar && !evolucion) {
    const arrayUrls = [
      'dolaroficial',
      'dolarblue',
      'contadoliqui',
      'dolarpromedio',
      'dolarturista',
      'evolucion/dolaroficial',
    ];
    CotizacionesUrls = arrayUrls.map((url) => `${baseUrl}/${url}`);
  }
  if (evolucion && dolar == Dolar.oficial) {
    return (CotizacionesUrls = [`${baseUrl}/evolucion/dolaroficial`]);
  }
  switch (dolar) {
    case Dolar.oficial:
      CotizacionesUrls = [`${baseUrl}/dolaroficial`];
      break;
    case Dolar.blue:
      CotizacionesUrls = [`${baseUrl}/dolarblue`];
      break;
    case Dolar.liqui:
      CotizacionesUrls = [`${baseUrl}/contadoliqui`];
      break;
    case Dolar.promedio:
      CotizacionesUrls = [`${baseUrl}/dolarpromedio`];
      break;
    case Dolar.turista:
      CotizacionesUrls = [`${baseUrl}/dolarturista`];
      break;
  }

  return CotizacionesUrls;
};

const getDataAPI = async (url: string) => {
  const tipoCotizacion = setTipoCambio(url);
  const response = await fetch(url);
  const data = await response.json();
  data.cambio = `Dolar ${tipoCotizacion}`;
  return data;
};

function setTipoCambio(url: string) {
  const urlSplited = url.split('/');
  if (urlSplited.at(-1) === 'contadoliqui') {
    return 'contado con liqui';
  }
  return (
    urlSplited.at(-1).split('dolar')[1] || urlSplited.at(-1).split('dolar')[0]
  );
}

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CacheService {
  cacheTimeLimit = 30;
  dolar: string;
  evolucion: boolean;

  setDolarAndEvolucion(dolar, evolucion) {
    this.dolar = dolar;
    this.evolucion = evolucion;
  }

  getContentCache(dolar, evolucion) {
    this.setDolarAndEvolucion(dolar, evolucion);
    this.deleteAllCacheIfTimeOut();
    const cacheFile = this.getFiles(dolar, evolucion);
    if (fs.existsSync(cacheFile)) {
      const cache = fs.readFileSync(cacheFile, 'utf8');
      return cache;
    }
    return null;
  }

  getFiles(dolar, evolucion) {
    this.setDolarAndEvolucion(dolar, evolucion);
    let cacheFile: string;
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }
    if (dolar && evolucion) {
      cacheFile = `./temp/${dolar}-${evolucion}.temp.json`;
    }
    if (dolar && !evolucion) {
      cacheFile = `./temp/${dolar}.temp.json`;
    }
    if (!dolar && !evolucion) {
      cacheFile = `./temp/all.temp.json`;
    }

    return cacheFile;
  }

  saveResponse(response) {
    const cacheFile = this.getFiles(this.dolar, this.evolucion);
    fs.writeFileSync(cacheFile, JSON.stringify(response));
  }

  getTimeFileInSeconds(cacheFile) {
    const stats = fs.statSync(cacheFile);
    const mtime = new Date(stats.mtime).getTime();
    const now = new Date().getTime();
    const diffTime = now - mtime;
    const diffTimeInSeconds = Math.round(diffTime / 1000);
    return diffTimeInSeconds;
  }

  deleteAllCacheIfTimeOut() {
    const files = fs.readdirSync('./temp');
    files.forEach((file) => {
      const cacheFile = `./temp/${file}`;
      const timeFile = this.getTimeFileInSeconds(cacheFile);
      if (timeFile > this.cacheTimeLimit) {
        fs.unlinkSync(cacheFile);
      }
    });
  }
}

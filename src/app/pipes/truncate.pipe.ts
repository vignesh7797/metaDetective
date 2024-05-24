import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): unknown {
    const limit = args[0] || 50;
    
    return value ? value.substring(0, limit) + '...' : '';
  }

}

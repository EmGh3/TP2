import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fibonacci',
  pure: true // pure par défaut, explicite pour la compréhension
})
export class FibonacciPipe implements PipeTransform {
  private cache = new Map<number, number>();

  transform(n: number): number {
    if (n === null || n === undefined) return 0;
    if (this.cache.has(n)) return this.cache.get(n)!;

    const result = this.fib(n);
    this.cache.set(n, result);
    return result;
  }

  private fib(n: number): number {
    console.log('Fibo called');

    if (n <= 1) return 1;
    // itération pour éviter la récursion exponentielle et la profondeur d'appel
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) {
      const c = a + b;
      a = b;
      b = c;
    }
    return b;
  }
}

import {Component, Input, Output, EventEmitter, NgZone, ChangeDetectionStrategy} from '@angular/core';
import {User} from "../users.service";

// Fonction Fibonacci optimisée avec memoization
const fibonnaci = (() => {
  const cache = new Map<number, number>();
  
  return (n: number): number => {
    if (n === 1 || n === 0) {
      return 1;
    }
    
    if (cache.has(n)) {
      return cache.get(n)!;
    }
    
    const result = fibonnaci(n - 1) + fibonnaci(n - 2);
    cache.set(n, result);
    return result;
  };
})();

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() usersCluster: string = '';
  @Input() users: User[] = [];
  @Output() add = new EventEmitter<string>();
  userFullName: string = '';

  constructor(private ngZone: NgZone) {}
  
  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }
  fibo(n: number): number {
    // Exécution hors de la zone Angular pour éviter le déclenchement de la détection de changement
    return this.ngZone.runOutsideAngular(() => {
      const fib = fibonnaci(n);
      console.log({n, fib});
      return fib;
    });
  }
}

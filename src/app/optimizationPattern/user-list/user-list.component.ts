import {Component, Input, Output, EventEmitter} from '@angular/core';
import {User} from "../users.service";

const fibCache = new Map<number, number>();

export const fibonacci = (n: number): number => {
  if (n <= 1) return 1;
  
  // Utilisation du cache
  if (fibCache.has(n)) {
    return fibCache.get(n)!;
  }
  
  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fibCache.set(n, result);
  return result;
}


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  
})
export class UserListComponent {
  @Input() usersCluster: string = '';
  @Input() users: User[] = [];
  @Output() add = new EventEmitter<string>();
  userFullName: string = '';
  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }
  fibo(n: number): number {
    const fib = fibonacci(n);
    console.log({n, fib});

    return fib;
  }
}

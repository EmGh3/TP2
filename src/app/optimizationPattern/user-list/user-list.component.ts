import {Component, Input, Output, EventEmitter} from '@angular/core';
import {User} from "../users.service";

export const fibonnaci = (n: number): number => {
  // iterative implementation to avoid deep recursion and heavy stack usage
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
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
    const fib = fibonnaci(n);
    console.log({n, fib});

    return fib;
  }
}

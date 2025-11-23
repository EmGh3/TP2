import { Component, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  switchMap,
  map,
  scan,
  startWith,
  tap,
} from "rxjs";
import { ProductService } from "./services/product.service";
import { Product } from "./dto/product.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  private loadMoreSubject = new BehaviorSubject<{ skip: number; limit: number }>({ skip: 0, limit: 12 });
  private totalProducts = 0;
  private loadedProducts = 0;

  products$!: Observable<Product[]>;
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.loadMoreSubject.pipe(
      switchMap(({ skip, limit }) => 
        this.productService.getProducts(skip, limit).pipe(
          tap(response => {
            this.totalProducts = response.total;
            this.loadedProducts = skip + response.products.length;
            console.log(`Loaded: ${this.loadedProducts}, Total: ${this.totalProducts}`);
          }),
          map(response => response.products)
        )
      ),
      scan((acc: Product[], current: Product[]) => [...acc, ...current], []),
      startWith([])
    );
  }

  loadMoreProducts(): void {
    const currentState = this.loadMoreSubject.value;
    const newSkip = currentState.skip + currentState.limit;
    
    // Vérifier s'il reste des produits à charger
    if (newSkip < this.totalProducts) {
      this.loadMoreSubject.next({ 
        skip: newSkip, 
        limit: currentState.limit 
      });
    }
  }

  get hasMoreProducts(): boolean {
    return this.loadedProducts < this.totalProducts;
  }
}
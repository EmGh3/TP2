import { Component, inject, signal, computed } from "@angular/core";
import { ProductService } from "./services/product.service";
import { Product } from "./dto/product.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  private productService = inject(ProductService);

  // State avec Signals
  products = signal<Product[]>([]);
  skip = signal<number>(0);
  limit = signal<number>(12);
  totalProducts = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals
  allProductsLoaded = computed(() => {
    return this.skip() + this.limit() >= this.totalProducts() && this.totalProducts() > 0;
  });

  hasMoreProducts = computed(() => {
    return !this.allProductsLoaded() && !this.isLoading();
  });

  loadedCount = computed(() => this.products().length);

  constructor() {
    this.loadInitialProducts();
  }

  private async loadInitialProducts(): Promise<void> {
    await this.loadMoreProducts();
  }

  async loadMoreProducts(): Promise<void> {
    if (this.allProductsLoaded() || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await this.productService.getProducts(
        { limit: this.limit(), skip: this.skip() }
      ).toPromise();

      if (response) {
        // Mettre à jour les produits
        this.products.update(current => [...current, ...response.products]);
        
        // Mettre à jour le total
        this.totalProducts.set(response.total);
        
        // Incrémenter le skip pour la prochaine requête
        this.skip.update(current => current + this.limit());
      }
    } catch (err) {
      this.error.set('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../dto/product.dto';

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(skip: number = 0, limit: number = 12): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }
}
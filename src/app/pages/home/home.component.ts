import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

const ROW_HEIGHT: { [id: number]: number } = {
  1: 400, 
  3: 335,
  4: 350
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html' ,
  styles: [
  ]
})

export class HomeComponent implements OnInit, OnDestroy {

  cols: number = 3;
  category: string | undefined;
  rowHeight = ROW_HEIGHT[this.cols];

  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productsSubscription: Subscription | undefined; // once we destory the component we do not want to have any memory leaks

  constructor(private cartService: CartService, private storeService: StoreService) {} 

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // update the products
  getProducts(): void {
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      })
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROW_HEIGHT[this.cols];
  }

  OnShowCategory(newCategory: string): void {
    console.log("category updated to: ", newCategory);
    this.category = newCategory;
    this.getProducts();
    console.log(this.products);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    });
  }

  onItemsCountChange(newcount: number): void {
    this.count = newcount.toString();
    // after updating count get products
    this.getProducts();
  }

  onSortChange(newsort: string): void {
    this.sort = newsort;
    // after updating sort get products
    this.getProducts();
  }
}

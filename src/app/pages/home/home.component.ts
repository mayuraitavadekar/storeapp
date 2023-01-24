import { Component } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

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

export class HomeComponent {

  cols: number = 3;
  category: string | undefined;
  rowHeight = ROW_HEIGHT[this.cols];

  constructor(private cartService: CartService) {} 

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROW_HEIGHT[this.cols];
  }

  OnShowCategory(newCategory: string): void {
    this.category = newCategory;
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
}

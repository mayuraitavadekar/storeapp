import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
  ]
})

export class CartComponent {
  cart: Cart = { items: [ {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1, 
    id: 1,
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 2, 
    id: 1,
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1, 
    id: 1,
  }] };

  dataSource: Array<CartItem> = [];
  
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckOut(): void {
    // call stripe service
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async(res: any) => {
      // load stripe
      let stripe = await loadStripe("pk_test_51MVq8IAd2LteMoOHqYUhlRwfQMWPPyHWhMfqSdoUBRLb4lbjjipiWvaupnkDG59DuvuYxwqzg6SmCqlsILGtVCfk00mn0tcqk9");
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    });
  }
}

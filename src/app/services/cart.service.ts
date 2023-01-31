import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Cart>({ items: []});

  constructor(private _snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id == item.id);
    if(itemInCart) {
      itemInCart.quantity += 1;
    }
    else
    {
      items.push(item);
    }

    this.cart.next({ items: items });

    this._snackBar.open('1 item is added to cart. ', 'Ok', {duration: 3000});
    console.log(this.cart.value);
  }

  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open("Cart is cleared.", "Ok", {duration: 3000});
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    // access subject and return after removal
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    )

    // check if we need to notify to all subscribers
    // this condition is added because removeQuantity also notifies to  the subscribers
    if(update) {
      // update subject
      this.cart.next({ items: filteredItems });
      this._snackBar.open("1 item removed from cart", "Ok", { duration: 3000 });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {

    let itemForRemoval: CartItem | undefined;

    // access subject and map over it
    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.id === item.id)  {
        _item.quantity--;
      }

      if(_item.quantity === 0)
      {
        // remove this item from cart
        itemForRemoval = _item;
      }

      return _item;
    });
    
    // if any item for removal
    if(itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    // update the subject
    this.cart.next({items: filteredItems});
    this._snackBar.open("1 item removed from cart.", "Ok", { duration: 3000});
  }
}

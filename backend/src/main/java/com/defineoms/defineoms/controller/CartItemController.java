package com.defineoms.defineoms.controller;

import com.defineoms.defineoms.service.CartItemService;
import com.defineoms.defineoms.entity.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// @RestController = Combined with @RequestMapping below, every endpoint
// in this file starts with /api/cart-item.
@RestController
@RequestMapping("/api/cart-item")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;
    // @PostMapping = this method only responds to POST requests
    // @RequestParam grabs values straight out of the URL's query string
    @PostMapping
    public CartItem addItem(@RequestParam Integer cartId,
                            @RequestParam Integer variantId,
                            @RequestParam Integer quantity) {

        return cartItemService.addItemToCart(cartId, variantId, quantity);
    }
    @GetMapping("/cart/{cartId}")
    public List<CartItem> getItems(@PathVariable Integer cartId) {

        return cartItemService.getItemsForCart(cartId);
    }

    @GetMapping("/subtotal/{cartId}")
    public double getSubtotal(@PathVariable Integer cartId) {

        return cartItemService.calculateCartSubtotal(cartId);
    }

    @PutMapping("/{cartItemId}")
    public CartItem updateQuantity(@PathVariable Integer cartItemId,
                                   @RequestParam Integer quantity) {
        return cartItemService.updateQuantity(cartItemId, quantity);
    }

    @DeleteMapping("/{cartItemId}")
    public void removeItem(@PathVariable Integer cartItemId) {

        cartItemService.removeItem(cartItemId);
    }
}

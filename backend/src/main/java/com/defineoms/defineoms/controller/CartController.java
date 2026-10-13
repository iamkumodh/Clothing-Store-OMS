package com.defineoms.defineoms.controller;

import com.defineoms.defineoms.service.CartService;
import com.defineoms.defineoms.entity.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET http://localhost:8080/api/cart/5  -> returns/creates cart for customer 5
    @GetMapping("/{customerId}")
    public Cart getCart(@PathVariable Integer customerId) {
        return cartService.getOrCreateCart(customerId);
    }

    // GET http://localhost:8080/api/cart  -> lists every cart (for testing/admin)
    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    // DELETE http://localhost:8080/api/cart/5  -> removes a cart
    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable Integer cartId) {
        cartService.deleteCart(cartId);
    }
}

package com.dfine.oms.module3_order.controller;

import com.dfine.oms.module3_order.entity.Cart;
import com.dfine.oms.module3_order.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{customerId}")
    public Cart getCart(@PathVariable Integer customerId) {
        return cartService.getOrCreateCart(customerId);
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    @DeleteMapping("/{cartId}")
    public void deleteCart(@PathVariable Integer cartId) {
        cartService.deleteCart(cartId);
    }
}

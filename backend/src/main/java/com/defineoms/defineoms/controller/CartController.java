package com.defineoms.defineoms.controller;

import com.defineoms.defineoms.entity.Cart;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    // temporary in-memory store for Postman testing before database setup
    private static final Map<Integer, Cart> mockCartDb = new HashMap<>();

    @GetMapping("/ping")
    public String ping() {
        return "Cart controller running";
    }

    @GetMapping("/{customerId}")
    public Cart getCart(@PathVariable Integer customerId) {
        if (!mockCartDb.containsKey(customerId)) {
            Cart c = new Cart();
            c.setCartId(100 + customerId);
            c.setCustomerId(customerId);
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            mockCartDb.put(customerId, c);
        }
        return mockCartDb.get(customerId);
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return new ArrayList<>(mockCartDb.values());
    }

    @DeleteMapping("/{cartId}")
    public String deleteCart(@PathVariable Integer cartId) {
        mockCartDb.remove(cartId);
        return "Deleted cart " + cartId;
    }
}

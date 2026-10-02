package com.defineoms.defineoms.controller;

import com.defineoms.defineoms.service.CartItemService;
import com.defineoms.defineoms.entity.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart-item")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;

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

    @GetMapping("/debug-count/{cartId}")
    public int getDebugCount(@PathVariable Integer cartId) {
        return cartItemService.getDebugItemCount(cartId);
    }
}

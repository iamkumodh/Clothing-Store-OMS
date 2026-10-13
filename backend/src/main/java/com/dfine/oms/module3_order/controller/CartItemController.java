package com.dfine.oms.module3_order.controller;

import com.dfine.oms.module3_order.entity.CartItem;
import com.dfine.oms.module3_order.service.CartItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-item")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

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

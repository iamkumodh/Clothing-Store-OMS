package com.defineoms.defineoms.service;

import com.defineoms.defineoms.entity.ProductVariant;
import com.defineoms.defineoms.repository.ProductVariantRepository;

import com.defineoms.defineoms.entity.CartItem;
import com.defineoms.defineoms.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    public CartItem addItemToCart(Integer cartId, Integer variantId, Integer quantity) {

        Optional<ProductVariant> variantBox = productVariantRepository.findById(variantId);

        if (!variantBox.isPresent()) {
            throw new RuntimeException("Product variant not found");
        }
        ProductVariant variant = variantBox.get();

        if (variant.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for this variant");
        }

        // naive implementation: directly creates new item
        CartItem newItem = new CartItem();
        newItem.setCartId(cartId);
        newItem.setVariantId(variantId);
        newItem.setQuantity(quantity);
        newItem.setAddedAt(LocalDateTime.now());
        return cartItemRepository.save(newItem);
    }

    public List<CartItem> getItemsForCart(Integer cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    // temporary debug method for checking item counts
    public int getDebugItemCount(Integer cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        return items != null ? items.size() : 0;
    }
}

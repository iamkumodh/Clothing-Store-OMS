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

// @Service Spring creates it once and
// hands it out wherever it's needed, so never needs to type "new CartItemService()").
@Service
public class CartItemService {

    // @Autowired means CartItemRepository is
    // just an interface (remember, it had no actual code inside it).
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

        Optional<CartItem> existingBox =
                cartItemRepository.findByCartIdAndVariantId(cartId, variantId);

        if (existingBox.isPresent()) {

            CartItem item = existingBox.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);

        } else {

            CartItem newItem = new CartItem();
            newItem.setCartId(cartId);
            newItem.setVariantId(variantId);
            newItem.setQuantity(quantity);
            newItem.setAddedAt(LocalDateTime.now());
            return cartItemRepository.save(newItem);
        }
    }

    public List<CartItem> getItemsForCart(Integer cartId) {

        return cartItemRepository.findByCartId(cartId);
    }

    public CartItem updateQuantity(Integer cartItemId, Integer newQuantity) {
        Optional<CartItem> itemBox = cartItemRepository.findById(cartItemId);

        if (!itemBox.isPresent()) {
            throw new RuntimeException("Cart item not found");
        }

        CartItem item = itemBox.get();
        item.setQuantity(newQuantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Integer cartItemId) {

        cartItemRepository.deleteById(cartItemId);
    }

    public double calculateCartSubtotal(Integer cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        double subtotal = 0.0;

        for (CartItem item : items) {
            Optional<ProductVariant> variantBox =
                    productVariantRepository.findById(item.getVariantId());

            if (!variantBox.isPresent()) {
                throw new RuntimeException("Variant not found");
            }

            ProductVariant variant = variantBox.get();
            subtotal += item.getQuantity() * variant.getBasePrice();
        }
        return subtotal;
    }
}


package com.dfine.oms.module3_order.service;

import com.dfine.oms.module3_order.entity.Cart;
import com.dfine.oms.module3_order.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart getOrCreateCart(Integer customerId) {
        Optional<Cart> existingCart = cartRepository.findByCustomerId(customerId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            Cart newCart = new Cart();
            newCart.setCustomerId(customerId);
            newCart.setCreatedAt(LocalDateTime.now());
            newCart.setUpdatedAt(LocalDateTime.now());
            return cartRepository.save(newCart);
        }
    }

    public Cart getOrCreateGuestCart(String guestToken) {
        Optional<Cart> existingCart = cartRepository.findByGuestToken(guestToken);
        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            Cart newCart = new Cart();
            newCart.setGuestToken(guestToken);
            newCart.setCreatedAt(LocalDateTime.now());
            newCart.setUpdatedAt(LocalDateTime.now());
            return cartRepository.save(newCart);
        }
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public void deleteCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }
}

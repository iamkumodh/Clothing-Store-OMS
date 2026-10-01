package com.defineoms.defineoms.service;

import com.defineoms.defineoms.entity.Cart;
import com.defineoms.defineoms.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Get an existing cart for a customer, or create a new one.
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

    // Get an existing cart for a GUEST (no account), or create one.
    public Cart getOrCreateGuestCart(String guestToken) {

        Optional<Cart> existingCart = cartRepository.findByGuestToken(guestToken);

        if (existingCart.isPresent()) {
            return existingCart.get();

        } else {
            Cart newCart = new Cart();
            newCart.setGuestToken(guestToken);   // customerId stays null

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

package com.defineoms.defineoms.repository;

import com.defineoms.defineoms.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByCustomerId(Integer customerId);

    Optional<Cart> findByGuestToken(String guestToken);
}


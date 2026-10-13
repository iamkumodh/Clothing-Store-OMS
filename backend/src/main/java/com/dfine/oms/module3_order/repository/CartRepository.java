package com.dfine.oms.module3_order.repository;

import com.dfine.oms.module3_order.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByCustomerId(Integer customerId);

    Optional<Cart> findByGuestToken(String guestToken);
}

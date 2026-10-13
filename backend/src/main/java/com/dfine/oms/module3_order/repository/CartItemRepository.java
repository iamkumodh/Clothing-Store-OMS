package com.dfine.oms.module3_order.repository;

import com.dfine.oms.module3_order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCartId(Integer cartId);

    Optional<CartItem> findByCartIdAndVariantId(Integer cartId, Integer variantId);
}

package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// repository interface for querying variant inventory
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    // find all variants belonging to a specific product
    List<ProductVariant> findByProduct_ProductId(Integer productId);
}

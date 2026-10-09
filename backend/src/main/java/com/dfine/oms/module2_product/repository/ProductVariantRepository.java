package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// repository interface for querying variant inventory
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    // find all variants belonging to a specific product
    List<ProductVariant> findByProduct_ProductId(Integer productId);

    // find variant by sku
    Optional<ProductVariant> findBySku(String sku);

    // check if sku exists
    boolean existsBySku(String sku);

    // check if another variant uses this sku
    boolean existsBySkuAndVariantIdNot(String sku, Integer variantId);

    // check if variant with same size and color exists for a product
    boolean existsByProduct_ProductIdAndSizeLabelAndColor(Integer productId, String sizeLabel, String color);

    // find low stock variants
    @Query("SELECT v FROM ProductVariant v WHERE v.stockQuantity <= v.lowStockThreshold")
    List<ProductVariant> findLowStockVariants();
}

package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// repository interface for querying and saving cloths in catalog
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // filter products by category id
    List<Product> findByCategory_CategoryId(Integer categoryId);

    // filter products by gender target
    List<Product> findByGenderTarget(String genderTarget);

    // filter products by category and gender target
    List<Product> findByCategory_CategoryIdAndGenderTarget(Integer categoryId, String genderTarget);

    // count how many products belong to a specific category (for safe delete
    // checks)
    long countByCategory_CategoryId(Integer categoryId);

    // search products by name and description by keyword (case-insensitive)
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);
}

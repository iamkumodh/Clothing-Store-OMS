package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

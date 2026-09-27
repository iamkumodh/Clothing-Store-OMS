package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// provides built-in CRUD operations for Category entity
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // check if category name is already taken
    boolean existsByCategoryName(String categoryName);
}

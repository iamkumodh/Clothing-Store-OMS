package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CategoryResponse;
import com.dfine.oms.module2_product.dto.CreateCategoryRequest;

import java.util.List;

// Service interface for category business operations
// service is the miffle man between controller and repo.
//controller knows about internet, repo only about sql.
public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(Integer categoryId);

    CategoryResponse createCategory(CreateCategoryRequest request);
}

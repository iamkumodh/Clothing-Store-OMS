package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CategoryResponse;
import com.dfine.oms.module2_product.dto.CreateCategoryRequest;
import com.dfine.oms.module2_product.entity.Category;
import com.dfine.oms.module2_product.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

// Implementation of CategoryService

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // fetch all categories and map to response DTOs
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponse> responseList = new ArrayList<>();

        for (Category cat : categories) {
            responseList.add(mapToResponse(cat));
        }

        return responseList;
    }

    // find category by id, returns null if not found
    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            return null;
        }
        return mapToResponse(category);
    }

    // create new category record
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (request.categoryName() == null || request.categoryName().isBlank()) {
            return null;
        }

        String trimmedName = request.categoryName().trim();
        // check duplicate category name to prevent MySQL constraint crash
        if (categoryRepository.existsByCategoryName(trimmedName)) {
            return null;
        }

        Category category = new Category();
        category.setCategoryName(trimmedName);
        category.setCategoryDescription(request.description());

        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    // helper method to convert entity to response record
    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription());
    }
}

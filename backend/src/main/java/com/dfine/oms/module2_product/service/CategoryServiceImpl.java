package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CategoryResponse;
import com.dfine.oms.module2_product.dto.CreateCategoryRequest;
import com.dfine.oms.module2_product.dto.UpdateCategoryRequest;
import com.dfine.oms.module2_product.entity.Category;
import com.dfine.oms.module2_product.repository.CategoryRepository;
import com.dfine.oms.module2_product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

// Implementation of CategoryService

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
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

    // update existing category details
    @Override
    @Transactional(rollbackFor = Exception.class)
    public CategoryResponse updateCategory(Integer categoryId, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + categoryId));

        if (request.categoryName() != null && !request.categoryName().isBlank()) {
            String trimmedName = request.categoryName().trim();
            if (categoryRepository.existsByCategoryNameAndCategoryIdNot(trimmedName, categoryId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is already taken: " + trimmedName);
            }
            category.setCategoryName(trimmedName);
        }

        if (request.description() != null) {
            category.setCategoryDescription(request.description());
        }

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    // delete category only if no garments are currently linked to it
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + categoryId));

        long linkedProductsCount = productRepository.countByCategory_CategoryId(categoryId);
        if (linkedProductsCount > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete category containing " + linkedProductsCount + " active products");
        }

        categoryRepository.delete(category);
    }

    // helper method to convert entity to response record
    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription());
    }
}

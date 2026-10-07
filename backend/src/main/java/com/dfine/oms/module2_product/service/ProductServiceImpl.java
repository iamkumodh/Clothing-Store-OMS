package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CreateProductRequest;
import com.dfine.oms.module2_product.dto.ProductResponse;
import com.dfine.oms.module2_product.dto.UpdateProductRequest;
import com.dfine.oms.module2_product.dto.VariantDto;
import com.dfine.oms.module2_product.entity.Category;
import com.dfine.oms.module2_product.entity.Product;
import com.dfine.oms.module2_product.entity.ProductVariant;
import com.dfine.oms.module2_product.repository.CategoryRepository;
import com.dfine.oms.module2_product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// implementation of ProductService for handling product queries and creation
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // get all products with optional category and gender filters
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(Integer categoryId, String gender) {
        return getAllProducts(categoryId, gender, null);
    }

    // search and filter products by category, gender, and keyword
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(Integer categoryId, String gender, String search) {
        List<Product> products;

        if (search != null && !search.trim().isEmpty()) {
            // sanitize search query using regex to strip special characters
            String cleanKeyword = search.trim().replaceAll("[^a-zA-Z0-9]", "");
            products = productRepository.searchProducts(cleanKeyword);
            if (categoryId != null) {
                products = products.stream()
                        .filter(p -> p.getCategory() != null && categoryId.equals(p.getCategory().getCategoryId()))
                        .toList();
            }
            if (gender != null) {
                products = products.stream()
                        .filter(p -> gender.equalsIgnoreCase(p.getGenderTarget()))
                        .toList();
            }
        } else if (categoryId != null && gender != null) {
            products = productRepository.findByCategory_CategoryIdAndGenderTarget(categoryId, gender);
        } else if (categoryId != null) {
            products = productRepository.findByCategory_CategoryId(categoryId);
        } else if (gender != null) {
            products = productRepository.findByGenderTarget(gender);
        } else {
            products = productRepository.findAll();
        }

        List<ProductResponse> responseList = new ArrayList<>();
        for (Product product : products) {
            if (!product.isActive()) {
                continue;
            }
            responseList.add(mapToResponse(product));
        }

        return responseList;
    }

    // fetch product by id, returns null if not found
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return null;
        }
        return mapToResponse(product);
    }

    // save new product item into db
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductResponse createProduct(CreateProductRequest request) {
        if (request.categoryId() == null || request.productName() == null || request.productName().isBlank()) {
            return null;
        }

        Category category = categoryRepository.findById(request.categoryId()).orElse(null);
        if (category == null) {
            return null;
        }

        Product product = new Product();
        product.setCategory(category);
        // trim name and safely handle null description
        String trimmedName = request.productName().trim();
        String sanitizedDesc = (request.description() != null) ? request.description().trim() : null;
        product.setProductName(trimmedName);
        product.setProductDescription(sanitizedDesc);
        product.setGenderTarget(request.genderTarget());
        product.setBasePrice(request.basePrice());
        product.setMainImageUrl(request.mainImageUrl());
        product.setActive(true);

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    // update an exidting product catalog item
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductResponse updateProduct(Integer productId, UpdateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Category not found with id: " + request.categoryId()));
            product.setCategory(category);
        }

        if (request.productName() != null && !request.productName().isBlank()) {
            product.setProductName(request.productName().trim());
        }

        if (request.description() != null) {
            product.setProductDescription(request.description());
        }

        if (request.genderTarget() != null) {
            product.setGenderTarget(request.genderTarget());
        }

        if (request.basePrice() != null) {
            if (request.basePrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Base price cannot be negative");
            }
            product.setBasePrice(request.basePrice());
        }

        if (request.mainImageUrl() != null) {
            product.setMainImageUrl(request.mainImageUrl());
        }

        if (request.isActive() != null) {
            product.setActive(request.isActive());
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    // soft delete a product (sets is_active to false to protect past orders)
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + productId));
        // soft delete: keep row in MySQL for past order history
        product.setActive(false);
        productRepository.save(product);
    }

    // helper method to convert entity to response DTO
    private ProductResponse mapToResponse(Product product) {
        Integer catId = null;
        String catName = null;
        if (product.getCategory() != null) {
            catId = product.getCategory().getCategoryId();
            catName = product.getCategory().getCategoryName();
        }

        // guard against null or empty variants list to prevent NPE
        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            return new ProductResponse(
                    product.getProductId(),
                    catId,
                    catName,
                    product.getProductName(),
                    product.getProductDescription(),
                    product.getGenderTarget(),
                    product.getBasePrice(),
                    product.getMainImageUrl(),
                    product.isActive(),
                    "OUT_OF_STOCK",
                    new ArrayList<>());
        }

        // calculate aggregate stock badge
        int totalStock = 0;
        boolean anyLowStock = false;
        List<VariantDto> variantDtos = new ArrayList<>();

        for (ProductVariant v : product.getVariants()) {
            totalStock += v.getStockQuantity();
            if (v.getStockQuantity() <= v.getLowStockThreshold() && v.getStockQuantity() > 0) {
                anyLowStock = true;
            }
            String itemStatus = (v.getStockQuantity() == 0) ? "OUT_OF_STOCK"
                    : (v.getStockQuantity() <= v.getLowStockThreshold()) ? "LOW_STOCK" : "IN_STOCK";
            variantDtos.add(new VariantDto(
                    v.getVariantId(), v.getSku(), v.getSize(), v.getColor(),
                    java.math.BigDecimal.ZERO, v.getStockQuantity(), v.getLowStockThreshold(), itemStatus));
        }

        String badge = "OUT_OF_STOCK";
        if (totalStock > 0) {
            badge = anyLowStock ? "LOW_STOCK" : "IN_STOCK";
        }

        return new ProductResponse(
                product.getProductId(),
                catId,
                catName,
                product.getProductName(),
                product.getProductDescription(),
                product.getGenderTarget(),
                product.getBasePrice(),
                product.getMainImageUrl(),
                product.isActive(),
                badge,
                variantDtos);
    }
}

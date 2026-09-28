package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CreateProductRequest;
import com.dfine.oms.module2_product.dto.ProductResponse;
import com.dfine.oms.module2_product.dto.VariantDto;
import com.dfine.oms.module2_product.entity.Category;
import com.dfine.oms.module2_product.entity.Product;
import com.dfine.oms.module2_product.entity.ProductVariant;
import com.dfine.oms.module2_product.repository.CategoryRepository;
import com.dfine.oms.module2_product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        List<Product> products;

        if (categoryId != null && gender != null) {
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

    // helper method to convert entity to response DTO
    private ProductResponse mapToResponse(Product product) {
        Integer catId = null;
        String catName = null;
        if (product.getCategory() != null) {
            catId = product.getCategory().getCategoryId();
            catName = product.getCategory().getCategoryName();
        }

        // calculate aggregate stock badge
        int totalStock = 0;
        boolean anyLowStock = false;
        List<VariantDto> variantDtos = new ArrayList<>();

        if (product.getVariants() != null) {
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

package com.dfine.oms.module2_product.controller;

import com.dfine.oms.module2_product.dto.ProductResponse;
import com.dfine.oms.module2_product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// REST controller managing garment variants and inventory stock
@RestController
@RequestMapping
public class InventoryController {

    private final ProductService productService;

    public InventoryController(ProductService productService) {
        this.productService = productService;
    }

    // get all variants belonging to a specific product
    @GetMapping({"/api/products/{productId}/variants", "/api/variants/product/{productId}"})
    public ResponseEntity<ProductResponse> getVariantsByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }
}

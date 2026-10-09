package com.dfine.oms.module2_product.controller;

import com.dfine.oms.module2_product.dto.CreateVariantRequest;
import com.dfine.oms.module2_product.dto.RestockLogDto;
import com.dfine.oms.module2_product.dto.RestockRequest;
import com.dfine.oms.module2_product.dto.UpdateVariantRequest;
import com.dfine.oms.module2_product.dto.VariantDto;
import com.dfine.oms.module2_product.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// REST Controller managing inventory variants, stock checks, and restock logs
@RestController
@RequestMapping
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Get all variants across the catalog
    @GetMapping("/api/variants")
    public ResponseEntity<List<VariantDto>> getAllVariants() {
        List<VariantDto> variants = inventoryService.getAllVariants();
        return ResponseEntity.ok(variants);
    }

    // Get single variant by ID
    @GetMapping("/api/variants/{id}")
    public ResponseEntity<VariantDto> getVariantById(@PathVariable Integer id) {
        VariantDto variant = inventoryService.getVariantById(id);
        return ResponseEntity.ok(variant);
    }

    // Get all variants belonging to a specific product
    @GetMapping({"/api/products/{productId}/variants", "/api/variants/product/{productId}"})
    public ResponseEntity<List<VariantDto>> getVariantsByProduct(@PathVariable Integer productId) {
        List<VariantDto> variants = inventoryService.getVariantsByProduct(productId);
        return ResponseEntity.ok(variants);
    }

    // Add a new variant to a product
    @PostMapping({"/api/products/{productId}/variants", "/api/variants/product/{productId}"})
    public ResponseEntity<VariantDto> createVariant(
            @PathVariable Integer productId,
            @RequestBody CreateVariantRequest request) {
        VariantDto created = inventoryService.createVariant(productId, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Update variant details or stock
    @PutMapping("/api/variants/{id}")
    public ResponseEntity<VariantDto> updateVariant(
            @PathVariable Integer id,
            @RequestBody UpdateVariantRequest request) {
        VariantDto updated = inventoryService.updateVariant(id, request);
        return ResponseEntity.ok(updated);
    }

    // Delete a variant
    @DeleteMapping("/api/variants/{id}")
    public ResponseEntity<Map<String, String>> deleteVariant(@PathVariable Integer id) {
        inventoryService.deleteVariant(id);
        return ResponseEntity.ok(Map.of("message", "Variant deleted successfully"));
    }

    // Restock variant by adding inventory units and logging transaction
    @PostMapping("/api/variants/{id}/restock")
    public ResponseEntity<Map<String, String>> restockVariant(
            @PathVariable Integer id,
            @RequestBody RestockRequest request) {
        inventoryService.restockVariant(id, request);
        return ResponseEntity.ok(Map.of("message", "Variant restocked successfully"));
    }

    // List all variants where stock is at or below threshold
    @GetMapping("/api/variants/low-stock")
    public ResponseEntity<List<VariantDto>> getLowStockVariants() {
        List<VariantDto> lowStock = inventoryService.getLowStockVariants();
        return ResponseEntity.ok(lowStock);
    }

    // Retrieve restock audit history for a specific variant
    @GetMapping("/api/variants/{id}/restock-logs")
    public ResponseEntity<List<RestockLogDto>> getRestockLogs(@PathVariable Integer id) {
        List<RestockLogDto> logs = inventoryService.getRestockLogsByVariant(id);
        return ResponseEntity.ok(logs);
    }
}

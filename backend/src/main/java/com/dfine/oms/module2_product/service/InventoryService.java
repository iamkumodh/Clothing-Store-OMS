package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CreateVariantRequest;
import com.dfine.oms.module2_product.dto.GeneralRestockRequest;
import com.dfine.oms.module2_product.dto.RestockLogDto;
import com.dfine.oms.module2_product.dto.RestockRequest;
import com.dfine.oms.module2_product.dto.UpdateVariantRequest;
import com.dfine.oms.module2_product.dto.VariantDto;

import java.util.List;

// Service interface managing inventory, stock levels, variants, and restock logs
public interface InventoryService {

    // Retrieve all active variants in the store
    List<VariantDto> getAllVariants();

    // Retrieve single variant by ID
    VariantDto getVariantById(Integer variantId);

    // Retrieve all variants for a specific product
    List<VariantDto> getVariantsByProduct(Integer productId);

    // Create a new variant for a product
    VariantDto createVariant(Integer productId, CreateVariantRequest request);

    // Update an existing variant's details or stock
    VariantDto updateVariant(Integer variantId, UpdateVariantRequest request);

    // Delete a variant
    void deleteVariant(Integer variantId);

    // Restock a specific variant (by URL path variantId)
    void restockVariant(Integer variantId, RestockRequest request);

    // Restock variant using general request payload containing variantId
    void restock(GeneralRestockRequest request);

    // Retrieve all variants with low stock alerts (stock <= threshold)
    List<VariantDto> getLowStockVariants();

    // Retrieve restock audit history for a specific variant
    List<RestockLogDto> getRestockLogsByVariant(Integer variantId);

    // Retrieve all restock logs across the entire store
    List<RestockLogDto> getAllRestockLogs();
}

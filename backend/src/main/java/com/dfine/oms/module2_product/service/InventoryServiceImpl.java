package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CreateVariantRequest;
import com.dfine.oms.module2_product.dto.GeneralRestockRequest;
import com.dfine.oms.module2_product.dto.RestockLogDto;
import com.dfine.oms.module2_product.dto.RestockRequest;
import com.dfine.oms.module2_product.dto.UpdateVariantRequest;
import com.dfine.oms.module2_product.dto.VariantDto;
import com.dfine.oms.module2_product.entity.Product;
import com.dfine.oms.module2_product.entity.ProductVariant;
import com.dfine.oms.module2_product.entity.RestockLog;
import com.dfine.oms.module2_product.repository.ProductRepository;
import com.dfine.oms.module2_product.repository.ProductVariantRepository;
import com.dfine.oms.module2_product.repository.RestockLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

// Service implementation managing garment variants and inventory restock operations
@Service
public class InventoryServiceImpl implements InventoryService {

    private final ProductVariantRepository variantRepository;
    private final RestockLogRepository restockLogRepository;
    private final ProductRepository productRepository;

    public InventoryServiceImpl(ProductVariantRepository variantRepository,
                                RestockLogRepository restockLogRepository,
                                ProductRepository productRepository) {
        this.variantRepository = variantRepository;
        this.restockLogRepository = restockLogRepository;
        this.productRepository = productRepository;
    }

    // Retrieve all active variants in the catalog
    @Override
    @Transactional(readOnly = true)
    public List<VariantDto> getAllVariants() {
        return variantRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Retrieve single variant by primary key
    @Override
    @Transactional(readOnly = true)
    public VariantDto getVariantById(Integer variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found with id: " + variantId));
        return mapToDto(variant);
    }

    // Retrieve all size/color variants for a specific product
    @Override
    @Transactional(readOnly = true)
    public List<VariantDto> getVariantsByProduct(Integer productId) {
        return variantRepository.findByProduct_ProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Create a new variant for a product
    @Override
    @Transactional(rollbackFor = Exception.class)
    public VariantDto createVariant(Integer productId, CreateVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + productId));

        if (request.sku() == null || request.sku().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Variant SKU is required");
        }

        String trimmedSku = request.sku().trim();
        if (variantRepository.existsBySku(trimmedSku)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU already exists: " + trimmedSku);
        }

        if (request.size() == null || request.size().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Size label is required");
        }

        if (request.color() == null || request.color().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Color is required");
        }

        String size = request.size().trim();
        String color = request.color().trim();
        if (variantRepository.existsByProduct_ProductIdAndSizeLabelAndColor(productId, size, color)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Variant with size '" + size + "' and color '" + color + "' already exists for this product");
        }

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSku(trimmedSku);
        variant.setSize(size);
        variant.setColor(color);
        variant.setStockQuantity(Math.max(0, request.initialStock()));
        variant.setLowStockThreshold(request.lowStockThreshold() > 0 ? request.lowStockThreshold() : 5);

        ProductVariant saved = variantRepository.save(variant);
        return mapToDto(saved);
    }

    // Update existing variant attributes
    @Override
    @Transactional(rollbackFor = Exception.class)
    public VariantDto updateVariant(Integer variantId, UpdateVariantRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found with id: " + variantId));

        if (request.sku() != null && !request.sku().isBlank()) {
            String trimmedSku = request.sku().trim();
            if (variantRepository.existsBySkuAndVariantIdNot(trimmedSku, variantId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU already taken: " + trimmedSku);
            }
            variant.setSku(trimmedSku);
        }

        if (request.size() != null && !request.size().isBlank()) {
            variant.setSize(request.size().trim());
        }

        if (request.color() != null && !request.color().isBlank()) {
            variant.setColor(request.color().trim());
        }

        if (request.stockQuantity() != null) {
            if (request.stockQuantity() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock quantity cannot be negative");
            }
            variant.setStockQuantity(request.stockQuantity());
        }

        if (request.lowStockThreshold() != null) {
            if (request.lowStockThreshold() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Threshold cannot be negative");
            }
            variant.setLowStockThreshold(request.lowStockThreshold());
        }

        if (request.variantImageUrl() != null) {
            variant.setVariantImageUrl(request.variantImageUrl());
        }

        ProductVariant updated = variantRepository.save(variant);
        return mapToDto(updated);
    }

    // Delete a variant
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteVariant(Integer variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found with id: " + variantId));
        variantRepository.delete(variant);
    }

    // Atomically increments variant stock and writes an audit entry in restock_log
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void restockVariant(Integer variantId, RestockRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found with id: " + variantId));

        if (request.quantityAdded() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity added must be greater than zero");
        }

        // Increment current variant stock
        variant.setStockQuantity(variant.getStockQuantity() + request.quantityAdded());
        variantRepository.save(variant);

        // Record the transaction in restock audit log
        RestockLog log = new RestockLog();
        log.setVariant(variant);
        log.setReceivedByStaffId(request.staffId());
        log.setQuantityAdded(request.quantityAdded());
        log.setNotes(request.notes());
        restockLogRepository.save(log);
    }

    // General restock using request body with variantId
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void restock(GeneralRestockRequest request) {
        if (request.variantId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Variant ID is required for restock");
        }
        restockVariant(request.variantId(), new RestockRequest(request.staffId(), request.quantityAdded(), request.notes()));
    }

    // Query variants where available stock is below or equal to the threshold
    @Override
    @Transactional(readOnly = true)
    public List<VariantDto> getLowStockVariants() {
        return variantRepository.findLowStockVariants().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Query restock transaction history for a specific variant
    @Override
    @Transactional(readOnly = true)
    public List<RestockLogDto> getRestockLogsByVariant(Integer variantId) {
        return restockLogRepository.findByVariant_VariantIdOrderByRestockedAtDesc(variantId).stream()
                .map(this::mapToRestockLogDto)
                .collect(Collectors.toList());
    }

    // Query restock transaction history for all variants across the whole store
    @Override
    @Transactional(readOnly = true)
    public List<RestockLogDto> getAllRestockLogs() {
        return restockLogRepository.findAllByOrderByRestockedAtDesc().stream()
                .map(this::mapToRestockLogDto)
                .collect(Collectors.toList());
    }

    // Helper method to convert ProductVariant entity into VariantDto
    private VariantDto mapToDto(ProductVariant variant) {
        String badge = calculateStockBadge(variant.getStockQuantity(), variant.getLowStockThreshold());
        return new VariantDto(
                variant.getVariantId(),
                variant.getSku(),
                variant.getSize(),
                variant.getColor(),
                BigDecimal.ZERO,
                variant.getStockQuantity(),
                variant.getLowStockThreshold(),
                badge
        );
    }

    // Helper method to convert RestockLog entity into RestockLogDto
    private RestockLogDto mapToRestockLogDto(RestockLog log) {
        return new RestockLogDto(
                log.getRestockId(),
                log.getVariant().getVariantId(),
                log.getVariant().getSku(),
                log.getReceivedByStaffId(),
                log.getQuantityAdded(),
                log.getRestockedAt(),
                log.getNotes()
        );
    }

    // Helper method to calculate inventory status badge for a single variant
    private String calculateStockBadge(int stock, int threshold) {
        if (stock == 0) {
            return "OUT_OF_STOCK";
        } else if (stock <= threshold) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}

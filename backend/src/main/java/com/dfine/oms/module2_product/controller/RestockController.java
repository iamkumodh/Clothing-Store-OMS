package com.dfine.oms.module2_product.controller;

import com.dfine.oms.module2_product.dto.GeneralRestockRequest;
import com.dfine.oms.module2_product.dto.RestockLogDto;
import com.dfine.oms.module2_product.dto.RestockRequest;
import com.dfine.oms.module2_product.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

// REST Controller for general restock operations and audit logs
@RestController
public class RestockController {

    private final InventoryService inventoryService;

    public RestockController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // General restock endpoint accepting variantId in the request body
    @PostMapping({"/api/restock", "/api/inventory/restock"})
    public ResponseEntity<Map<String, String>> generalRestock(@RequestBody GeneralRestockRequest request) {
        inventoryService.restock(request);
        return ResponseEntity.ok(Map.of("message", "Inventory restocked successfully"));
    }

    // Restock variant by path parameter
    @PostMapping({"/api/restock/{variantId}", "/api/inventory/{variantId}/restock"})
    public ResponseEntity<Map<String, String>> restockByPath(
            @PathVariable Integer variantId,
            @RequestBody RestockRequest request) {
        inventoryService.restockVariant(variantId, request);
        return ResponseEntity.ok(Map.of("message", "Inventory restocked successfully"));
    }

    // Retrieve full restock audit history
    @GetMapping({"/api/restock/logs", "/api/inventory/restock-logs"})
    public ResponseEntity<List<RestockLogDto>> getAllRestockLogs() {
        List<RestockLogDto> logs = inventoryService.getAllRestockLogs();
        return ResponseEntity.ok(logs);
    }
}

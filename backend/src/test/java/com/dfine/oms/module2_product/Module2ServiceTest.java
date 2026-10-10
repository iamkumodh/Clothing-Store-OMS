package com.dfine.oms.module2_product;

import com.dfine.oms.module2_product.dto.CategoryResponse;
import com.dfine.oms.module2_product.dto.CreateProductRequest;
import com.dfine.oms.module2_product.dto.CreateVariantRequest;
import com.dfine.oms.module2_product.dto.GeneralRestockRequest;
import com.dfine.oms.module2_product.dto.ProductResponse;
import com.dfine.oms.module2_product.dto.RestockLogDto;
import com.dfine.oms.module2_product.dto.RestockRequest;
import com.dfine.oms.module2_product.dto.ReviewDto;
import com.dfine.oms.module2_product.dto.SubmitReviewRequest;
import com.dfine.oms.module2_product.dto.UpdateCategoryRequest;
import com.dfine.oms.module2_product.dto.UpdateProductRequest;
import com.dfine.oms.module2_product.dto.UpdateVariantRequest;
import com.dfine.oms.module2_product.dto.VariantDto;
import com.dfine.oms.module2_product.entity.Category;
import com.dfine.oms.module2_product.entity.Product;
import com.dfine.oms.module2_product.entity.ProductReview;
import com.dfine.oms.module2_product.entity.ProductVariant;
import com.dfine.oms.module2_product.entity.RestockLog;
import com.dfine.oms.module2_product.repository.CategoryRepository;
import com.dfine.oms.module2_product.repository.ProductRepository;
import com.dfine.oms.module2_product.repository.ProductReviewRepository;
import com.dfine.oms.module2_product.repository.ProductVariantRepository;
import com.dfine.oms.module2_product.repository.RestockLogRepository;
import com.dfine.oms.module2_product.service.CategoryServiceImpl;
import com.dfine.oms.module2_product.service.InventoryServiceImpl;
import com.dfine.oms.module2_product.service.ProductServiceImpl;
import com.dfine.oms.module2_product.service.ReviewService;
import com.dfine.oms.module2_product.service.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// unit tests for module 2 services
@ExtendWith(MockitoExtension.class)
class Module2ServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ReviewService reviewService;

    @Mock
    private ProductVariantRepository variantRepository;

    @Mock
    private RestockLogRepository restockLogRepository;

    @Mock
    private ProductReviewRepository reviewRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    @InjectMocks
    private ReviewServiceImpl reviewServiceImpl;

    private Category testCategory;
    private Product testProduct;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setCategoryId(1);
        testCategory.setCategoryName("Casual Tops");

        testProduct = new Product();
        testProduct.setProductId(101);
        testProduct.setProductName("Oxford Shirt");
        testProduct.setCategory(testCategory);
        testProduct.setBasePrice(new BigDecimal("3500.00"));
        testProduct.setActive(true);

        testVariant = new ProductVariant();
        testVariant.setVariantId(201);
        testVariant.setProduct(testProduct);
        testVariant.setSku("OXF-M-BLU");
        testVariant.setSize("M");
        testVariant.setColor("Blue");
        testVariant.setStockQuantity(10);
        testVariant.setLowStockThreshold(5);

        testProduct.setVariants(List.of(testVariant));
    }

    // check stock badge shows IN_STOCK when quantity is above 5
    @Test
    @DisplayName("Stock badge IN_STOCK when stock > 5")
    void testStockBadgeInStock() {
        when(productRepository.findAll()).thenReturn(List.of(testProduct));

        List<ProductResponse> responses = productService.getAllProducts(null, null);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("IN_STOCK", responses.get(0).stockStatus());
    }

    // check stock badge shows LOW_STOCK when quantity is 5 or below
    @Test
    @DisplayName("Stock badge LOW_STOCK when stock <= 5")
    void testStockBadgeLowStock() {
        testVariant.setStockQuantity(3);
        when(productRepository.findAll()).thenReturn(List.of(testProduct));

        List<ProductResponse> responses = productService.getAllProducts(null, null);

        assertEquals("LOW_STOCK", responses.get(0).stockStatus());
    }

    // check stock badge shows OUT_OF_STOCK when quantity is zero
    @Test
    @DisplayName("Stock badge OUT_OF_STOCK when stock is 0")
    void testStockBadgeOutOfStock() {
        testVariant.setStockQuantity(0);
        when(productRepository.findAll()).thenReturn(List.of(testProduct));

        List<ProductResponse> responses = productService.getAllProducts(null, null);

        assertEquals("OUT_OF_STOCK", responses.get(0).stockStatus());
    }

    // verify search query calls repository search
    @Test
    @DisplayName("Search products by keyword")
    void testGetAllProductsWithSearchKeyword() {
        when(productRepository.searchProducts("Oxford")).thenReturn(List.of(testProduct));

        List<ProductResponse> responses = productService.getAllProducts(null, null, "Oxford");

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Oxford Shirt", responses.get(0).productName());
        verify(productRepository).searchProducts("Oxford");
    }

    // throw 404 if category does not exist when creating product
    @Test
    @DisplayName("Create product with invalid category throws 404")
    void testCreateProductInvalidCategory() {
        CreateProductRequest request = new CreateProductRequest(
                999, "New Shirt", "Desc", "MEN", new BigDecimal("2500"), "img.jpg"
        );

        when(categoryRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> productService.createProduct(request));
    }

    // update product attributes and save
    @Test
    @DisplayName("Update product details")
    void testUpdateProductSuccess() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        UpdateProductRequest updateReq = new UpdateProductRequest(
                "Oxford Relaxed Shirt", "Updated description", "UNISEX",
                new BigDecimal("3900.00"), "new-image.jpg", null, true
        );

        ProductResponse updated = productService.updateProduct(101, updateReq);

        assertNotNull(updated);
        assertEquals("Oxford Relaxed Shirt", testProduct.getProductName());
        assertEquals(new BigDecimal("3900.00"), testProduct.getBasePrice());
        verify(productRepository).save(testProduct);
    }

    // reject negative base price with bad request
    @Test
    @DisplayName("Update product with negative price throws error")
    void testUpdateProductNegativePrice() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));

        UpdateProductRequest updateReq = new UpdateProductRequest(
                null, null, null, new BigDecimal("-100.00"), null, null, null
        );

        assertThrows(ResponseStatusException.class, () -> productService.updateProduct(101, updateReq));
    }

    // soft delete product by setting isActive to false
    @Test
    @DisplayName("Soft delete product")
    void testDeleteProductSoftDelete() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));

        productService.deleteProduct(101);

        assertFalse(testProduct.isActive());
        verify(productRepository).save(testProduct);
    }

    // update category name and save
    @Test
    @DisplayName("Update category name")
    void testUpdateCategorySuccess() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        UpdateCategoryRequest req = new UpdateCategoryRequest("Casual Shirts & Tops", "New description");
        CategoryResponse response = categoryService.updateCategory(1, req);

        assertNotNull(response);
        assertEquals("Casual Shirts & Tops", testCategory.getCategoryName());
        verify(categoryRepository).save(testCategory);
    }

    // block category deletion if products are linked
    @Test
    @DisplayName("Delete category with linked products throws error")
    void testDeleteCategoryWithProductsBlocked() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(productRepository.countByCategory_CategoryId(1)).thenReturn(5L);

        assertThrows(ResponseStatusException.class, () -> categoryService.deleteCategory(1));
        verify(categoryRepository, never()).delete(any());
    }

    // delete category when no products are linked
    @Test
    @DisplayName("Delete category with no products")
    void testDeleteCategorySuccess() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(productRepository.countByCategory_CategoryId(1)).thenReturn(0L);

        categoryService.deleteCategory(1);

        verify(categoryRepository).delete(testCategory);
    }

    // create new variant with valid sku
    @Test
    @DisplayName("Create new product variant")
    void testCreateVariantSuccess() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));
        when(variantRepository.existsBySku("OXF-L-BLU")).thenReturn(false);
        when(variantRepository.existsByProduct_ProductIdAndSizeLabelAndColor(101, "L", "Blue")).thenReturn(false);
        when(variantRepository.save(any(ProductVariant.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateVariantRequest req = new CreateVariantRequest("OXF-L-BLU", "L", "Blue", BigDecimal.ZERO, 15, 5);
        VariantDto created = inventoryService.createVariant(101, req);

        assertNotNull(created);
        assertEquals("OXF-L-BLU", created.sku());
        assertEquals("L", created.size());
        assertEquals(15, created.stockQuantity());
        verify(variantRepository).save(any(ProductVariant.class));
    }

    // reject variant creation if sku already exists
    @Test
    @DisplayName("Create variant with duplicate SKU throws error")
    void testCreateVariantDuplicateSku() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));
        when(variantRepository.existsBySku("OXF-M-BLU")).thenReturn(true);

        CreateVariantRequest req = new CreateVariantRequest("OXF-M-BLU", "M", "Blue", BigDecimal.ZERO, 10, 5);

        assertThrows(ResponseStatusException.class, () -> inventoryService.createVariant(101, req));
    }

    // update variant fields and save
    @Test
    @DisplayName("Update variant details")
    void testUpdateVariantSuccess() {
        when(variantRepository.findById(201)).thenReturn(Optional.of(testVariant));
        when(variantRepository.save(any(ProductVariant.class))).thenReturn(testVariant);

        UpdateVariantRequest req = new UpdateVariantRequest(
                "OXF-M-BLU-V2", "M", "Navy Blue", null, 20, 8, null
        );

        VariantDto updated = inventoryService.updateVariant(201, req);

        assertNotNull(updated);
        assertEquals("OXF-M-BLU-V2", testVariant.getSku());
        assertEquals("Navy Blue", testVariant.getColor());
        assertEquals(20, testVariant.getStockQuantity());
        verify(variantRepository).save(testVariant);
    }

    // delete variant by id
    @Test
    @DisplayName("Delete variant by id")
    void testDeleteVariantSuccess() {
        when(variantRepository.findById(201)).thenReturn(Optional.of(testVariant));

        inventoryService.deleteVariant(201);

        verify(variantRepository).delete(testVariant);
    }

    // increment variant stock and save restock log
    @Test
    @DisplayName("Restock variant increments stock and saves log")
    void testRestockVariantSuccess() {
        when(variantRepository.findById(201)).thenReturn(Optional.of(testVariant));

        RestockRequest request = new RestockRequest(1, 15, "Supplier arrival");
        inventoryService.restockVariant(201, request);

        assertEquals(25, testVariant.getStockQuantity());
        verify(variantRepository).save(testVariant);
        verify(restockLogRepository).save(any());
    }

    // test general restock endpoint increments stock
    @Test
    @DisplayName("General restock request increments stock")
    void testGeneralRestockSuccess() {
        when(variantRepository.findById(201)).thenReturn(Optional.of(testVariant));

        GeneralRestockRequest req = new GeneralRestockRequest(201, 2, 20, "Batch 402");
        inventoryService.restock(req);

        assertEquals(30, testVariant.getStockQuantity());
        verify(variantRepository).save(testVariant);
        verify(restockLogRepository).save(any());
    }

    // reject restock with zero or negative quantity
    @Test
    @DisplayName("Restock with zero quantity throws error")
    void testRestockVariantZeroQuantity() {
        when(variantRepository.findById(201)).thenReturn(Optional.of(testVariant));

        RestockRequest request = new RestockRequest(1, 0, "Invalid batch");

        assertThrows(ResponseStatusException.class, () -> inventoryService.restockVariant(201, request));
    }

    // fetch all restock logs ordered by date
    @Test
    @DisplayName("Get all restock logs ordered by date")
    void testGetAllRestockLogs() {
        RestockLog log = new RestockLog();
        log.setRestockId(1);
        log.setVariant(testVariant);
        log.setQuantityAdded(10);
        log.setReceivedByStaffId(1);
        log.setRestockedAt(LocalDateTime.now());

        when(restockLogRepository.findAllByOrderByRestockedAtDesc()).thenReturn(List.of(log));

        List<RestockLogDto> logs = inventoryService.getAllRestockLogs();

        assertNotNull(logs);
        assertEquals(1, logs.size());
        assertEquals("OXF-M-BLU", logs.get(0).sku());
    }

    // reject review if star rating is outside 1-5 range
    @Test
    @DisplayName("Submit review with invalid rating throws error")
    void testSubmitReviewInvalidRating() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));

        SubmitReviewRequest request = new SubmitReviewRequest(5, 6, "Exceeded star limit");

        assertThrows(ResponseStatusException.class, () -> reviewServiceImpl.submitReview(101, request));
    }

    // block duplicate review from the same customer
    @Test
    @DisplayName("Prevent duplicate review from same customer")
    void testSubmitReviewDuplicateBlocked() {
        when(productRepository.findById(101)).thenReturn(Optional.of(testProduct));
        when(reviewRepository.existsByProduct_ProductIdAndCustomerId(101, 5)).thenReturn(true);

        SubmitReviewRequest request = new SubmitReviewRequest(5, 5, "Second review attempt");

        assertThrows(ResponseStatusException.class, () -> reviewServiceImpl.submitReview(101, request));
    }
}

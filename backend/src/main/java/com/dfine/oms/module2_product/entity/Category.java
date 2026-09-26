package com.dfine.oms.module2_product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// maps to 'category' table in MySQL schema
@Entity
@Table(name = "category")
public class Category {

    @Id // makes the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    @Column(name = "category_id") // maps java variable to mysql column name (case sensitive)
    private Integer categoryId; // hold mysql genarated ID in the variable

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "category_description", columnDefinition = "TEXT")
    private String categoryDescription;

    public Category() {
    }

    // constructor for creating new categories
    public Category(String initialCategoryName, String initialDescription) {
        this.categoryName = initialCategoryName;
        this.categoryDescription = initialDescription;
    }

    // getter
    public Integer getCategoryId() {
        return this.categoryId;
    }

    // setter
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDescription() {
        return this.categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public String getDescription() {
        return this.categoryDescription;
    }

    public void setDescription(String description) {
        this.categoryDescription = description;
    }
}

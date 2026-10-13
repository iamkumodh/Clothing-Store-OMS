package com.dfine.dfineoms.entity;
import jakarta.persistence.*;

@Entity // maps the class to a database table
@Table(name = "app_user") // specifying the exact name of the table
public class AppUser {

    @Id // makes this field as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // generates a unique primary key for a new entity
    @Column(name = "user_id") // maps the Java variable to the exact SQL column name

    private Long userId;

    @Column(nullable = false, unique = true) // maps to a database column that cannot be empty and must contain unique values
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "user_role", nullable = false) // defaults to "CUSTOMER" if no other role is provided
    private String userRole = "CUSTOMER";

    @Column(name = "account_status", nullable = false) // defaults to "ACTIVE" if no other status is provided
    private String accountStatus = "ACTIVE";

    public AppUser() {
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRole() {
        return userRole;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }
}
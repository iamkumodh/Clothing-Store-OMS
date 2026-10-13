package com.dfine.dfineoms.repository;
import com.dfine.dfineoms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // allows the controller to search the database by the token's email
    Optional<Customer> findByEmail(String email);
}
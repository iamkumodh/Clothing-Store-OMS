package com.defineoms.defineoms.repository;

import com.defineoms.defineoms.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    List<CustomerOrder> findByCustomerIdOrderByOrderDateDesc(Integer customerId);
}

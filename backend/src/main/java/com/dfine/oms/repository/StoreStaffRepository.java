package com.dfine.dfineoms.repository;

import com.dfine.dfineoms.entity.StoreStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreStaffRepository extends JpaRepository<StoreStaff, Long> {

    // Matches the exact "appUser" variable name defined in your StoreStaff.java entity
    @Query("SELECT s FROM StoreStaff s WHERE s.appUser.email = :email")
    Optional<StoreStaff> findByUserEmail(@Param("email") String email);
}
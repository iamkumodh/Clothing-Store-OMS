package com.dfine.dfineoms.repository;
import com.dfine.dfineoms.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    // allows the controller to search the database by email
    Optional<AppUser> findByEmail(String email);
}








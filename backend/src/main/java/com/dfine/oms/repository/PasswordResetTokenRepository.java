package com.dfine.dfineoms.repository;

import com.dfine.dfineoms.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    void deleteByUser_UserId(Integer userId);
    int countByUser_UserIdAndCreatedAtAfter(Integer userId, LocalDateTime timestamp);
}

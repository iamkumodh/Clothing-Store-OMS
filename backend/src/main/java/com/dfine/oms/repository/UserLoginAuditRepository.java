package com.dfine.dfineoms.repository;

import com.dfine.dfineoms.entity.UserLoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLoginAuditRepository extends JpaRepository<UserLoginAudit, Long> {
}
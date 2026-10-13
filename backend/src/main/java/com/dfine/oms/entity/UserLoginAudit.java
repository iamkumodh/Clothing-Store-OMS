package com.dfine.dfineoms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_audit")
public class UserLoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;

    // links to AppUser, but can be null if an unknown email tries to log in
    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser appUser;

    private String attemptedEmail;

    @Column(nullable = false, length = 50)
    private String ipAddress;

    @Column(nullable = false, updatable = false)
    private LocalDateTime loginTime = LocalDateTime.now();

    @Column(nullable = false, length = 50)
    private String loginStatus;

    public Long getAuditId() { return auditId; }
    public void setAuditId(Long auditId) { this.auditId = auditId; }
    public AppUser getAppUser() { return appUser; }
    public void setAppUser(AppUser appUser) { this.appUser = appUser; }
    public String getAttemptedEmail() { return attemptedEmail; }
    public void setAttemptedEmail(String attemptedEmail) { this.attemptedEmail = attemptedEmail; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getLoginTime() { return loginTime; }
    public void setLoginTime(LocalDateTime loginTime) { this.loginTime = loginTime; }
    public String getLoginStatus() { return loginStatus; }
    public void setLoginStatus(String loginStatus) { this.loginStatus = loginStatus; }
}
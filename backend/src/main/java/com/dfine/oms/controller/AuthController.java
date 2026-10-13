package com.dfine.dfineoms.controller;

import com.dfine.dfineoms.entity.AppUser;
import com.dfine.dfineoms.entity.PasswordResetToken;
import com.dfine.dfineoms.repository.PasswordResetTokenRepository;
import com.dfine.dfineoms.entity.Customer;
import com.dfine.dfineoms.entity.UserLoginAudit;
import com.dfine.dfineoms.repository.UserRepository;
import com.dfine.dfineoms.repository.CustomerRepository;
import com.dfine.dfineoms.repository.UserLoginAuditRepository;
import com.dfine.dfineoms.dto.CustomerRegistrationRequest;
import com.dfine.dfineoms.dto.LoginRequest;
import com.dfine.dfineoms.repository.StoreStaffRepository;
import com.dfine.dfineoms.entity.StoreStaff;
import com.dfine.dfineoms.dto.StaffRegistrationRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.UUID;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserLoginAuditRepository auditRepository;

    @Autowired
    private com.dfine.dfineoms.util.JwtUtil jwtUtil;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private StoreStaffRepository storeStaffRepository;

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping("/register/customer")
    public Customer registerCustomer(@RequestBody CustomerRegistrationRequest request) {

        AppUser newUser = new AppUser();
        newUser.setEmail(request.email);
        newUser.setPasswordHash(passwordEncoder.encode(request.password)); // passwords are securely hashed
        newUser.setUserRole("CUSTOMER");
        newUser.setAccountStatus("ACTIVE");
        AppUser savedUser = userRepository.save(newUser);

        Customer customer = new Customer();
        customer.setEmail(request.email);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setContactNumber(request.contactNumber);
        customer.setShippingAddress(request.shippingAddress);
        customer.setCity(request.city);
        customer.setDistrict(request.district);
        customer.setProvince(request.province);
        customer.setPostalCode(request.postalCode);
        customer.setAppUser(savedUser);

        return customerRepository.save(customer);
    }

    @PostMapping("/register/staff")
    public ResponseEntity<?> registerStaff(@RequestBody StaffRegistrationRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use.");
        }

        AppUser newUser = new AppUser();
        newUser.setEmail(request.email);
        newUser.setPasswordHash(passwordEncoder.encode(request.password));
        newUser.setUserRole("STORE_STAFF");
        newUser.setAccountStatus("ACTIVE");
        AppUser savedUser = userRepository.save(newUser);

        StoreStaff staff = new StoreStaff();
        staff.setFirstName(request.firstName);
        staff.setLastName(request.lastName);
        staff.setDesignation(request.designation);
        staff.setClearanceLevel(request.clearanceLevel);
        staff.setAppUser(savedUser);

        storeStaffRepository.save(staff);

        return ResponseEntity.ok("Staff account provisioned successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();

        Optional<AppUser> userOptional = userRepository.findByEmail(request.email);

        if (userOptional.isEmpty()) {
            logAudit(null, request.email, ipAddress, "FAILED_BAD_CREDENTIALS");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        AppUser user = userOptional.get();

        // secure BCrypt comparison instead of plain text
        if (!passwordEncoder.matches(request.password, user.getPasswordHash())) {
            logAudit(user, request.email, ipAddress, "FAILED_BAD_CREDENTIALS");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        if (!"ACTIVE".equals(user.getAccountStatus())) {
            logAudit(user, request.email, ipAddress, "FAILED_LOCKED");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is locked or suspended");
        }

        // generates the session token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        logAudit(user, request.email, ipAddress, "SUCCESS");
        return ResponseEntity.ok(token);
    }

    private void logAudit(AppUser user, String email, String ip, String status) {
        UserLoginAudit audit = new UserLoginAudit();
        audit.setAppUser(user);
        audit.setAttemptedEmail(email);
        audit.setIpAddress(ip);
        audit.setLoginStatus(status);
        audit.setLoginTime(LocalDateTime.now());
        auditRepository.save(audit);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<AppUser> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
        }

        AppUser user = userOptional.get();

        // checks how many tokens were generated in the last hour
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        int recentRequests = tokenRepository.countByUser_UserIdAndCreatedAtAfter(Math.toIntExact(user.getUserId()), oneHourAgo);

        if (recentRequests >= 3) {
            return ResponseEntity.status(429).body("Too many password reset requests. Please try again in an hour.");
        }

        tokenRepository.deleteByUser_UserId(Math.toIntExact(user.getUserId()));

        // generates the raw token to send to the user
        String rawToken = UUID.randomUUID().toString();

        // hashes the token before saving it to the database
        String hashedToken = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken(
                hashedToken,
                user,
                LocalDateTime.now().plusMinutes(15)
        );
        tokenRepository.save(resetToken);

        // password reset check
        System.out.println("\n=== MOCK EMAIL ===");
        // sends the RAW token in the email, not the hashed one
        System.out.println("http://localhost:5173/reset-password?token=" + rawToken);
        System.out.println("==================\n");

        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String rawToken = request.get("token");
        String newPassword = request.get("newPassword");

        // hashes the incoming raw token to find its match in the database
        String hashedToken = hashToken(rawToken);
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByTokenHash(hashedToken);

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or missing token.");
        }

        PasswordResetToken resetToken = tokenOptional.get();

        // checks if the token was already used
        if (resetToken.getUsedAt() != null) {
            return ResponseEntity.badRequest().body("This reset link has already been used.");
        }

        // checks if the token has expired
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token has expired. Please request a new one.");
        }

        AppUser user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword)); // Update this setter if needed
        userRepository.save(user);

        // Audit trail -> marks the token as used instead of deleting it
        resetToken.setUsedAt(LocalDateTime.now());
        tokenRepository.save(resetToken);

        return ResponseEntity.ok("Password successfully reset. You can now log in.");
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}

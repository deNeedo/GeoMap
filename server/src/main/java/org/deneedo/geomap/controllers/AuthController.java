package org.deneedo.geomap.controllers;

import java.util.Map;
import java.util.UUID;

import org.deneedo.geomap.components.EmailService;
import org.deneedo.geomap.components.JsonWebToken;
import org.deneedo.geomap.components.User;
import org.deneedo.geomap.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;
    @Autowired private JsonWebToken jwt;

    private static String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
    @PostMapping("/login") public String login(@RequestBody User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser != null && foundUser.isVerified() && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            String token = jwt.generateToken(foundUser.getUsername());
            foundUser.setVerificationToken(token);
            userRepository.save(foundUser);
            return token;
        }
        return null;
    }
    @PostMapping("/register") public String register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return "Username is already taken!";
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email is already in use!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        String token = AuthController.generateVerificationToken();
        user.setVerificationToken(token);
        user.setVerified(false);
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), token);
        return "User registered successfully!";
    }
    @PostMapping("/logout1") public String logout(@RequestHeader Map<String, String> headers) {
        User foundUser = userRepository.findByVerificationToken(headers.get("auth-token"));
        if (foundUser != null) {
            foundUser.setVerificationToken(null);
            userRepository.save(foundUser);
        }
        return null;
    }

    @PostMapping("/verify") public String verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token);
        if (user != null) {
            user.setVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return "Email verified successfully!";
        }
        return "Invalid verification token!";
    }
}

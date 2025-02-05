package org.deneedo.geomap.components;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JsonWebToken {
    private String SECRET_KEY = KeyGenerator.create();

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "user");
        return this.createToken(claims, username);
    }

    public boolean validateToken(String token, String username) {
        return (username.equals(this.extractAllClaims(token).getSubject()) && !this.isTokenExpired(token));
    }

    private String createToken(Map<String, Object> claims, String subject) {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
            .signWith(SignatureAlgorithm.HS256, decodedKey)
            .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpired(String token) {
        return this.extractAllClaims(token).getExpiration().before(new Date());
    }
}

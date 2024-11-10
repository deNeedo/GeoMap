package org.deneedo.geomap.components;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String username;
    private String email;
    private String password;
    private String verificationToken;
    private boolean isVerified;

    public Long getId() {return this.id;}
    public String getUsername() {return this.username;}
    public String getEmail() {return this.email;}
    public String getPassword() {return this.password;}
    public void setPassword(String password) {this.password = password;}
    public String getVerificationToken() {return this.verificationToken;}
    public void setVerificationToken(String verificationToken) {this.verificationToken = verificationToken;}
    public boolean isVerified() {return this.isVerified;}
    public void setVerified(boolean verified) {this.isVerified = verified;}
    @Override public String toString() {
        return (
            "Username: " + this.username + "\n" +
            "Email: " + this.email + "\n" +
            "Password: " + this.password + "\n" +
            "Token: " + this.verificationToken + "\n" +
            "Verified: " + this.isVerified
        );
    }
}

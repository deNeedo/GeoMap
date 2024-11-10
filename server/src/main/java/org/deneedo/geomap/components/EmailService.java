package org.deneedo.geomap.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String from = "jkudrys@protonmail.com";
        String subject = "Email Verification";
        String verificationUrl = "http://10.147.17.201:3000/verify?token=" + token;
        String message = "Please click the following link to verify your email: " + verificationUrl;
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(from);
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }
}

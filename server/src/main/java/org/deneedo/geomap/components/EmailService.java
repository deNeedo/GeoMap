package org.deneedo.geomap.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired private JavaMailSender mailSender;
    @Value("${client.IP}") private String clientIP;
    @Value("${client.PORT}") private String clientPORT;
    @Value("${server.mail.hostname}") private String serverMailHostname;

    public void sendVerificationEmail(String to, String token) {
        String from = this.serverMailHostname;
        String subject = "Email Verification";
        String verificationUrl = "http://" + this.clientIP + ":" + this.clientPORT + "/verify?token=" + token;
        System.out.println(verificationUrl);
        String message = "Click the following link to verify your email: " + verificationUrl;
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(from);
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }
}

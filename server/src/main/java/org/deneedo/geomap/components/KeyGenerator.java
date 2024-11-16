package org.deneedo.geomap.components;

import java.security.SecureRandom;
import java.util.Base64;

public class KeyGenerator {
    public static String create() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[32];
        secureRandom.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }
}
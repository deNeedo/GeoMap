package org.deneedo.geomap.controllers;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.deneedo.geomap.components.Marker;
import org.deneedo.geomap.components.User;
import org.deneedo.geomap.repositories.MarkerRepository;
import org.deneedo.geomap.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CollectionController {
    @Autowired private MarkerRepository markerRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping("/saveCollection") @Transactional
    public String saveCollection(@RequestHeader Map<String, String> headers, @RequestBody List<Marker> body) {
        User foundUser = userRepository.findByVerificationToken(headers.get("auth-token"));
        String username = foundUser.getUsername();
        markerRepository.deleteByUsername(username);
        int counter = 0;
        for (Marker marker : body) {
            marker.setUsername(username);
            body.set(counter, marker);
            counter += 1;
        }
        markerRepository.saveAll(body);
        return "Markers received successfully!";
    }

    @GetMapping("/loadCollection")
    public List<Marker> loadCollection(@RequestHeader Map<String, String> headers) {
        User foundUser = userRepository.findByVerificationToken(headers.get("auth-token"));
        String username = foundUser.getUsername();
        if (username != null) {
            return markerRepository.findByUsername(username);
        } else {
            return Collections.emptyList();
        }
    }
}

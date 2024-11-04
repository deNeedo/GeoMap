package org.deneedo.geomap;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://10.147.17.201:3000")
public class MappingController {
    @Autowired
    private MarkerRepository markerRepository;

    @PostMapping("/saveCollection")
    public String saveCollection(@RequestHeader Map<String, String> headers, @RequestBody List<Marker> body) {
        // Extract username
        headers.forEach((key, value) -> {
            if (key.equals("username")) {
                System.out.println("User: " + value + " sends there markers to save:");
            }
        });
        // Extract markers
        for (Marker marker : body) {
            System.out.print(marker.getLat() + ", ");
            System.out.print(marker.getLng() + ", ");
            System.out.print(marker.getElev() + "m\n");
        }
        markerRepository.saveAll(body);
        return "Markers received successfully!";
    }

    @GetMapping("/loadCollection")
    public List<Marker> loadCollection() {
        return markerRepository.findAll();
    }
}

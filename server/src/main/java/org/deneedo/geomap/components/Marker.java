package org.deneedo.geomap.components;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "markers")
public class Marker {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Double lat;
    private Double lng;
    private Integer elev;
    private String username;

    public Long getId() {return this.id;}
    public Double getLat() {return this.lat;}
    public Double getLng() {return this.lng;}
    public Integer getElev() {return this.elev;}
    public String getUsername() {return this.username;}
    public void setUsername(String username) {this.username = username;}
    @Override public String toString() {
        return (
            "Latitude: " + this.lat + ", " +
            "Longitude: " + this.lng + ", " +
            "Elevation: " + this.elev + "\n" +
            "User: " + this.username + "\n"
        );
    }
}

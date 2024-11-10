package org.deneedo.geomap.components;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "markers")
public class Marker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double lat;
    private Double lng;
    private Integer elev;

    public Long getId() {return id;}
    public Double getLat() {return lat;}
    public Double getLng() {return lng;}
    public Integer getElev() {return elev;}
}

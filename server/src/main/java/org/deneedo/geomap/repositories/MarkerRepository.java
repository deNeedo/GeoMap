package org.deneedo.geomap.repositories;

import java.util.List;
import org.deneedo.geomap.components.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarkerRepository extends JpaRepository<Marker, Long> {
    List<Marker> findByUsername(String username);
    void deleteByUsername(String username);
}

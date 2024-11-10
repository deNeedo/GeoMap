package org.deneedo.geomap.repositories;

import org.deneedo.geomap.components.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByVerificationToken(String token);
}

DROP DATABASE IF EXISTS geomap_db;
CREATE DATABASE geomap_db WITH ENCODING 'UTF8';
\c geomap_db

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (name, latitude, longitude) VALUES
('New York', 40.7128, -74.0060),
('Los Angeles', 34.0522, -118.2437);
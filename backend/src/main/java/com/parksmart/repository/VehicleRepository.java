package com.parksmart.repository;

import com.parksmart.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByEntryTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
}

package com.parksmart.service;

import com.parksmart.entity.Vehicle;
import com.parksmart.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Add new vehicle (IN)
    public Vehicle saveVehicle(Vehicle vehicle) {
        vehicle.setStatus("IN");
        vehicle.setEntryTime(LocalDateTime.now());
        vehicle.setOutTime(null);
        vehicle.setTotalHours(0L);
        vehicle.setPrice(0.0);
        return vehicleRepository.save(vehicle);
    }

    // Get all vehicles
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // Update vehicle info (Admin edit)
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Optional<Vehicle> optional = vehicleRepository.findById(id);
        if (optional.isPresent()) {
            Vehicle existing = optional.get();
            existing.setVehicleNo(vehicle.getVehicleNo());
            existing.setPhone(vehicle.getPhone());
            // Keep status, entryTime, outTime, totalHours, price unchanged
            return vehicleRepository.save(existing);
        }
        return null;
    }

    // Delete vehicle
    public String deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
        return "Vehicle deleted successfully";
    }

    // Mark IN → OUT
    public Vehicle markOut(Long id) {
        Optional<Vehicle> optional = vehicleRepository.findById(id);
        if (optional.isPresent()) {
            Vehicle vehicle = optional.get();

            if ("OUT".equals(vehicle.getStatus())) {
                return vehicle; // already OUT
            }

            LocalDateTime outTime = LocalDateTime.now();
            vehicle.setOutTime(outTime);

            // Calculate total hours (ceil to next hour)
            long minutes = Duration.between(vehicle.getEntryTime(), outTime).toMinutes();
            long hours = (minutes <= 5) ? 0 : (minutes + 59) / 60; // grace 5 mins
            vehicle.setTotalHours(hours);

            // Price = 20 per hour
            vehicle.setPrice(hours * 20.0);
            vehicle.setStatus("OUT");

            return vehicleRepository.save(vehicle);
        }
        return null;
    }

    // Filter by entry date range
    public List<Vehicle> getVehiclesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return vehicleRepository.findByEntryTimeBetween(startDate, endDate);
    }
}

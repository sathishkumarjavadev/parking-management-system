package com.parksmart.controller;

import com.parksmart.entity.Vehicle;
import com.parksmart.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // Add new vehicle
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.saveVehicle(vehicle);
    }

    // Get all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        return vehicleService.deleteVehicle(id);
    }

    // Admin update
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    // Mark IN → OUT
    @PutMapping("/mark-out/{id}")
    public Vehicle markOut(@PathVariable Long id) {
        return vehicleService.markOut(id);
    }

    // Filter by entry date range
    @GetMapping("/filter")
    public List<Vehicle> filterByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return vehicleService.getVehiclesByDateRange(startDate, endDate);
    }
}

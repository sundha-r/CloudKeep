package com.project.cloudkeep.controller;

import com.project.cloudkeep.DTO.ProfileDTO;
import com.project.cloudkeep.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody ProfileDTO profile){
        HttpStatus status=profileService.existsByClerkId(profile.getClerkId()) ?HttpStatus.OK :HttpStatus.CREATED ;
        ProfileDTO registeredProfile=profileService.createProfile(profile);

        return ResponseEntity.status(status).body(registeredProfile);
    }

}

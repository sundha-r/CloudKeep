package com.project.cloudkeep.service;

import com.project.cloudkeep.DTO.ProfileDTO;
import com.project.cloudkeep.document.ProfileDocument;
import com.project.cloudkeep.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileDTO createProfile(ProfileDTO profileDTO){
        if(profileRepository.existsByClerkId(profileDTO.getClerkId())){
            return updateProfile(profileDTO);
        }
        ProfileDocument profile=toDocument(profileDTO);
        profile = profileRepository.save(profile);
        return toDto(profile);

    }

    public ProfileDTO updateProfile(ProfileDTO profileDTO){
       ProfileDocument existingProfile= profileRepository.findByClerkId(profileDTO.getClerkId());
       //update
       if(existingProfile !=null){

           if(profileDTO.getEmail()!= null && !profileDTO.getEmail().isEmpty()){
               existingProfile.setEmail(profileDTO.getEmail());
           }

           if(profileDTO.getFirstName()!= null && !profileDTO.getFirstName().isEmpty()){
               existingProfile.setFirstName(profileDTO.getFirstName());
           }

           if(profileDTO.getLastName()!= null && !profileDTO.getLastName().isEmpty()){
               existingProfile.setLastName(profileDTO.getLastName());
           }
           if(profileDTO.getPhotoUrl()!= null && !profileDTO.getPhotoUrl().isEmpty()){
               existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());
           }
           existingProfile=profileRepository.save(existingProfile);
           return toDto(existingProfile);
       }
       return null;
    }

    public void deleteProfile(String clerkId){
        ProfileDocument existingProfile=profileRepository.findByClerkId(clerkId);
        if(existingProfile!= null){
            profileRepository.delete(existingProfile);
        }
    }

    public ProfileDocument getCurrentProfile(){
        if(SecurityContextHolder.getContext().getAuthentication()==null){
            throw new UsernameNotFoundException("user not authenticated...");
        }
        String clerkId=SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepository.findByClerkId(clerkId);
    }
    //helper methods
    private ProfileDTO toDto(ProfileDocument profile) {
        return ProfileDTO.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(profile.getEmail())
                .photoUrl(profile.getPhotoUrl())
                .createdAt(profile.getCreatedAt())
                .credits(profile.getCredits())
                .build();
    }

    private ProfileDocument toDocument(ProfileDTO profile) {
        return ProfileDocument.builder()
                .clerkId(profile.getClerkId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(profile.getEmail())
                .credits(5)
                .photoUrl(profile.getPhotoUrl())
                .createdAt(Instant.now())
                .build();

    }

    public Boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }
}

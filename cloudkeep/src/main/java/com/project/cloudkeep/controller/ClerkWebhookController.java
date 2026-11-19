package com.project.cloudkeep.controller;

import com.project.cloudkeep.DTO.ProfileDTO;
import com.project.cloudkeep.service.ProfileService;
import com.project.cloudkeep.service.UserCreditsService;
import com.svix.Webhook;
import com.svix.exceptions.WebhookVerificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webhooks")
public class ClerkWebhookController {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;


    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                                @RequestHeader("svix-timestamp") String svixTimestamp,
                                                @RequestHeader("svix-signature") String svixSignature,
                                                @RequestBody String payload) {
        try {
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid webhook signature");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);

            String eventType = rootNode.path("type").asString();

            switch (eventType){
                case "user.created":
                    handleUserCreated(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNode.path("data"));
                    break;
                case"user.deleted":
                    handleUserDeleted(rootNode.path("data"));
                    break;

            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing webhook: " + e.getMessage());
        }
    }

    private void handleUserDeleted(JsonNode data) {
       String clerkId= data.path("id").asString();
       profileService.deleteProfile(clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId=data.path("id").asString();
        String email="";
        JsonNode emailAddresses=data.path("email_addresses");
        if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
            email=emailAddresses.get(0).path("email_address").asString();
        }
        String firstName=data.path("first_name").asString("");
        String lastName=data.path("last_name").asString("");
        String photoUrl=data.path("image_url").asString("");

        ProfileDTO updateProfile=ProfileDTO.builder()
                .clerkId(clerkId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .photoUrl(photoUrl)
                .build();

        ProfileDTO updatedProfile=profileService.updateProfile(updateProfile);
        if(updatedProfile == null){
            handleUserCreated(data);
        }
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId=data.path("id").asString();
        String email="";
        JsonNode emailAddresses=data.path("email_addresses");
        if(emailAddresses.isArray() && !emailAddresses.isEmpty()){
            email=emailAddresses.get(0).path("email_address").asString();
        }
        String firstName=data.path("first_name").asString("");
        String lastName=data.path("last_name").asString("");
        String photoUrl=data.path("image_url").asString("");

        ProfileDTO profile=ProfileDTO.builder()
                .clerkId(clerkId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .photoUrl(photoUrl)
                .build();

        profileService.createProfile(profile);
        userCreditsService.createInitialCredits(clerkId);

    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        if (webhookSecret == null || webhookSecret.isEmpty()) {
            return false;
        }
        try {
            Webhook webhook = new Webhook(webhookSecret);
            Map<String, List<String>> headers = Map.of(
                    "svix-id", List.of(svixId),
                    "svix-timestamp", List.of(svixTimestamp),
                    "svix-signature", List.of(svixSignature)
            );
            webhook.verify(payload, headers);
            return true;
        } catch (WebhookVerificationException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}

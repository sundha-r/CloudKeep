package com.project.cloudkeep.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProfileDTO {
    private String id;
    private String clerkId;
    private String firstName;
    private String lastName;
    private String email;
    private Integer credits;
    private String photoUrl;
    private Instant createdAt;
}

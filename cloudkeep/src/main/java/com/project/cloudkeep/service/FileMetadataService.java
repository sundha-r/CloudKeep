package com.project.cloudkeep.service;

import com.project.cloudkeep.DTO.FileMetadataDTO;
import com.project.cloudkeep.document.FileMetadataDocument;
import com.project.cloudkeep.document.ProfileDocument;
import com.project.cloudkeep.exception.NotEnoughCreditsException;
import com.project.cloudkeep.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetadataRepository fileMetadataRepository;


    public List<FileMetadataDTO> uploadFiles(MultipartFile[] files) throws IOException {
        List<FileMetadataDocument> savedFiles=new ArrayList<>();

        ProfileDocument currentProfile=profileService.getCurrentProfile();
        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new NotEnoughCreditsException("Not enough credits to upload files. Please purchase more credits");
        }

        Path uploadPath=Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for(MultipartFile file:files){
            String fileName=UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation=uploadPath.resolve(fileName);
            //put the files into the server's filesystem
            Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String contentType = Files.probeContentType(targetLocation);

            FileMetadataDocument fileMetadata=FileMetadataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(contentType)
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            userCreditsService.consumeCredit();

            savedFiles.add(fileMetadataRepository.save(fileMetadata));
        }
        return savedFiles.stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<FileMetadataDTO> getFiles(){
        ProfileDocument currentProfile=profileService.getCurrentProfile();
        List<FileMetadataDocument> files=fileMetadataRepository.findByClerkIdOrderByUploadedAtDesc(currentProfile.getClerkId());
        return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FileMetadataDTO getPublicFile(String id){
        Optional<FileMetadataDocument>file=fileMetadataRepository.findById(id);
        if(file.isEmpty() || !file.get().getIsPublic()){
            throw new RuntimeException("Unable to get the file");
        }
        FileMetadataDocument document=file.get();
        return mapToDTO(document);
    }
    public FileMetadataDTO getDownloadableFle(String id){
        FileMetadataDocument file=fileMetadataRepository.findById(id).orElseThrow(()-> new RuntimeException("File not found"));
        return mapToDTO(file);
    }

    public void deleteFile(String id){
        try{
            ProfileDocument profile=profileService.getCurrentProfile();
            FileMetadataDocument file=fileMetadataRepository.findById(id)
                    .orElseThrow(()->new RuntimeException("File not found"));
            if(!file.getClerkId().equals(profile.getClerkId())){
                throw new RuntimeException("File is not belong to current user");
            }
            Path filePath=Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);
            fileMetadataRepository.deleteById(id);
        }catch (Exception e){
            throw new RuntimeException("Error deleting the file");
        }
    }

    public FileMetadataDTO togglePublic(String id){
        FileMetadataDocument file=fileMetadataRepository.findById(id)
                .orElseThrow(()->new RuntimeException("file not found"));
        file.setIsPublic(!file.getIsPublic());
        file=fileMetadataRepository.save(file);
        return mapToDTO(file);

    }
    //helper method
    private FileMetadataDTO mapToDTO(FileMetadataDocument fileMetadataDocument) {
        return FileMetadataDTO.builder()
                .id(fileMetadataDocument.getId())
                .fileLocation(fileMetadataDocument.getFileLocation())
                .name(fileMetadataDocument.getName())
                .type(fileMetadataDocument.getType())
                .size(fileMetadataDocument.getSize())
                .clerkId(fileMetadataDocument.getClerkId())
                .isPublic(fileMetadataDocument.getIsPublic())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();
    }

}

package com.matchme.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            // Create the directory automatically
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to create the upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(
                Optional.ofNullable(file.getOriginalFilename()).orElse("unnamed")
        );

        try {
            // Check for invalid characters
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Invalid path sequence in filename: " + originalFilename);
            }
            // Create a unique filename to avoid conflicts
            String extension = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueName = UUID.randomUUID() + extension;

            // Create the final destination path then save the file
            Path targetLocation = this.fileStorageLocation.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/images/" + uniqueName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + originalFilename + ". Please try again!", ex);
        }
    }

    public void deleteFile(String urlPath) {
        try {
            String filename = Paths.get(urlPath).getFileName().toString();
            Path filePath = this.fileStorageLocation.resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file " + urlPath + ". Please try again!");
        }
    }
}

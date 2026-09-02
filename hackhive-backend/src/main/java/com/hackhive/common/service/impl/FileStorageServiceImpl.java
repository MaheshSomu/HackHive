package com.hackhive.common.service.impl;

import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootLocation;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/webp"
    );

    public FileStorageServiceImpl(@Value("${app.file.upload-dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a file.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size must be smaller than 5 MB.");
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        if ("resumes".equalsIgnoreCase(subDirectory)) {
            boolean isPdf = (contentType != null && contentType.equalsIgnoreCase("application/pdf"))
                    || (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf"));
            if (!isPdf) {
                throw new BadRequestException("Only PDF files are allowed.");
            }
        } else {
            if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                throw new BadRequestException("Only PNG, JPG, JPEG, and WebP images are supported.");
            }
        }

        String extension = getExtension(contentType, originalFilename, subDirectory);
        String generatedFilename = UUID.randomUUID().toString() + extension;

        try {
            Path targetDir = this.rootLocation.resolve(subDirectory).normalize();
            if (!targetDir.startsWith(this.rootLocation)) {
                throw new BadRequestException("Invalid path traversal attempt.");
            }

            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            Path destinationFile = targetDir.resolve(generatedFilename).normalize();
            if (!destinationFile.startsWith(targetDir)) {
                throw new BadRequestException("Invalid path traversal attempt.");
            }

            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            if ("resumes".equalsIgnoreCase(subDirectory)) {
                return "uploads/resumes/" + generatedFilename;
            }

            return "/api/uploads/" + subDirectory + "/" + generatedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String filename, String subDirectory) {
        try {
            if (filename == null || filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return null;
            }

            Path targetDir = this.rootLocation.resolve(subDirectory).normalize();
            Path filePath = targetDir.resolve(filename).normalize();

            if (!filePath.startsWith(targetDir)) {
                return null;
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException e) {
            return null;
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.trim().isEmpty()) {
            return;
        }

        try {
            Path filePath = null;
            String prefix = "/api/uploads/";

            if (fileUrl.contains(prefix)) {
                String relativePath = fileUrl.substring(fileUrl.indexOf(prefix) + prefix.length());
                filePath = this.rootLocation.resolve(relativePath).normalize();
            } else {
                filePath = Paths.get(fileUrl).toAbsolutePath().normalize();
            }

            if (filePath != null && Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (Exception e) {
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }

    private String getExtension(String contentType, String originalFilename, String subDirectory) {
        if ("resumes".equalsIgnoreCase(subDirectory)) {
            return ".pdf";
        }
        if (contentType != null) {
            switch (contentType.toLowerCase()) {
                case "image/png":
                    return ".png";
                case "image/jpeg":
                    return ".jpg";
                case "image/webp":
                    return ".webp";
            }
        }
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            if (ext.equals(".png") || ext.equals(".jpg") || ext.equals(".jpeg") || ext.equals(".webp")) {
                return ext.equals(".jpeg") ? ".jpg" : ext;
            }
        }
        return ".png";
    }
}

package com.hackhive.common.controller;

import com.hackhive.common.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @GetMapping("/organizer-logos/{filename:.+}")
    public ResponseEntity<Resource> getOrganizerLogo(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename, "organizer-logos");

        if (resource == null || !resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = null;
        try {
            contentType = Files.probeContentType(resource.getFile().toPath());
        } catch (IOException e) {
            // Fallback content type detection
        }

        if (contentType == null) {
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = MediaType.IMAGE_PNG_VALUE;
            } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                contentType = MediaType.IMAGE_JPEG_VALUE;
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            } else {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                .body(resource);
    }
}

package com.hackhive.common.service.impl;

import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnExpression("'${storage.type:local}'.equalsIgnoreCase('b2') || '${storage.type:local}'.equalsIgnoreCase('backblaze')")
public class B2ObjectStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/webp"
    );

    @Value("${b2.s3.endpoint:}")
    private String endpoint;

    @Value("${b2.s3.region:}")
    private String region;

    @Value("${b2.s3.bucket:}")
    private String bucketName;

    @Value("${b2.s3.access-key-id:}")
    private String accessKeyId;

    @Value("${b2.s3.secret-access-key:}")
    private String secretAccessKey;

    private S3Client s3Client;

    private synchronized S3Client getS3Client() {
        if (this.s3Client == null) {
            if (!StringUtils.hasText(endpoint) || !StringUtils.hasText(region)
                    || !StringUtils.hasText(bucketName) || !StringUtils.hasText(accessKeyId)
                    || !StringUtils.hasText(secretAccessKey)) {
                throw new IllegalStateException("Backblaze B2 S3 storage is configured (storage.type=b2), but required properties are incomplete.");
            }

            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            this.s3Client = S3Client.builder()
                    .endpointOverride(URI.create(endpoint))
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                    .build();
        }
        return this.s3Client;
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
        String objectKey = subDirectory + "/" + UUID.randomUUID().toString() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .contentLength(file.getSize())
                    .build();

            getS3Client().putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return objectKey;
        } catch (IOException e) {
            log.error("Failed to read input stream for storage key: {}", objectKey);
            throw new RuntimeException("Failed to store file in Backblaze B2.", e);
        } catch (S3Exception e) {
            log.error("Backblaze B2 S3 upload failed for key: {}, error code: {}", objectKey, e.awsErrorDetails() != null ? e.awsErrorDetails().errorCode() : e.getMessage());
            throw new RuntimeException("Failed to store file in Backblaze B2.", e);
        } catch (Exception e) {
            log.error("Backblaze B2 upload failed for key: {}", objectKey);
            throw new RuntimeException("Failed to store file in Backblaze B2.", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String filename, String subDirectory) {
        if (!StringUtils.hasText(filename) || filename.contains("..")) {
            return null;
        }

        String objectKey = subDirectory + "/" + filename;
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            ResponseInputStream<GetObjectResponse> s3Stream = getS3Client().getObject(getObjectRequest);
            return new InputStreamResource(s3Stream);
        } catch (NoSuchKeyException e) {
            log.error("Object not found in Backblaze B2 for key: {}", objectKey);
            return null;
        } catch (Exception e) {
            log.error("Failed to load object from Backblaze B2 for key: {}", objectKey);
            return null;
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (!StringUtils.hasText(fileUrl)) {
            return;
        }

        String objectKey = extractObjectKey(fileUrl);
        if (!StringUtils.hasText(objectKey)) {
            return;
        }

        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            getS3Client().deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            log.error("Failed to delete object from Backblaze B2 for key: {}", objectKey);
        }
    }

    private String extractObjectKey(String fileUrl) {
        String key = fileUrl.trim();
        if (key.startsWith("/api/uploads/")) {
            key = key.substring("/api/uploads/".length());
        } else if (key.startsWith("uploads/")) {
            key = key.substring("uploads/".length());
        }
        return key;
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

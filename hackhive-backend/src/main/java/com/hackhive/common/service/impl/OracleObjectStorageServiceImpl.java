package com.hackhive.common.service.impl;

import com.hackhive.common.exception.BadRequestException;
import com.hackhive.common.service.FileStorageService;
import com.oracle.bmc.Region;
import com.oracle.bmc.auth.SimpleAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.requests.DeleteObjectRequest;
import com.oracle.bmc.objectstorage.requests.GetObjectRequest;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@Slf4j
@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "oracle")
public class OracleObjectStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/png",
            "image/jpeg",
            "image/webp"
    );

    @Value("${oracle.objectstorage.namespace:}")
    private String namespace;

    @Value("${oracle.objectstorage.bucket:}")
    private String bucketName;

    @Value("${oracle.objectstorage.region:}")
    private String region;

    @Value("${oracle.objectstorage.tenancy-id:}")
    private String tenancyId;

    @Value("${oracle.objectstorage.user-id:}")
    private String userId;

    @Value("${oracle.objectstorage.fingerprint:}")
    private String fingerprint;

    @Value("${oracle.objectstorage.private-key:}")
    private String privateKey;

    private ObjectStorage objectStorageClient;

    private synchronized ObjectStorage getClient() {
        if (this.objectStorageClient == null) {
            if (!StringUtils.hasText(tenancyId) || !StringUtils.hasText(userId)
                    || !StringUtils.hasText(fingerprint) || !StringUtils.hasText(privateKey)
                    || !StringUtils.hasText(region) || !StringUtils.hasText(namespace)
                    || !StringUtils.hasText(bucketName)) {
                throw new IllegalStateException("Oracle Object Storage is configured as storage.type=oracle, but required credentials/configuration are incomplete.");
            }

            Supplier<InputStream> privateKeySupplier = () -> {
                try {
                    String formattedKey = privateKey.replace("\\n", "\n");
                    if (formattedKey.startsWith("-----BEGIN") || formattedKey.contains("PRIVATE KEY-----")) {
                        return new ByteArrayInputStream(formattedKey.getBytes(StandardCharsets.UTF_8));
                    }
                    Path keyFilePath = Paths.get(privateKey);
                    if (Files.exists(keyFilePath)) {
                        return Files.newInputStream(keyFilePath);
                    }
                    return new ByteArrayInputStream(formattedKey.getBytes(StandardCharsets.UTF_8));
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read Oracle private key", e);
                }
            };

            SimpleAuthenticationDetailsProvider provider = SimpleAuthenticationDetailsProvider.builder()
                    .tenantId(tenancyId)
                    .userId(userId)
                    .fingerprint(fingerprint)
                    .privateKeySupplier(privateKeySupplier)
                    .region(Region.fromRegionId(region))
                    .build();

            this.objectStorageClient = ObjectStorageClient.builder()
                    .region(Region.fromRegionId(region))
                    .build(provider);
        }
        return this.objectStorageClient;
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
                    .namespaceName(namespace)
                    .bucketName(bucketName)
                    .objectName(objectKey)
                    .contentLength(file.getSize())
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .putObjectBody(file.getInputStream())
                    .build();

            getClient().putObject(putObjectRequest);

            return objectKey;
        } catch (IOException e) {
            log.error("Failed to read file input stream for storage key: {}", objectKey);
            throw new RuntimeException("Failed to store file in Oracle Object Storage.", e);
        } catch (Exception e) {
            log.error("Oracle Object Storage upload failed for key: {}", objectKey);
            throw new RuntimeException("Failed to store file in Oracle Object Storage.", e);
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
                    .namespaceName(namespace)
                    .bucketName(bucketName)
                    .objectName(objectKey)
                    .build();

            GetObjectResponse getObjectResponse = getClient().getObject(getObjectRequest);
            return new InputStreamResource(getObjectResponse.getInputStream());
        } catch (Exception e) {
            log.error("Failed to load object from Oracle Object Storage for key: {}", objectKey);
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
                    .namespaceName(namespace)
                    .bucketName(bucketName)
                    .objectName(objectKey)
                    .build();

            getClient().deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            log.error("Failed to delete object from Oracle Object Storage for key: {}", objectKey);
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

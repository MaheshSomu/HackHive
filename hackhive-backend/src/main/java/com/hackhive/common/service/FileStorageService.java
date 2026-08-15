package com.hackhive.common.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String storeFile(MultipartFile file, String subDirectory);

    Resource loadFileAsResource(String filename, String subDirectory);

    void deleteFile(String fileUrl);
}

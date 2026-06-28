package com.hackhive.auth.service;

import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.response.AuthResponse;
import com.hackhive.auth.dto.response.UserResponse;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser();
}
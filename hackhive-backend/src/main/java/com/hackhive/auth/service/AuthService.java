package com.hackhive.auth.service;

import com.hackhive.auth.dto.request.LoginRequest;
import com.hackhive.auth.dto.request.RegisterRequest;
import com.hackhive.auth.dto.response.AuthResponse;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}
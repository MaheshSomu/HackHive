package com.hackhive.event.config;

import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key-id:rzp_test_placeholder}")
    private String keyId;

    @Value("${razorpay.key-secret:rzp_secret_placeholder}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() {
        try {
            return new RazorpayClient(keyId, keySecret);
        } catch (Exception e) {
            System.err.println("Warning: Could not initialize RazorpayClient bean: " + e.getMessage());
            return null;
        }
    }
}

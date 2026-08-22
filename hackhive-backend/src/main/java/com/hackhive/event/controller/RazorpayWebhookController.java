package com.hackhive.event.controller;

import com.hackhive.event.entity.EventRegistration;
import com.hackhive.event.enums.PaymentStatus;
import com.hackhive.event.enums.RegistrationStatus;
import com.hackhive.event.repository.EventRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final EventRegistrationRepository eventRegistrationRepository;

    @Value("${razorpay.webhook-secret:rzp_webhook_placeholder}")
    private String webhookSecret;

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String requestBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        if (signature == null || signature.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing webhook signature header.");
        }

        // Verify Razorpay Webhook Signature
        boolean isValid = verifySignature(requestBody, signature, webhookSecret);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid webhook signature.");
        }

        try {
            JSONObject payload = new JSONObject(requestBody);
            String eventType = payload.optString("event");

            if ("payment.captured".equals(eventType) || "order.paid".equals(eventType)) {
                JSONObject payloadObj = payload.optJSONObject("payload");
                if (payloadObj != null) {
                    String orderId = null;
                    String paymentId = null;

                    if (payloadObj.has("payment")) {
                        JSONObject paymentEntity = payloadObj.getJSONObject("payment").optJSONObject("entity");
                        if (paymentEntity != null) {
                            orderId = paymentEntity.optString("order_id", null);
                            paymentId = paymentEntity.optString("id", null);
                        }
                    }

                    if ((orderId == null || orderId.isBlank()) && payloadObj.has("order")) {
                        JSONObject orderEntity = payloadObj.getJSONObject("order").optJSONObject("entity");
                        if (orderEntity != null) {
                            orderId = orderEntity.optString("id", null);
                        }
                    }

                    if (orderId != null && !orderId.isBlank()) {
                        Optional<EventRegistration> registrationOpt = eventRegistrationRepository.findByRazorpayOrderId(orderId);
                        if (registrationOpt.isPresent()) {
                            EventRegistration registration = registrationOpt.get();

                            // Idempotency: If already confirmed or cancelled, simply acknowledge
                            if (registration.getStatus() != RegistrationStatus.CONFIRMED && registration.getStatus() != RegistrationStatus.CANCELLED) {
                                registration.setStatus(RegistrationStatus.CONFIRMED);
                                registration.setPaymentStatus(PaymentStatus.PAID);
                                if (registration.getAmountPaid() == null && registration.getEvent() != null) {
                                    registration.setAmountPaid(registration.getEvent().getRegistrationFee());
                                }
                                if (paymentId != null && !paymentId.isBlank()) {
                                    registration.setRazorpayPaymentId(paymentId);
                                }
                                registration.setPaidAt(LocalDateTime.now());
                                eventRegistrationRepository.save(registration);
                            }
                        }
                    }
                }
            }
            return ResponseEntity.ok("Webhook processed successfully.");
        } catch (Exception e) {
            System.err.println("Error processing Razorpay webhook: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing webhook.");
        }
    }

    private boolean verifySignature(String payload, String expectedSignature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(expectedSignature);
        } catch (Exception e) {
            return false;
        }
    }
}

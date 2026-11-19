package com.project.cloudkeep.service;

import com.project.cloudkeep.DTO.PaymentDTO;
import com.project.cloudkeep.DTO.PaymentVerificationDTO;
import com.project.cloudkeep.document.PaymentTransaction;
import com.project.cloudkeep.document.ProfileDocument;
import com.project.cloudkeep.repository.PaymentTransactionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;


    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.secret.key}")
    private String razorpaySecretKey;

    public PaymentDTO createOrder(PaymentDTO paymentDTO)  {
        try{
            ProfileDocument currentProfile=profileService.getCurrentProfile();
            String clerkId=currentProfile.getClerkId();

            RazorpayClient razorpayClient=new RazorpayClient(razorpayKeyId,razorpaySecretKey);

            JSONObject orderRequest=new JSONObject();
            orderRequest.put("amount",paymentDTO.getAmount());
            orderRequest.put("currency",paymentDTO.getCurrency());
            orderRequest.put("receipt","Order_"+System.currentTimeMillis());

            Order order=razorpayClient.orders.create(orderRequest);
            String orderId=order.get("id");

            //create pending transaction record
            PaymentTransaction transaction=PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDTO.getPlanId())
                    .amount(paymentDTO.getAmount())
                    .currency(paymentDTO.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName()+" "+currentProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transaction);

            //return DTO to user
            return PaymentDTO.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order created successfully")
                    .build();


        } catch (Exception e) {
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error creating order: "+e.getMessage())
                    .build();
        }
    }

    public PaymentDTO verifyPayment(PaymentVerificationDTO request){
        try{
            ProfileDocument currentProfile=profileService.getCurrentProfile();
            String clerkId=currentProfile.getClerkId();

            String data= request.getRazorpay_orderId()+ "|" +request.getRazorpay_paymentId();
            String generatedSignature= generateHmacSha256Signature(data,razorpaySecretKey);

            if(!generatedSignature.equals(request.getRazorpay_signature())){
                updateTransactionStatus(request.getRazorpay_orderId(),"FAILED",request.getRazorpay_paymentId(),null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Payment signature verification failed.")
                        .build();
            }
            //Add credits based on plan
            int creditsToAdd=0;
            String plan="BASIC";
            switch (request.getPlanId()){
                case "premium":
                    creditsToAdd=500;
                    plan="PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd=5000;
                    plan="ULTIMATE";
                    break;

            }
            if(creditsToAdd>0){
                userCreditsService.addCredits(clerkId,creditsToAdd,plan);
                updateTransactionStatus(request.getRazorpay_orderId(),"SUCCESS",request.getRazorpay_paymentId(),creditsToAdd);
                return PaymentDTO.builder()
                        .success(true)
                        .message("Payment verified and credits added successfully.")
                        .credits(userCreditsService.getUserCredits(clerkId).getCredits())
                        .build();
            }
            else{
                updateTransactionStatus(request.getRazorpay_orderId(),"FAILED",request.getRazorpay_paymentId(),null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Invalid Plan selected.")
                        .build();
            }

        }
        catch (Exception e) {
                try{
                    updateTransactionStatus(request.getRazorpay_orderId(),"ERROR",request.getRazorpay_paymentId(),null);

                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
                return PaymentDTO.builder()
                        .success(false)
                        .message("Error verifying payment: "+e.getMessage())
                        .build();
        }
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findAll().stream()
                .filter(t ->t.getOrderId()!=null && t.getOrderId().equals(razorpayOrderId))
                .findFirst()
                .map(transaction -> {
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if(creditsToAdd!=null){
                        transaction.setCreditsAdded(creditsToAdd);
                    }
                    return paymentTransactionRepository.save(transaction);
                })
                .orElse(null);
    }

    private String generateHmacSha256Signature(String data, String razorpaySecretKey) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(razorpaySecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC SHA-256 signature", e);
        }
    }


}

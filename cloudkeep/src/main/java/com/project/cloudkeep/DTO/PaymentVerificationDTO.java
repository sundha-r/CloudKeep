package com.project.cloudkeep.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentVerificationDTO {
    private String razorpay_orderId;
    private String razorpay_paymentId;
    private String razorpay_signature;
    private String planId;
}

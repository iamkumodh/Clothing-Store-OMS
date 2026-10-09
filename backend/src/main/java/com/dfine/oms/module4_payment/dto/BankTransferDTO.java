package com.dfine.oms.module4_payment.dto;



public class BankTransferDTO {

    private Integer paymentId;
    private String bankName;
    private String depositReference;
    private String slipImageUrl;

    public BankTransferDTO() {
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getDepositReference() {
        return depositReference;
    }

    public void setDepositReference(String depositReference) {
        this.depositReference = depositReference;
    }

    public String getSlipImageUrl() {
        return slipImageUrl;
    }

    public void setSlipImageUrl(String slipImageUrl) {
        this.slipImageUrl = slipImageUrl;
    }
}

package sa.edu.fbsu.campus.wallet.domain;

public enum TransactionType {
    TOP_UP,
    TUITION_PAYMENT,
    PEER_TRANSFER,
    PARKING_FEE,
    REFUND,
    /** Flex-Share cashback credited to the member who shared a bay */
    PARKING_REWARD,
    CAMPUS_PURCHASE
}

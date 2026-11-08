package sa.edu.fbsu.campus.notifications.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import sa.edu.fbsu.campus.common.events.*;
import sa.edu.fbsu.campus.notifications.domain.NotificationType;
import sa.edu.fbsu.campus.notifications.dto.CreateNotificationCommand;

import java.math.BigDecimal;
import java.util.Objects;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onParkingBookingEvent(ParkingBookingEvent event) {
        if (event == null || event.recipientUserId() == null) return;

        boolean isBooked = "BOOKED".equalsIgnoreCase(event.action());
        String titleAr = isBooked ? "تأكيد حجز موقف مسبق" : "إلغاء حجز الموقف";
        String titleEn = isBooked ? "Parking Bay Reserved" : "Parking Booking Cancelled";
        String msgAr = isBooked
                ? String.format("تم تأكيد حجز الموقف %s بنجاح للفترة (%s - %s).", event.bayCode(), event.startLabel(), event.endLabel())
                : String.format("تم إلغاء حجز الموقف %s واستعادة الرصيد للمحفظة.", event.bayCode());
        String msgEn = isBooked
                ? String.format("Parking bay %s confirmed for time window (%s - %s).", event.bayCode(), event.startLabel(), event.endLabel())
                : String.format("Parking bay %s booking was cancelled and balance refunded.", event.bayCode());

        notificationService.createNotification(new CreateNotificationCommand(
                event.recipientUserId(),
                event.universityId(),
                "إدارة المواقف الذكية",
                "Smart Parking System",
                titleAr,
                titleEn,
                msgAr,
                msgEn,
                NotificationType.PARKING,
                "موقف",
                "Parking",
                "/parking/booking"
        ));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onGateAccessEvent(GateAccessEvent event) {
        if (event == null || event.recipientUserId() == null) return;

        String titleAr = event.isEntry() ? "دخول مصرح عبر البوابة" : "خروج مصرح عبر البوابة";
        String titleEn = event.isEntry() ? "Authorized Gate Entry" : "Authorized Gate Exit";
        String msgAr = String.format("تم التحقق من لوحة مركبتك (%s) وفتح %s بنجاح.", event.plateText(), event.gateNameAr());
        String msgEn = String.format("Vehicle plate (%s) verified and access granted at %s.", event.plateText(), event.gateNameEn());

        notificationService.createNotification(new CreateNotificationCommand(
                event.recipientUserId(),
                event.universityId(),
                event.gateNameAr(),
                event.gateNameEn(),
                titleAr,
                titleEn,
                msgAr,
                msgEn,
                NotificationType.GATE,
                "بوابة",
                "Gate",
                "/parking/gate"
        ));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onWalletTransactionEvent(WalletTransactionEvent event) {
        if (event == null || event.recipientUserId() == null) return;

        BigDecimal amount = event.amount() != null ? event.amount() : BigDecimal.ZERO;
        String type = event.type() != null ? event.type() : "TRANSACTION";

        String titleAr;
        String titleEn;
        String msgAr;
        String msgEn;
        String badgeAr = "محفظة";
        String badgeEn = "Wallet";

        switch (type) {
            case "TOP_UP" -> {
                titleAr = "شحن رصيد المحفظة الجامعية";
                titleEn = "Wallet Balance Top-Up";
                msgAr = String.format("تم إيداع مبلغ %s ر.س بنجاح في محفظتك الرقمية.", amount);
                msgEn = String.format("SAR %s successfully deposited into your campus digital wallet.", amount);
            }
            case "TRANSFER_IN" -> {
                titleAr = "استلام حوالة مالية جامعية";
                titleEn = "P2P Transfer Received";
                msgAr = String.format("تم استلام مبلغ %s ر.س في محفظتك من %s.", amount, Objects.toString(event.reference(), "طالب آخر"));
                msgEn = String.format("Received SAR %s in your wallet from %s.", amount, Objects.toString(event.reference(), "peer"));
            }
            case "TRANSFER_OUT" -> {
                titleAr = "إرسال حوالة مالية جامعية";
                titleEn = "P2P Transfer Sent";
                msgAr = String.format("تم تحويل مبلغ %s ر.س بنجاح إلى %s.", amount, Objects.toString(event.reference(), "المستلم"));
                msgEn = String.format("Sent SAR %s to %s successfully.", amount, Objects.toString(event.reference(), "recipient"));
            }
            case "TUITION_PAYMENT" -> {
                titleAr = "سداد دفعة مصاريف دراسية";
                titleEn = "Tuition Fee Settlement";
                badgeAr = "مصاريف";
                badgeEn = "Tuition";
                msgAr = String.format("تم سداد مبلغ %s ر.س للفاتورة رقم %s بنجاح.", amount, Objects.toString(event.reference(), "N/A"));
                msgEn = String.format("Paid SAR %s for tuition invoice %s successfully.", amount, Objects.toString(event.reference(), "N/A"));
            }
            case "FLEX_REWARD" -> {
                titleAr = "مكافأة مشاركة الموقف (Flex Share)";
                titleEn = "Flex Share Reward Credited";
                badgeAr = "مكافأة";
                badgeEn = "Reward";
                msgAr = String.format("تم استلام %s ر.س مكافأة لمشاركة موقفك مع زملائك اليوم.", amount);
                msgEn = String.format("Received SAR %s reward for sharing your parking spot today.", amount);
            }
            default -> {
                titleAr = "حركة مالية بالمحفظة";
                titleEn = "Wallet Activity";
                msgAr = String.format("تم تنفيذ حركة مالية بمبلغ %s ر.س في حسابك.", amount);
                msgEn = String.format("Transaction of SAR %s executed on your wallet.", amount);
            }
        }

        notificationService.createNotification(new CreateNotificationCommand(
                event.recipientUserId(),
                event.universityId(),
                "المحفظة الرقمية الجامعية",
                "Campus Digital Wallet",
                titleAr,
                titleEn,
                msgAr,
                msgEn,
                NotificationType.WALLET,
                badgeAr,
                badgeEn,
                "/wallet"
        ));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onTutoringBookingEvent(TutoringBookingEvent event) {
        if (event == null) return;

        // 1. Notification for student
        if (event.studentId() != null) {
            notificationService.createNotification(new CreateNotificationCommand(
                    event.studentId(),
                    event.universityId(),
                    "دعم الأقران الأكاديمي",
                    "Peer Tutoring Support",
                    "تأكيد حجز جلسة تعليم أقران",
                    "Tutoring Booking Confirmed",
                    String.format("تم تأكيد حجزك لمقرر %s (%s) مع المعلم %s.", event.courseCode(), event.courseNameAr(), event.tutorName()),
                    String.format("Confirmed tutoring session for %s with tutor %s.", event.courseCode(), event.tutorName()),
                    NotificationType.TUTORING,
                    "دروس",
                    "Tutoring",
                    "/campus/tutoring"
            ));
        }

        // 2. Notification for tutor
        if (event.tutorId() != null) {
            notificationService.createNotification(new CreateNotificationCommand(
                    event.tutorId(),
                    event.universityId(),
                    "دعم الأقران الأكاديمي",
                    "Peer Tutoring Support",
                    "حجز جلسة جديدة من طالب",
                    "New Student Enrolled in Session",
                    String.format("قام الطالب %s بحجز مقعد في جلستك لمقرر %s وتم إيداع أتعاب الجلسة في محفظتك.", event.studentName(), event.courseCode()),
                    String.format("Student %s enrolled in your session for %s. Tutoring fee credited to wallet.", event.studentName(), event.courseCode()),
                    NotificationType.TUTORING,
                    "دروس",
                    "Tutoring",
                    "/campus/tutoring"
            ));
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onOfficeHoursBookingEvent(OfficeHoursBookingEvent event) {
        if (event == null || event.studentId() == null) return;

        boolean isBooked = !"CANCELLED".equalsIgnoreCase(event.action());
        String titleAr = isBooked ? "تأكيد موعد الساعات المكتبية" : "إلغاء موعد الساعات المكتبية";
        String titleEn = isBooked ? "Office Hours Appointment Confirmed" : "Office Hours Appointment Cancelled";
        String msgAr = isBooked
                ? String.format("تم حجز موعد استشارة أكاديمية مع %s في توقيت %s.", event.facultyNameAr(), event.slotTime())
                : String.format("تم إلغاء موعدك الأكاديمي مع %s.", event.facultyNameAr());
        String msgEn = isBooked
                ? String.format("Confirmed academic consultation with %s at %s.", event.facultyNameEn(), event.slotTime())
                : String.format("Your appointment with %s was cancelled.", event.facultyNameEn());

        notificationService.createNotification(new CreateNotificationCommand(
                event.studentId(),
                event.universityId(),
                "الساعات المكتبية لأعضاء التدريس",
                "Faculty Office Hours",
                titleAr,
                titleEn,
                msgAr,
                msgEn,
                NotificationType.OFFICE_HOURS,
                "ساعات مكتبية",
                "Office Hours",
                "/campus/office-hours"
        ));
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onStudyRoomBookingEvent(StudyRoomBookingEvent event) {
        if (event == null || event.recipientUserId() == null) return;

        String action = event.action() != null ? event.action().toUpperCase() : "BOOKED";
        String titleAr;
        String titleEn;
        String msgAr;
        String msgEn;

        switch (action) {
            case "EXTENDED" -> {
                titleAr = "تمديد جلسة القاعة / المعمل";
                titleEn = "Room Reservation Extended";
                msgAr = String.format("تم تمديد وقت حجز %s (%s) بمقدار 10 دقائق إضافية.", event.roomCode(), event.roomNameAr());
                msgEn = String.format("Added +10 minutes extension for study pod %s.", event.roomCode());
            }
            case "RELEASED" -> {
                titleAr = "إنهاء جلسة القاعة مبكراً";
                titleEn = "Study Pod Released Early";
                msgAr = String.format("تم إخلاء %s (%s) وإتاحتها فوراً للطلاب الآخرين.", event.roomCode(), event.roomNameAr());
                msgEn = String.format("Room %s was released early and made available.", event.roomCode());
            }
            default -> {
                titleAr = "بدء جلسة المعمل أو القاعة الدراسية";
                titleEn = "Study Pod Reservation Active";
                msgAr = String.format("بدأت جلستك في %s (%s) للفترة %s. يرجى الالتزام بموعد الإخلاء.", event.roomCode(), event.roomNameAr(), Objects.toString(event.timeWindow(), "المحددة"));
                msgEn = String.format("Reservation active for %s (%s) during window %s.", event.roomCode(), event.roomNameEn(), Objects.toString(event.timeWindow(), "window"));
            }
        }

        notificationService.createNotification(new CreateNotificationCommand(
                event.recipientUserId(),
                event.universityId(),
                "المعامل والقاعات الدراسية",
                "Study Pods & Rooms",
                titleAr,
                titleEn,
                msgAr,
                msgEn,
                NotificationType.ROOM,
                "قاعة",
                "Room",
                "/campus/rooms"
        ));
    }
}

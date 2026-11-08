package sa.edu.fbsu.campus.notifications.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.common.events.*;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.notifications.domain.CampusNotification;
import sa.edu.fbsu.campus.notifications.domain.NotificationType;
import sa.edu.fbsu.campus.notifications.infra.NotificationRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
class NotificationEventsIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletService walletService;

    @Test
    @DisplayName("TopUp wallet operation publishes event and generates in-app notification")
    void shouldGenerateNotificationOnWalletTopUp() {
        User student = userRepository.findByEmail("rakan.mutairi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Seeded user rakan not found"));

        long beforeCount = notificationRepository.countUnreadByRecipientId(student.getId());

        String key = "NOTIF-TEST-TOPUP-" + UUID.randomUUID();
        walletService.topUp(student.getId(), new TopUpRequest(
                new BigDecimal("50.00"),
                "MADA",
                key,
                "Test notification top-up"
        ));

        List<CampusNotification> list = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        assertThat(list).isNotEmpty();
        assertThat(notificationRepository.countUnreadByRecipientId(student.getId())).isGreaterThanOrEqualTo(beforeCount);

        CampusNotification latest = list.stream()
                .filter(n -> n.getType() == NotificationType.WALLET && n.getTitleEn().contains("Top-Up"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Wallet top-up notification not found"));

        assertThat(latest.getType()).isEqualTo(NotificationType.WALLET);
        assertThat(latest.getTitleAr()).contains("شحن رصيد");
        assertThat(latest.getTitleEn()).contains("Top-Up");
        assertThat(latest.getMessageAr()).contains("50.00");
    }

    @Test
    @DisplayName("ParkingBookingEvent creates bilingual parking notification")
    void shouldHandleParkingBookingEvent() {
        User student = userRepository.findByEmail("eyad.harbi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Seeded user eyad not found"));

        eventPublisher.publishEvent(new ParkingBookingEvent(
                student.getId(),
                student.getUniversityId(),
                "A-12",
                "BOOKED",
                "09:00",
                "11:00"
        ));

        List<CampusNotification> list = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        CampusNotification latest = list.stream()
                .filter(n -> n.getType() == NotificationType.PARKING && n.getMessageAr().contains("A-12"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Parking notification not found"));

        assertThat(latest.getTitleAr()).contains("تأكيد حجز موقف");
        assertThat(latest.getTitleEn()).contains("Parking Bay Reserved");
        assertThat(latest.getTargetRoute()).isEqualTo("/parking/booking");
    }

    @Test
    @DisplayName("GateAccessEvent creates bilingual gate notification")
    void shouldHandleGateAccessEvent() {
        User student = userRepository.findByEmail("eyad.harbi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Seeded user eyad not found"));

        eventPublisher.publishEvent(new GateAccessEvent(
                student.getId(),
                student.getUniversityId(),
                "أ ب ج 1234",
                "البوابة الشمالية الرئيسية",
                "Main North Gate",
                true
        ));

        List<CampusNotification> list = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        CampusNotification latest = list.stream()
                .filter(n -> n.getType() == NotificationType.GATE)
                .findFirst()
                .orElseThrow(() -> new AssertionError("Gate notification not found"));

        assertThat(latest.getTitleAr()).contains("دخول مصرح");
        assertThat(latest.getTitleEn()).contains("Authorized Gate Entry");
        assertThat(latest.getTargetRoute()).isEqualTo("/parking/gate");
    }

    @Test
    @DisplayName("TutoringBookingEvent creates notifications for both student and tutor")
    void shouldHandleTutoringBookingEvent() {
        User student = userRepository.findByEmail("rakan.mutairi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        User tutor = userRepository.findByEmail("eyad.harbi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Tutor not found"));

        eventPublisher.publishEvent(new TutoringBookingEvent(
                student.getId(),
                tutor.getId(),
                student.getUniversityId(),
                "CS-201",
                "تراكيب البيانات والخوارزميات",
                "Data Structures & Algorithms",
                student.getFullNameAr(),
                tutor.getFullNameAr()
        ));

        List<CampusNotification> studentNotifs = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        assertThat(studentNotifs.stream().anyMatch(n -> n.getType() == NotificationType.TUTORING && n.getTitleEn().contains("Tutoring Booking Confirmed"))).isTrue();

        List<CampusNotification> tutorNotifs = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(tutor.getId());
        assertThat(tutorNotifs.stream().anyMatch(n -> n.getType() == NotificationType.TUTORING && n.getTitleEn().contains("New Student Enrolled"))).isTrue();
    }

    @Test
    @DisplayName("StudyRoomBookingEvent creates room reservation notification")
    void shouldHandleStudyRoomBookingEvent() {
        User student = userRepository.findByEmail("rakan.mutairi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Student not found"));

        eventPublisher.publishEvent(new StudyRoomBookingEvent(
                student.getId(),
                student.getUniversityId(),
                "POD-01",
                "كبسولة الابتكار الهادئة",
                "Quiet Innovation Pod",
                "BOOKED",
                "10:00 - 11:00"
        ));

        List<CampusNotification> list = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        CampusNotification latest = list.stream()
                .filter(n -> n.getType() == NotificationType.ROOM && n.getMessageAr().contains("POD-01"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Room notification not found"));

        assertThat(latest.getTitleEn()).contains("Study Pod Reservation Active");
        assertThat(latest.getTargetRoute()).isEqualTo("/campus/rooms");
    }

    @Test
    @DisplayName("OfficeHoursBookingEvent creates faculty appointment notification")
    void shouldHandleOfficeHoursBookingEvent() {
        User student = userRepository.findByEmail("rakan.mutairi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        User faculty = userRepository.findByEmail("fahad.atwi@fbsu.edu.sa")
                .orElseThrow(() -> new IllegalStateException("Faculty not found"));

        eventPublisher.publishEvent(new OfficeHoursBookingEvent(
                student.getId(),
                faculty.getId(),
                student.getUniversityId(),
                faculty.getFullNameAr(),
                faculty.getFullNameEn(),
                student.getFullNameAr(),
                "10:00 AM",
                "BOOKED"
        ));

        List<CampusNotification> list = notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(student.getId());
        CampusNotification latest = list.stream()
                .filter(n -> n.getType() == NotificationType.OFFICE_HOURS)
                .findFirst()
                .orElseThrow(() -> new AssertionError("Office hours notification not found"));

        assertThat(latest.getTitleAr()).contains("تأكيد موعد الساعات المكتبية");
        assertThat(latest.getTitleEn()).contains("Office Hours Appointment Confirmed");
        assertThat(latest.getTargetRoute()).isEqualTo("/campus/office-hours");
    }
}

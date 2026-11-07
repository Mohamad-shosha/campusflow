package sa.edu.fbsu.campus.common.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.notifications.domain.CampusNotification;
import sa.edu.fbsu.campus.notifications.domain.NotificationType;
import sa.edu.fbsu.campus.notifications.infra.NotificationRepository;

import java.util.Optional;

@Component
@Profile("dev")
@Order(5)
public class NotificationsDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(NotificationsDataSeeder.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationsDataSeeder(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("--- [NotificationsDataSeeder] Checking and initializing dev in-app notifications ---");

        seedForUser("eyad.harbi@fbsu.edu.sa", true);
        seedForUser("rakan.mutairi@fbsu.edu.sa", false);
    }

    private void seedForUser(String email, boolean isEyad) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("User {} not found, skipping notification seeding", email);
            return;
        }

        User recipient = userOpt.get();
        if (notificationRepository.countUnreadByRecipientId(recipient.getId()) > 0) {
            log.info("Notifications already exist for {}, skipping seeding", email);
            return;
        }

        if (isEyad) {
            create(recipient,
                    "بوابة الدخول الرئيسية (شمال)", "Main North Gate",
                    "دخول مصرح عبر البوابة الذكية", "Smart Gate Authorized Entry",
                    "تم فتح البوابة الشمالية لدخول مركبتك ك ح ط 1 2 3 4 بنجاح.",
                    "Gate 1 - North Access opened for plate 1234 BTH.",
                    NotificationType.GATE, "بوابة", "Gate", "/parking/gate");

            create(recipient,
                    "المحفظة الرقمية الجامعية", "Campus Digital Wallet",
                    "شحن رصيد المحفظة الجامعية", "Wallet Balance Top-Up",
                    "تم إيداع 150 ر.س بنجاح في محفظتك الجامعية عبر بطاقة مدى.",
                    "SAR 150.00 topped up into your campus digital wallet via Mada.",
                    NotificationType.WALLET, "محفظة", "Wallet", "/wallet");

            create(recipient,
                    "دعم الأقران الأكاديمي", "Peer Tutoring Support",
                    "تأكيد حجز جلسة تعليم أقران", "Peer Tutoring Booking Confirmed",
                    "تم تأكيد جلسة مراجعة خوارزميات CS-201 مع الطالب أحمد العطوي.",
                    "Tutoring session confirmed for CS-201 with Ahmed Al-Atwi.",
                    NotificationType.TUTORING, "دروس", "Tutoring", "/campus/tutoring");

            create(recipient,
                    "إدارة المواقف الذكية", "Smart Parking System",
                    "تأكيد حجز موقف مسبق", "Parking Bay Reserved",
                    "تم تأكيد حجز الموقف B-12 في المواقع الذكية لمدة ساعتين.",
                    "Parking bay B-12 confirmed for 2 hours.",
                    NotificationType.PARKING, "موقف", "Parking", "/parking/booking");

            create(recipient,
                    "المعامل والقاعات الدراسية", "Study Pods & Rooms",
                    "جلسة المعمل الجماعي نشطة", "Active Study Pod Session",
                    "بدء جلسة المعمل الجماعي LAB-102، ينتهي الحجز خلال 45 دقيقة.",
                    "Study pod LAB-102 session active, finishes in 45m.",
                    NotificationType.ROOM, "قاعة", "Room", "/campus/rooms");
        } else {
            create(recipient,
                    "المحفظة الرقمية الجامعية", "Campus Digital Wallet",
                    "مكافأة مشاركة الموقف (Flex Share)", "Flex Share Reward Credited",
                    "تم استلام 50 ر.س رصيد مكافأة لمشاركة موقفك اليوم بنجاح.",
                    "SAR 50.00 reward received for sharing your spot today via Flex Share.",
                    NotificationType.WALLET, "مكافأة", "Reward", "/wallet");

            create(recipient,
                    "الساعات المكتبية لأعضاء التدريس", "Faculty Office Hours",
                    "تأكيد موعد استشارة أكاديمية", "Academic Advising Confirmed",
                    "تم تأكيد موعد مناقشة مشروع التخرج مع د. رغد النفيعي غداً الساعة 10:00 صباحاً.",
                    "Confirmed appointment with Dr. Raghad Al-Nefaie tomorrow at 10:00 AM.",
                    NotificationType.OFFICE_HOURS, "ساعات مكتبية", "Office Hours", "/campus/office-hours");
        }

        log.info("Seeded initial notifications for user {}", email);
    }

    private void create(User recipient,
                        String senderAr, String senderEn,
                        String titleAr, String titleEn,
                        String msgAr, String msgEn,
                        NotificationType type,
                        String badgeAr, String badgeEn,
                        String targetRoute) {
        CampusNotification n = new CampusNotification(
                recipient,
                senderAr, senderEn,
                titleAr, titleEn,
                msgAr, msgEn,
                type,
                badgeAr, badgeEn,
                targetRoute
        );
        n.setUniversityId(recipient.getUniversityId());
        notificationRepository.save(n);
    }
}

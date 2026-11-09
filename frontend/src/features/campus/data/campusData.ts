export interface TutoringSession {
  id: string;
  backendId?: string | undefined;
  tutorId: string;
  tutorName: string;
  tutorNameEn?: string | undefined;
  tutorRole: string;
  tutorRoleEn?: string | undefined;
  tutorAvatarColor: string;
  courseCode: string;
  courseName: string;
  courseNameEn: string;
  coveredLectures: string;
  coveredScope: string;
  hourlyRate: number;
  durationHours: number;
  totalPrice: number;
  dateTime: string;
  location: string;
  category: string;
  rating: number;
  reviewsCount: number;
  status: 'open' | 'booked' | 'completed';
  enrolledStudents: string[];
  enrolledStudentNumbers?: string[] | undefined;
  maxCapacity?: number | undefined;
  enrolledCount?: number | undefined;
}

export interface TimeSlot {
  id?: string | undefined;
  time: string;
  timeEn?: string | undefined;
  duration: string;
  durationEn?: string | undefined;
  available: boolean;
  bookedNote?: string | undefined;
}

export interface FacultyMember {
  id: string;
  backendId?: string | undefined;
  facultyUserId?: string | undefined;
  universityNumber?: string | undefined;
  name: string;
  nameEn: string;
  rank: string;
  rankEn: string;
  college: string;
  collegeEn?: string | undefined;
  office: string;
  email: string;
  badge: string;
  badgeEn?: string | undefined;
  avatarColor: string;
  daysText: string;
  daysTextEn?: string | undefined;
  nextAvailable: string;
  nextAvailableEn?: string | undefined;
  coursesSupervised: string[];
  timeSlots: TimeSlot[];
}

export interface StudyRoom {
  id: string;
  backendId?: string | undefined;
  roomCode?: string | undefined;
  name: string;
  nameEn: string;
  building: string;
  buildingEn?: string | undefined;
  capacity: string;
  capacityEn?: string | undefined;
  typeBadge: string;
  typeBadgeEn?: string | undefined;
  status: 'in-use' | 'available' | 'maintenance' | 'reserved';
  activeBooking?:
    | {
        bookingId?: string | undefined;
        leaderUserId?: string | undefined;
        teamLead: string;
        teamLeadEn?: string | undefined;
        teamMembers?: string[];
        purpose: string;
        endsAt?: string | undefined;
        startTime?: string | undefined;
        endTime?: string | undefined;
        timeSlot?: string | undefined;
        startLabel?: string | undefined;
        endLabel?: string | undefined;
        totalMinutes?: number | undefined;
        remainingMinutes?: number | undefined;
        extendedCount?: number | undefined;
        status?: string | undefined;
      }
    | undefined;
  specs?: string[] | undefined;
  specsEn?: string[] | undefined;
  availableFrom?: string | undefined;
  availableFromEn?: string | undefined;
  utilizationPercent?: number | undefined;
  scheduleSlots?:
    | {
        time: string;
        timeEn?: string | undefined;
        status: 'booked' | 'available';
        label?: string | undefined;
      }[]
    | undefined;
  requirementNote?: string | undefined;
  requirementNoteEn?: string | undefined;
}

export interface CampusNotification {
  id: string;
  target?: string;
  targetName?: string;
  sender: string;
  title: string;
  titleEn?: string;
  message: string;
  desc?: string;
  descEn?: string;
  time: string;
  type?: 'gate' | 'wallet' | 'tutoring' | 'parking';
  unread?: boolean;
  read?: boolean;
  icon?: string;
  badge?: string;
}

export const INITIAL_TUTORING_SESSIONS: TutoringSession[] = [
  {
    id: 'TUT-101',
    tutorId: 'eyad',
    tutorName: 'إياد الحربي',
    tutorNameEn: 'Eyad Al-Harbi',
    tutorRole: 'طالب متميز - كلية الهندسة',
    tutorRoleEn: 'Honor Student - College of Engineering',
    tutorAvatarColor: '#116E63',
    courseCode: 'MATH 101 / MATH 201',
    courseName: 'حساب التفاضل والتكامل والرياضيات الهندسية',
    courseNameEn: 'Calculus & Engineering Mathematics',
    coveredLectures: 'المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)',
    coveredScope:
      'شرح مبسط لمفاهيم النهايات والاشتقاق، وحل أسئلة الواجبات ونماذج الاختبارات السابقة حتى نهاية الشابتر.',
    hourlyRate: 70,
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'اليوم الأحد - 04:30 م',
    location: 'قاعة المذاكرة الذكية A-04 (مبنى الهندسة)',
    category: 'math',
    rating: 4.96,
    reviewsCount: 28,
    status: 'open',
    enrolledStudents: ['راكان المطيري'],
    maxCapacity: 10,
  },
  {
    id: 'TUT-102',
    tutorId: 'rakan',
    tutorName: 'راكان المطيري',
    tutorNameEn: 'Rakan Al-Mutairi',
    tutorRole: 'طالب متميز - كلية الحاسب الآلي',
    tutorRoleEn: 'Honor Student - College of Computing',
    tutorAvatarColor: '#d7a237',
    courseCode: 'CS 110 / CS 210',
    courseName: 'مبادئ البرمجة وهياكل البيانات (Python & C++)',
    courseNameEn: 'Programming Fundamentals & Data Structures (Python & C++)',
    coveredLectures: 'الشابتر الأول والثاني كاملاً (Chapters 1 & 2)',
    coveredScope:
      'كتابة الأكواد العملية، خوارزميات الترتيب والبحث، وحل أسئلة الكلاس وورك والتكليف الأسبوعي.',
    hourlyRate: 70,
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'غداً الاثنين - 02:00 م',
    location: 'معمل الحاسب 102 (Computer Lab 102)',
    category: 'programming',
    rating: 4.92,
    reviewsCount: 19,
    status: 'open',
    enrolledStudents: ['طالب 1'],
    maxCapacity: 10,
  },
  {
    id: 'TUT-103',
    tutorId: 'fatima',
    tutorName: 'فاطمة بنت ناصر العنزي',
    tutorNameEn: 'Fatima Nasser Al-Anazi',
    tutorRole: 'طالبة متميزة - علوم الحاسب',
    tutorRoleEn: 'Honor Student - Computer Science',
    tutorAvatarColor: '#ec4899',
    courseCode: 'CEN 220',
    courseName: 'التصميم المنطقي الرقمي (Digital Logic Design)',
    courseNameEn: 'Digital Logic Design',
    coveredLectures: 'المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)',
    coveredScope:
      'شرح خرائط كارنوف (K-Maps)، تبسيط الدوائر المنطقية، وبوابات NAND/NOR والتطبيق على حقائب المعمل.',
    hourlyRate: 70,
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'الثلاثاء - 01:15 م',
    location: 'معمل التصميم المنطقي Lab 205',
    category: 'hardware',
    rating: 4.98,
    reviewsCount: 15,
    status: 'open',
    enrolledStudents: ['طالب 1'],
    maxCapacity: 10,
  },
  {
    id: 'TUT-104',
    tutorId: 'eyad',
    tutorName: 'إياد الحربي',
    tutorNameEn: 'Eyad Al-Harbi',
    tutorRole: 'طالب متميز - كلية الهندسة',
    tutorRoleEn: 'Honor Student - College of Engineering',
    tutorAvatarColor: '#116E63',
    courseCode: 'PHYS 101',
    courseName: 'الفيزياء العامة (الميكانيكا والديناميكا)',
    courseNameEn: 'General Physics I (Mechanics & Dynamics)',
    coveredLectures: 'مراجعة الميدتيرم الشاملة (المحاضرة 1 حتى 5)',
    coveredScope: 'قوانين نيوتن للحركة وحفظ الطاقة الميكانيكية وتطبيقات المسائل الهندسية المعقدة.',
    hourlyRate: 70,
    durationHours: 1.5,
    totalPrice: 105,
    dateTime: 'الأربعاء - 05:00 م',
    location: 'قاعة المذاكرة B-12',
    category: 'math',
    rating: 4.95,
    reviewsCount: 31,
    status: 'open',
    enrolledStudents: [],
    maxCapacity: 10,
  },
  {
    id: 'TUT-105',
    tutorId: 'tutor_fahad',
    tutorName: 'فهد الأحمدي',
    tutorNameEn: 'Fahad Al-Ahmadi',
    tutorRole: 'مرشح ماجستير - علم البيانات والذكاء الاصطناعي',
    tutorRoleEn: 'M.Sc. Candidate in Data Science & AI',
    tutorAvatarColor: '#0ea5e9',
    courseCode: 'AI 301',
    courseName: 'مقدمة في تعلّم الآلة والرؤية الحاسوبية (Machine Learning)',
    courseNameEn: 'Introduction to Machine Learning & Computer Vision',
    coveredLectures: 'خوارزميات الانحدار الخطي وشبكات الأعصاب الاصطناعية (Neural Networks)',
    coveredScope:
      'تطبيق عملي بمكتبات PyTorch و Scikit-Learn لمعالجة البيانات وتدريب نماذج الرؤية الحاسوبية.',
    hourlyRate: 85,
    durationHours: 2,
    totalPrice: 170,
    dateTime: 'الخميس - 03:00 م',
    location: 'معمل الحوسبة الفائقة Lab 101',
    category: 'programming',
    rating: 5.0,
    reviewsCount: 22,
    status: 'open',
    enrolledStudents: ['سلطان القحطاني'],
    maxCapacity: 10,
  },
  {
    id: 'TUT-106',
    tutorId: 'tutor_mona',
    tutorName: 'منى العطوي',
    tutorNameEn: 'Mona Al-Atwi',
    tutorRole: 'طالبة شرف - نظم المعلومات الإدارية والمحاسبة',
    tutorRoleEn: 'Honor Student - MIS & Accounting',
    tutorAvatarColor: '#8b5cf6',
    courseCode: 'ACC 101',
    courseName: 'مبادئ المحاسبة والتحليل المالي للشركات',
    courseNameEn: 'Principles of Financial Accounting',
    coveredLectures: 'إعداد القوائم المالية، قيود اليومية، وميزان المراجعة (Financial Statements)',
    coveredScope:
      'شرح موازنة التدفقات النقدية وتحليل القوائم المالية باستخدام Excel للمشاريع الاستثمارية.',
    hourlyRate: 65,
    durationHours: 1,
    totalPrice: 65,
    dateTime: 'الأحد - 06:00 م',
    location: 'قاعة كلية إدارة الأعمال B-04',
    category: 'business',
    rating: 4.91,
    reviewsCount: 17,
    status: 'open',
    enrolledStudents: [],
  },
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'drMezher',
    name: 'د. محمد مزهر',
    nameEn: 'Dr. Mohammed Mezher',
    rank: 'عميد كلية الهندسة وتقنية المعلومات',
    rankEn: 'Dean - College of Engineering & Computing',
    college: 'كلية الهندسة والحاسب الآلي',
    collegeEn: 'College of Engineering & Computing',
    office: 'مكتب عميد الكلية - المبنى الإداري الرئيسي 201',
    email: 'm.mezher@fbsu.edu.sa',
    badge: 'عميد الكلية',
    badgeEn: 'Dean',
    avatarColor: '#0d9488',
    daysText: 'الاثنين والأربعاء (01:00 م - 03:00 م)',
    daysTextEn: 'Mon & Wed (01:00 PM - 03:00 PM)',
    nextAvailable: 'غداً الاثنين: 01:15 م',
    nextAvailableEn: 'Tomorrow Mon: 01:15 PM',
    coursesSupervised: [
      'هندسة النظم المتقدمة ومعمارية السحاب',
      'الإشراف الأكاديمي والخطط الاستراتيجية للكلية',
      'مناقشات مشاريع التخرج للمتفوقين والاعتماد الدولي ABET',
    ],
    timeSlots: [
      {
        time: '01:00 م',
        timeEn: '01:00 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
      {
        time: '01:20 م',
        timeEn: '01:20 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
      {
        time: '01:40 م',
        timeEn: '01:40 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: false,
        bookedNote: 'محجوز - مناقشة اعتماد ABET',
      },
      {
        time: '02:00 م',
        timeEn: '02:00 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
    ],
  },
  {
    id: 'drRaghad',
    name: 'د. رغد النفيعي',
    nameEn: 'Dr. Raghad Al-Nefaie',
    rank: 'رئيسة قسم علوم وهندسة الحاسب الآلي',
    rankEn: 'Chairperson - Computer Science & Engineering',
    college: 'كلية الحاسب الآلي',
    collegeEn: 'College of Computing',
    office: 'مكتب رئيسة القسم - مبنى الحاسب C-105',
    email: 'r.alnefaie@fbsu.edu.sa',
    badge: 'رئيسة القسم',
    badgeEn: 'Dept Chair',
    avatarColor: '#116E63',
    daysText: 'الأحد والثلاثاء (10:00 ص - 12:30 م)',
    daysTextEn: 'Sun & Tue (10:00 AM - 12:30 PM)',
    nextAvailable: 'اليوم الأحد: 11:15 ص',
    nextAvailableEn: 'Today Sun: 11:15 AM',
    coursesSupervised: [
      'التصميم المنطقي الرقمي (Digital Logic Design)',
      'معمارية الحاسبات والأنظمة المدمجة',
      'الإشراف على مشاريع التخرج والبحث العلمي',
      'الإرشاد الأكاديمي ومعادلة المقررات للطلاب المستجدين',
    ],
    timeSlots: [
      {
        time: '11:00 ص',
        timeEn: '11:00 AM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
      {
        time: '11:15 ص',
        timeEn: '11:15 AM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
      {
        time: '11:30 ص',
        timeEn: '11:30 AM',
        duration: '30 دقيقة',
        durationEn: '30 mins',
        available: false,
        bookedNote: 'محجوز - مناقشة مشروع تخرج الحرم الذكي',
      },
      {
        time: '12:00 م',
        timeEn: '12:00 PM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
    ],
  },
  {
    id: 'drGhamdi',
    name: 'أ.د. عبد الله الغامدي',
    nameEn: 'Prof. Dr. Abdullah Al-Ghamdi',
    rank: 'أستاذ الذكاء الاصطناعي ومدير مركز أبحاث النظم الذكية',
    rankEn: 'Professor of AI & Director of Intelligent Systems Research Center',
    college: 'كلية الهندسة والحاسب',
    collegeEn: 'College of Engineering & Computing',
    office: 'مكتب أستاذ الكرسي - برج الأبحاث 402',
    email: 'a.alghamdi@fbsu.edu.sa',
    badge: 'أستاذ كرسي أبحاث',
    badgeEn: 'Chaired Professor',
    avatarColor: '#1e3a8a',
    daysText: 'الأحد والأربعاء (09:00 ص - 11:30 ص)',
    daysTextEn: 'Sun & Wed (09:00 AM - 11:30 AM)',
    nextAvailable: 'الأربعاء القادم: 09:30 ص',
    nextAvailableEn: 'Next Wed: 09:30 AM',
    coursesSupervised: [
      'تعلّم الآلة المتقدم والرؤية الحاسوبية (Deep Learning)',
      'تطبيقات الذكاء الاصطناعي في المدن الذكية ومواقف السيارات',
      'الإشراف على أطروحات الماجستير والأبحاث المنشورة في Scopus',
    ],
    timeSlots: [
      {
        time: '09:00 ص',
        timeEn: '09:00 AM',
        duration: '30 دقيقة',
        durationEn: '30 mins',
        available: true,
      },
      {
        time: '09:30 ص',
        timeEn: '09:30 AM',
        duration: '30 دقيقة',
        durationEn: '30 mins',
        available: true,
      },
      {
        time: '10:00 ص',
        timeEn: '10:00 AM',
        duration: '30 دقيقة',
        durationEn: '30 mins',
        available: false,
        bookedNote: 'محجوز - إشراف رسالة ماجستير',
      },
    ],
  },
  {
    id: 'drReem',
    name: 'د. ريم العمراني',
    nameEn: 'Dr. Reem Al-Amrani',
    rank: 'أستاذة مشاركة في هندسة البرمجيات والأمن السيبراني',
    rankEn: 'Associate Professor of Software Engineering & Cybersecurity',
    college: 'كلية الحاسب الآلي',
    collegeEn: 'College of Computing',
    office: 'مبنى الحاسب C-208',
    email: 'r.alamrani@fbsu.edu.sa',
    badge: 'منسقة الجودة الأكاديمية',
    badgeEn: 'Quality Coordinator',
    avatarColor: '#7c3aed',
    daysText: 'الاثنين والخميس (10:00 ص - 12:00 ظ)',
    daysTextEn: 'Mon & Thu (10:00 AM - 12:00 PM)',
    nextAvailable: 'الاثنين: 10:15 ص',
    nextAvailableEn: 'Mon: 10:15 AM',
    coursesSupervised: [
      'هندسة البرمجيات ومستودعات الكود الآمن (DevSecOps)',
      'الأمن السيبراني واختبار الاختراق الأخلاقي',
      'معمارية الأنظمة السحابية والخدمات المصغرة (Microservices)',
    ],
    timeSlots: [
      {
        time: '10:00 ص',
        timeEn: '10:00 AM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
      {
        time: '10:15 ص',
        timeEn: '10:15 AM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
      {
        time: '10:45 ص',
        timeEn: '10:45 AM',
        duration: '15 دقيقة',
        durationEn: '15 mins',
        available: true,
      },
    ],
  },
  {
    id: 'drSamir',
    name: 'د. سمير كمال',
    nameEn: 'Dr. Samir Kamal',
    rank: 'أستاذ مشارك في هندسة النظم الرقمية وشبكات الحاسب',
    rankEn: 'Associate Professor of Digital Systems & Computer Networks',
    college: 'كلية الهندسة',
    collegeEn: 'College of Engineering',
    office: 'مبنى الهندسة E-312',
    email: 's.kamal@fbsu.edu.sa',
    badge: 'مشرف معامل الشبكات',
    badgeEn: 'NOC Supervisor',
    avatarColor: '#059669',
    daysText: 'الأحد والثلاثاء (01:00 م - 03:00 م)',
    daysTextEn: 'Sun & Tue (01:00 PM - 03:00 PM)',
    nextAvailable: 'اليوم الأحد: 01:30 م',
    nextAvailableEn: 'Today Sun: 01:30 PM',
    coursesSupervised: [
      'بروتوكولات شبكات الحاسب وتوجيه حزم البيانات (CCNA/CCNP)',
      'شبكات الاستشعار اللاسلكية وإنترنت الأشياء (IoT)',
    ],
    timeSlots: [
      {
        time: '01:00 م',
        timeEn: '01:00 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
      {
        time: '01:30 م',
        timeEn: '01:30 PM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
    ],
  },
  {
    id: 'drTariq',
    name: 'د. طارق السعيد',
    nameEn: 'Dr. Tariq Al-Saeed',
    rank: 'رئيس قسم الهندسة الكهربائية والميكاترونكس',
    rankEn: 'Head of Electrical Engineering & Mechatronics',
    college: 'كلية الهندسة',
    collegeEn: 'College of Engineering',
    office: 'مبنى الهندسة E-101',
    email: 't.alsaeed@fbsu.edu.sa',
    badge: 'رئيس القسم',
    badgeEn: 'Dept Chair',
    avatarColor: '#b45309',
    daysText: 'الاثنين والأربعاء (11:00 ص - 01:00 م)',
    daysTextEn: 'Mon & Wed (11:00 AM - 01:00 PM)',
    nextAvailable: 'الأربعاء: 11:00 ص',
    nextAvailableEn: 'Wed: 11:00 AM',
    coursesSupervised: [
      'أنظمة القوى الكهربائية والطاقة المتجددة (Solar & Wind)',
      'أنظمة التحكم الآلي والروبوتات المتقدمة',
    ],
    timeSlots: [
      {
        time: '11:00 ص',
        timeEn: '11:00 AM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
      {
        time: '11:30 ص',
        timeEn: '11:30 AM',
        duration: '20 دقيقة',
        durationEn: '20 mins',
        available: true,
      },
    ],
  },
];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'LAB-101',
    name: 'مختبر الحوسبة الفائقة والذكاء الاصطناعي (AI & HPC Supercomputing Lab)',
    nameEn: 'AI & HPC Supercomputing Lab 101',
    building: 'مبنى كلية الحاسب - الدور الأرضي',
    buildingEn: 'College of Computing - Ground Floor',
    capacity: '20 محطة معالجة رسومية NVIDIA RTX Workstations',
    capacityEn: '20 NVIDIA RTX GPU Workstations',
    typeBadge: 'مختبر ذكاء اصطناعي وحوسبة',
    typeBadgeEn: 'AI & HPC Lab',
    status: 'available',
    utilizationPercent: 25,
    requirementNote: 'التدريب التمهيدي مطلوب للـ GPU والأنظمة الفائقة',
    requirementNoteEn: 'Induction training required for GPU clusters',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'booked', label: 'محجوز' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    specs: [
      '20 محطة عمل HP Z8 مجهزة بكروت NVIDIA RTX 4090 24GB لتدريب نماذج Deep Learning',
      'اتصال مباشر بـ HPC Cluster عبر ألياف ضوئية فائقة السرعة 40Gbps',
      'بيئات عمل جاهزة: PyTorch, TensorFlow, CUDA, Docker, JupyterHub',
      'شاشة عرض تفاعلية 86 بوصة 4K تدعم المؤتمرات السحابية والمحاضرات الهجينة',
    ],
    specsEn: [
      '20 HP Z8 Workstations with NVIDIA RTX 4090 GPUs for Deep Learning training',
      'Direct connection to University HPC Cluster via 40Gbps optical link',
      'Pre-installed environments: PyTorch, TensorFlow, CUDA, Docker, JupyterHub',
      'Interactive 86-inch 4K screen for collaborative reviews and hybrid lectures',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'LAB-102',
    name: 'معمل هندسة وتطوير البرمجيات السحابية (Software Engineering Lab 102)',
    nameEn: 'Software Engineering & Cloud Lab 102',
    building: 'مبنى كلية الحاسب - الدور الأرضي',
    buildingEn: 'College of Computing - Ground Floor',
    capacity: '24 جهاز ورك ستيشن / طالب',
    capacityEn: '24 iMac & Workstation Stations',
    typeBadge: 'معمل برمجيات متقدم',
    typeBadgeEn: 'Software Lab',
    status: 'in-use',
    utilizationPercent: 85,
    requirementNote: 'جلسة عمل جماعي نشطة لطلاب هندسة البرمجيات',
    requirementNoteEn: 'Active collaborative coding in progress',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'booked', label: 'نشط' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    activeBooking: {
      teamLead: 'إياد الحربي',
      teamLeadEn: 'Eyad Al-Harbi',
      teamMembers: [
        'إياد الحربي (Backend Architecture)',
        'راكان المطيري (Frontend & UI/UX)',
        'عبد العزيز البلوي (Testing & QA)',
      ],
      purpose: 'إنجاز التكاليف والمهام المشتركة لمشروع الحرم الجامعي الذكي (CampusFlow)',
      startTime: '09:00 ص',
      endTime: '09:40 ص',
      totalMinutes: 40,
      remainingMinutes: 18,
    },
    specs: [
      '24 جهاز Apple iMac و HP Workstation مجهزة بـ Java 21 و Python 3.12 و Node.js 20 و VS Code',
      'سيرفرات اختبار محلية وتكامل مستمر CI/CD عبر Docker و GitHub Enterprise',
      'طابعات ليزر ملونة وشاشة ذكية 85 بوصة للعرض التفاعلي ومراجعة الكود الجماعي',
    ],
    specsEn: [
      '24 iMac & HP Workstations with Java 21, Python 3.12, Node.js 20, and VS Code',
      'Local test servers and CI/CD pipeline via Docker and GitHub Enterprise',
      'Color laser printers and 85-inch 4K interactive presentation display',
    ],
    availableFrom: '09:40 ص (بعد انتهاء الجلسة البرمجية المجدولة)',
    availableFromEn: '09:40 AM (after active coding session)',
  },
  {
    id: 'LAB-103',
    name: 'مركز العمليات السيبرانية والشبكات Cisco CyberOps NOC Lab',
    nameEn: 'Cisco CyberOps & Network Operations Center (NOC)',
    building: 'مبنى كلية الهندسة والحاسب - الدور الأول',
    buildingEn: 'Engineering & Computing Building - 1st Floor',
    capacity: '18 محطة مراقبة أمنية وتحليل حزم',
    capacityEn: '18 Cyber Defense Monitoring Consoles',
    typeBadge: 'مركز دفاع سيبراني',
    typeBadgeEn: 'Cyber Defense NOC',
    status: 'available',
    utilizationPercent: 40,
    requirementNote: 'تصريح شبكات معتمد مطلوب لتشغيل راوترات سيسكو',
    requirementNoteEn: 'Network clearance required for Cisco rack operations',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'available', label: 'متاح' },
      { time: '13:00', timeEn: '13:00', status: 'booked', label: 'محجوز' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    specs: [
      'جدران مراقبة أمنية Security Video Wall مع تغذية مباشرة لخرائط التهديدات السيبرانية',
      'خوادم راك Cisco Catalyst 9300 وراوترات ISR 4000 مخصصة لتدريب CCNA/CCNP Security',
      'أدوات احترافية لاختبار الاختراق: Wireshark, Metasploit, Splunk, Snort SIEM',
      'شبكة معزولة تماماً (Air-Gapped Sandbox) لتجارب الاختراق الأخلاقي بأمان',
    ],
    specsEn: [
      'Security Operations Video Wall displaying live threat telemetry',
      'Cisco Catalyst 9300 racks and ISR 4000 routers for CCNA/CCNP Security',
      'Professional security toolkits: Wireshark, Metasploit, Splunk, Snort SIEM',
      'Fully isolated air-gapped sandbox network for safe penetration testing',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'LAB-104',
    name: 'مختبر الروبوتات والأنظمة الذكية والميكاترونكس (Robotics Lab 104)',
    nameEn: 'Robotics & Autonomous Systems Lab 104',
    building: 'مبنى كلية الهندسة - الدور الأرضي',
    buildingEn: 'College of Engineering - Ground Floor',
    capacity: '16 محطة تجارب واختبار روبوتات',
    capacityEn: '16 Robotics Test Benches',
    typeBadge: 'معمل روبوتات وأنظمة ذكية',
    typeBadgeEn: 'Robotics & AI Hardware',
    status: 'available',
    utilizationPercent: 30,
    requirementNote: 'إشراف فني مطلوب عند تشغيل أذرع UR3e وطابعات 3D',
    requirementNoteEn: 'Supervised operation for robotic arms and 3D printers',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'available', label: 'متاح' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'booked', label: 'محجوز' },
    ],
    specs: [
      'أذرع روبوتية صناعية Universal Robots UR3e وحقائب ROS2 للتنقل المستقل',
      'كاميرات عمق Intel RealSense وحساسات Velodyne LiDAR ثلاثية الأبعاد',
      'طابعات ثلاثية الأبعاد سريعة وماكينات CNC لتصنيع النماذج الهندسية الأولية',
    ],
    specsEn: [
      'Universal Robots UR3e industrial robotic arms and ROS2 mobile platforms',
      'Intel RealSense depth cameras and Velodyne 3D LiDAR sensors',
      'High-speed 3D printers and precision CNC milling for rapid prototyping',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'ROOM-A04',
    name: 'قاعة المذاكرة والعمل الجماعي الذكية (Collaborative Study Pod A-04)',
    nameEn: 'Collaborative Study Pod A-04',
    building: 'مبنى كلية الهندسة - الدور الأول',
    buildingEn: 'College of Engineering - 1st Floor',
    capacity: '6 إلى 8 طلاب',
    capacityEn: '6 to 8 Students',
    typeBadge: 'قاعة نقاش ذكية',
    typeBadgeEn: 'Smart Discussion Pod',
    status: 'available',
    utilizationPercent: 20,
    requirementNote: 'متاحة فوراً للمجموعات الطلابية والشروحات التفاعلية',
    requirementNoteEn: 'Open immediately for student study groups',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'available', label: 'متاح' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    specs: [
      'طاولة اجتماعات تفاعلية مع منافذ طاقة وشواحن Type-C متعددة',
      'سبورة ذكية تفاعلية Interactive Whiteboard مع خاصية حفظ الملاحظات السحابية',
      'شاشة عرض لاسلكية تدعم AirPlay و Google Cast وميكروفون مؤتمرات عازل للضوضاء',
      'عازل صوتي متكامل لضمان أعلى درجات التركيز والهدوء أثناء التحضير',
    ],
    specsEn: [
      'Interactive collaboration table with universal Type-C and fast chargers',
      'Interactive digital whiteboard with cloud session export to student portal',
      'Wireless presentation display supporting AirPlay, Miracast, and Cast',
      'Acoustic insulation panels providing optimal quiet study atmosphere',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'ROOM-B08',
    name: 'قاعة السيمنار والمناقشات العلمية (Executive Seminar Hall B-08)',
    nameEn: 'Executive Seminar Hall B-08',
    building: 'مبنى كلية إدارة الأعمال والطب - الدور الثاني',
    buildingEn: 'Business & Medicine Complex - 2nd Floor',
    capacity: '16 مقعداً تنفيذياً',
    capacityEn: '16 Executive Seats',
    typeBadge: 'قاعة سيمنار واجتماعات',
    typeBadgeEn: 'Executive Seminar',
    status: 'available',
    utilizationPercent: 15,
    requirementNote: 'مجهزة للمؤتمرات الهجينة ومناقشة أبحاث التخرج',
    requirementNoteEn: 'Configured for hybrid seminars & capstone defenses',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'booked', label: 'محجوز' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    specs: [
      'نظام مؤتمرات Polycom متقدم مع تتبع آلي للمتحدث وكاميرات 4K مزدوجة',
      'مقاعد جلدية مريحة وطاولات مزودة بميكروفونات مدمجة وشاشات عرض فردية',
      'تجهيزات متكاملة لمناقشة رسائل الماجستير والأبحاث وعروض الشركات الراعية',
    ],
    specsEn: [
      'Polycom video conferencing with intelligent auto-framing 4K cameras',
      'Ergonomic leather seating with embedded push-to-talk microphones',
      'Turnkey setup for postgraduate thesis defense and institutional seminars',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'LAB-205',
    name: 'معمل التصميم المنطقي والدوائر الرقمية (Digital Logic Lab 205)',
    nameEn: 'Digital Logic & Circuit Lab 205',
    building: 'مبنى كلية الهندسة والحاسب - الدور الثاني',
    buildingEn: 'Engineering & Computing - 2nd Floor',
    capacity: '16 محطة تجارب هندسية',
    capacityEn: '16 Engineering Workbenches',
    typeBadge: 'معمل عتاد ودوائر',
    typeBadgeEn: 'Circuits & Logic',
    status: 'available',
    utilizationPercent: 50,
    requirementNote: 'حقائب التدريب المنطقي FPGA جاهزة للاستخدام المعملي',
    requirementNoteEn: 'FPGA and logic trainer kits ready for lab experiments',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'available', label: 'متاح' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'booked', label: 'محجوز' },
    ],
    specs: [
      'حقائب تدريبية متقدمة Xilinx FPGA و Digital Logic Trainers',
      'أجهزة راسم إشارة رقمي Rigol Oscilloscopes ومولدات إشارات ترددية عالية الدقة',
      'أطقم بوابات منطقية متكاملة (AND, OR, NOT, NAND, XOR) ودوائر توقيت 555',
      'إشراف هندسي وفني متخصص مع معايير السلامة المهنية المعتمدة',
    ],
    specsEn: [
      'Advanced Xilinx FPGA boards and Digital Logic experimentation trainers',
      'Rigol Digital Storage Oscilloscopes and precision function generators',
      'Modular logic gates and sequential circuit breadboards',
      'Supervised engineering facility adhering to international laboratory safety',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
  {
    id: 'ROOM-C12',
    name: 'حاضنة مشاريع التخرج والابتكار (Senior Capstone Hub C-12)',
    nameEn: 'Senior Capstone & Innovation Hub C-12',
    building: 'مبنى عمادة الحاسب - الدور الثاني',
    buildingEn: 'College of Computing - 2nd Floor',
    capacity: '12 طالب',
    capacityEn: '12 Students',
    typeBadge: 'حاضنة مشاريع وابتكار',
    typeBadgeEn: 'Capstone Incubator',
    status: 'reserved',
    utilizationPercent: 90,
    requirementNote: 'محجوزة لفريق مشروع الحرم الجامعي الذكي (CampusFlow)',
    requirementNoteEn: 'Reserved for CampusFlow Senior Capstone Team',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'booked', label: 'محجوز' },
      { time: '13:00', timeEn: '13:00', status: 'booked', label: 'محجوز' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    activeBooking: {
      teamLead: 'فريق مشروع منظومة الحرم الجامعي الذكي (CampusFlow)',
      teamLeadEn: 'CampusFlow Senior Capstone Team',
      teamMembers: ['إياد الحربي', 'راكان المطيري', 'عبد العزيز البلوي'],
      purpose: 'استعراض النموذج النهائي واختبار البوابات الذكية وتطبيقات الجوال مع العمادة',
      startTime: '10:00 ص',
      endTime: '11:30 ص',
      totalMinutes: 90,
      remainingMinutes: 52,
    },
    specs: [
      'طابعات ثلاثية الأبعاد Bambu Lab ومحطات تجميع ولحام إلكتروني آمنة',
      'حقائب إنترنت الأشياء IoT وحساسات ESP32 وكاميرات قراءة اللوحات ALPR التجريبية',
      'شاشات عرض مزدوجة Dual 4K لمراجعة وتدقيق معمارية المنظومة الموحدة',
    ],
    specsEn: [
      'Bambu Lab precision 3D printers and regulated electronics soldering stations',
      'IoT toolkits, ESP32 microcontrollers, and test ALPR license plate cameras',
      'Dual 4K displays for software architecture and database design reviews',
    ],
    availableFrom: '11:30 ص',
    availableFromEn: '11:30 AM',
  },
  {
    id: 'POD-D01',
    name: 'كابينة البحث الفردي الهادئ (Postgraduate Quiet Research Pod D-01)',
    nameEn: 'Postgraduate Quiet Research Pod D-01',
    building: 'المكتبة المركزية للجامعة - طابق المراجع المتقدمة',
    buildingEn: 'Central University Library - Advanced Reference Floor',
    capacity: 'طالب باحث واحد / كرسي مريح ومكتب فردي',
    capacityEn: '1 Researcher Private Study Pod',
    typeBadge: 'كابينة بحث فردي',
    typeBadgeEn: 'Private Research Pod',
    status: 'available',
    utilizationPercent: 10,
    requirementNote: 'متاحة للباحثين والطلاب للتركيز العميق وإنجاز الأطروحات',
    requirementNoteEn: 'Available for deep-work thesis research',
    scheduleSlots: [
      { time: '09:00', timeEn: '09:00', status: 'available', label: 'متاح' },
      { time: '13:00', timeEn: '13:00', status: 'available', label: 'متاح' },
      { time: '17:00', timeEn: '17:00', status: 'available', label: 'متاح' },
    ],
    specs: [
      'عزل صوتي تام 100% يمنع دخول أي ضوضاء خارجية للدراسة والتركيز العميق',
      'شاشة 32 بوصة 4K USB-C مع شحن مباشر للابتوب وكابلات فائقة السرعة',
      'إمكانية الوصول المباشر لقواعد البيانات العالمية IEEE Xplore, ScienceDirect, Springer',
    ],
    specsEn: [
      'Full 100% acoustic isolation pod for zero-distraction deep work',
      '32-inch 4K USB-C monitor with 90W laptop fast charging',
      'Direct authenticated access to IEEE Xplore, ScienceDirect, and SpringerLink',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
    availableFromEn: 'Available for immediate booking',
  },
];

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-1',
    target: 'drMezher',
    targetName: 'د. محمد مزهر (عميد الكلية)',
    sender: 'إياد الحربي (20210045)',
    title: 'طلب حجز ساعة مكتبية - مناقشة اعتماد منظومة الحرم الذكي',
    message:
      'قام الطالب إياد الحربي بحجز موعد استشارة أكاديمية لمدة 20 دقيقة (الاثنين 01:20 م) لمناقشة نشر الورقة العلمية في مجلة معتمدة.',
    time: 'منذ 5 دقائق',
    read: false,
    icon: 'userCheck',
    badge: 'موعد مؤكد',
  },
  {
    id: 'notif-2',
    target: 'eyad',
    targetName: 'إياد الحربي',
    sender: 'المحفظة الجامعية الذكية',
    title: 'إيداع رصيد جامعي: + 70.00 ر.س (شروحات الأقران)',
    message:
      'قام الزميل راكان المطيري بحجز جلسة شرح لمقرر (CS 210). تم إيداع 70.00 ر.س في محفظتك الجامعية ويمكن استخدامها فوراً لسداد الرسوم أو حجز المواقف.',
    time: 'منذ 15 دقيقة',
    read: false,
    icon: 'wallet',
    badge: 'رصيد جديد',
  },
  {
    id: 'notif-3',
    target: 'rakan',
    targetName: 'راكان المطيري',
    sender: 'نظام المواقف الذكية',
    title: 'تأكيد حجز موقف سيارة (#05 - قطاع A)',
    message:
      'تم تأكيد حجز الموقف #05 في قطاع A (الحاسب والهندسة) بنجاح. تم خصم 17.25 ر.س من محفظتك ومفتاح البوابة الرقمي ALPR نشط الآن لسيارتك.',
    time: 'منذ 25 دقيقة',
    read: false,
    icon: 'parking',
    badge: 'حجز مؤكد',
  },
];

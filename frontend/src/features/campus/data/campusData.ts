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
    tutorRole: 'طالب متميز - كلية الهندسة',
    tutorAvatarColor: '#116E63',
    courseCode: 'MATH 101 / MATH 201',
    courseName: 'حساب التفاضل والتكامل والرياضيات الهندسية',
    courseNameEn: 'Calculus & Engineering Mathematics',
    coveredLectures: 'المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)',
    coveredScope:
      'شرح مبسط لمفاهيم النهايات والاشتقاق، وحل أسئلة الواجبات ونماذج الاختبارات السابقة حتى نهاية الشابتر.',
    hourlyRate: 70, // 70 SAR as requested in audio!
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'اليوم الأحد - 04:30 م',
    location: 'قاعة المذاكرة الذكية A-04 (أو أونلاين عبر المنصة)',
    category: 'math',
    rating: 4.96,
    reviewsCount: 28,
    status: 'open',
    enrolledStudents: ['راكان المطيري'],
  },
  {
    id: 'TUT-102',
    tutorId: 'rakan',
    tutorName: 'راكان المطيري',
    tutorRole: 'طالب متميز - كلية الحاسب الآلي',
    tutorAvatarColor: '#d7a237',
    courseCode: 'CS 110 / CS 210',
    courseName: 'مبادئ البرمجة وهياكل البيانات (Python & C++)',
    courseNameEn: 'Programming & Data Structures',
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
    enrolledStudents: ['عبد العزيز البلوي'],
  },
  {
    id: 'TUT-103',
    tutorId: 'student_sara',
    tutorName: 'سارة البلوي',
    tutorRole: 'طالبة متميزة - هندسة الحاسب',
    tutorAvatarColor: '#ec4899',
    courseCode: 'CEN 220',
    courseName: 'التصميم المنطقي الرقمي (Digital Logic Design)',
    courseNameEn: 'Digital Logic & Circuit Design',
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
    enrolledStudents: [],
  },
  {
    id: 'TUT-104',
    tutorId: 'eyad',
    tutorName: 'إياد الحربي',
    tutorRole: 'طالب متميز - كلية الهندسة',
    tutorAvatarColor: '#116E63',
    courseCode: 'PHYS 101',
    courseName: 'الفيزياء العامة (الميكانيكا والديناميكا)',
    courseNameEn: 'General Physics & Mechanics',
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
    enrolledStudents: ['عبد العزيز البلوي'],
  },
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'drRaghad',
    name: 'د. رغد النفيعي',
    nameEn: 'Dr. Raghad Al-Nefaie',
    rank: 'رئيسة قسم كلية الحاسبات وتكنولوجيا المعلومات',
    rankEn: 'Chairperson - Computer Science & Engineering Dept',
    college: 'كلية الحاسب الآلي',
    office: 'مكتب رئيسة القسم - مبنى الحاسب C-105',
    email: 'r.alnefaie@fbsu.edu.sa',
    badge: 'رئيسة القسم',
    avatarColor: '#116E63',
    daysText: 'الأحد والثلاثاء (10:00 ص - 12:30 م)',
    nextAvailable: 'اليوم الأحد: 11:15 ص',
    coursesSupervised: [
      'التصميم المنطقي (Logic Design)',
      'معمارية الحاسب (Computer Architecture)',
      'الإشراف على مشاريع التخرج',
      'الإرشاد الأكاديمي ومعادلة المقررات',
    ],
    timeSlots: [
      { time: '11:00 ص', duration: '15 دقيقة', available: true },
      { time: '11:15 ص', duration: '15 دقيقة', available: true },
      {
        time: '11:30 ص',
        duration: '30 دقيقة',
        available: false,
        bookedNote: 'محجوز - مناقشة مشروع تخرج',
      },
      { time: '12:00 م', duration: '15 دقيقة', available: true },
      { time: '12:15 م', duration: '15 دقيقة', available: true },
    ],
  },
  {
    id: 'drMezher',
    name: 'د. محمد مزهر',
    nameEn: 'Dr. Mohammad Mezher',
    rank: 'عميد كلية الحاسب الآلي وتقنية المعلومات',
    rankEn: 'Dean - College of Computing & Information Technology',
    college: 'كلية الحاسب الآلي',
    office: 'جناح العميد - مبنى الإدارة الأكاديمية C-201',
    email: 'm.mezher@fbsu.edu.sa',
    badge: 'عميد الكلية',
    avatarColor: '#d7a237',
    daysText: 'الاثنين والأربعاء (11:00 ص - 02:00 م)',
    nextAvailable: 'الاثنين القادم: 01:15 م',
    coursesSupervised: [
      'مبادرات الذكاء الاصطناعي والحوسبة المتقدمة',
      'مناقشة الأفكار البحثية ومشاريع التخرج الكبرى',
      'الشؤون الأكاديمية والخطط الدراسية',
      'اعتماد الشراكات والهاكاثونات الطلابية',
    ],
    timeSlots: [
      { time: '01:00 م', duration: '15 دقيقة', available: true },
      { time: '01:15 م', duration: '30 دقيقة', available: true },
      { time: '01:45 م', duration: '15 دقيقة', available: false, bookedNote: 'اجتماع مجلس الكلية' },
      { time: '02:00 م', duration: '30 دقيقة', available: true },
    ],
  },
  {
    id: 'doctor',
    name: 'د. عبد الله الغامدي',
    nameEn: 'Dr. Abdullah Al-Ghamdi',
    rank: 'أستاذ مشارك - منسق مشاريع التخرج',
    rankEn: 'Associate Professor - Capstone Coordinator',
    college: 'كلية الحاسب والهندسة',
    office: 'مبنى الهندسة - مكتب A-114',
    email: 'a.ghamdi@fbsu.edu.sa',
    badge: 'أستاذ مشارك',
    avatarColor: '#8b5cf6',
    daysText: 'يومياً (01:00 م - 02:00 م)',
    nextAvailable: 'اليوم: 01:30 م',
    coursesSupervised: [
      'هندسة البرمجيات وتطوير النظم',
      'قواعد البيانات ونظم المعلومات',
      'لجنة تحكيم مشاريع التخرج',
    ],
    timeSlots: [
      { time: '01:00 م', duration: '15 دقيقة', available: true },
      { time: '01:15 م', duration: '15 دقيقة', available: true },
      { time: '01:30 م', duration: '15 دقيقة', available: true },
      { time: '01:45 م', duration: '15 دقيقة', available: true },
    ],
  },
];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'LAB-102',
    name: 'معمل الحاسب وتطوير البرمجيات (Computer Lab 102)',
    nameEn: 'Computer Software Lab 102',
    building: 'مبنى كلية الحاسب - الدور الأرضي',
    capacity: '24 جهاز ورك ستيشن / طالب',
    typeBadge: 'معمل حاسب',
    status: 'in-use', // In use by Eyad, Rakan, Abdulaziz as stated in the audio!
    activeBooking: {
      teamLead: 'إياد الحربي',
      teamMembers: [
        'إياد الحربي (Classwork)',
        'راكان المطيري (Assignment)',
        'عبد العزيز البلوي (Homework)',
      ],
      purpose: 'إنجاز التكاليف والمهام المشتركة (Classwork & Assignment)',
      startTime: '09:00 ص',
      endTime: '09:20 ص',
      totalMinutes: 20,
      remainingMinutes: 11,
    },
    specs: [
      '24 جهاز iMac و HP Workstation مجهزة بـ Python و Java و VS Code',
      'إنترنت ألياف ضوئية فائق السرعة مخصص للمشاريع والتحميل',
      'شاشة ذكية 85 بوصة للعرض والمراجعة الجماعية للأكواد',
      'طابعة ليزر سريعة لطباعة التقارير والأبحاث',
    ],
    availableFrom: '09:20 ص (بعد انتهاء الجلسة المحددة)',
  },
  {
    id: 'ROOM-A04',
    name: 'قاعة المذاكرة والعمل الجماعي الذكية (Study Room A-04)',
    nameEn: 'Collaborative Study Pod A-04',
    building: 'مبنى كلية الهندسة - الدور الأول',
    capacity: '6 إلى 8 طلاب',
    typeBadge: 'قاعة نقاش',
    status: 'available',
    specs: [
      'طاولة اجتماعات تفاعلية مع منافذ طاقة وشواحن Type-C متعددة',
      'سبورة ذكية تفاعلية Interactive Whiteboard مع خاصية حفظ الملاحظات',
      'شاشة عرض لاسلكية تدعم AirPlay و Miracast',
      'عازل صوتي متكامل لضمان هدوء المذاكرة والتركيز',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
  },
  {
    id: 'LAB-205',
    name: 'معمل التصميم المنطقي والدوائر الرقمية (Logic Design Lab 205)',
    nameEn: 'Digital Logic & Circuit Lab 205',
    building: 'مبنى كلية الهندسة والحاسب - الدور الثاني',
    capacity: '16 محطة تجارب هندسية',
    typeBadge: 'معمل عتاد ودوائر',
    status: 'available',
    specs: [
      'حقائب تدريبية متقدمة FPGA و Digital Logic Trainers',
      'أجهزة راسم إشارة Oscilloscopes ومولدات إشارات ترددية',
      'أطقم بوابات منطقية متكاملة (AND, OR, NOT, NAND, XOR)',
      'إشراف فني متخصص وتجهيزات سلامة مهنية',
    ],
    availableFrom: 'متاحة للحجز الفوري الآن',
  },
  {
    id: 'ROOM-C12',
    name: 'حاضنة مشاريع التخرج والابتكار (Capstone Hub C-12)',
    nameEn: 'Senior Capstone & Innovation Hub C-12',
    building: 'مبنى عمادة الحاسب - الدور الثاني',
    capacity: '12 طالب',
    typeBadge: 'حاضنة مشاريع',
    status: 'reserved',
    activeBooking: {
      teamLead: 'فريق مشروع منظومة الحرم الجامعي الذكي',
      teamMembers: ['إياد الحربي', 'راكان المطيري', 'عبد العزيز البلوي'],
      purpose: 'استعراض النموذج النهائي واختبار الربط المباشر مع الدكاترة',
      startTime: '10:00 ص',
      endTime: '11:00 ص',
      totalMinutes: 60,
      remainingMinutes: 44,
    },
    specs: [
      'طابعات ثلاثية الأبعاد 3D Printers ومحطات تصنيع نماذج أولية',
      'حقائب إنترنت الأشياء IoT وحساسات ESP32 وكاميرات ALPR',
      'شاشات عرض مزدوجة Dual 4K لمراجعة البرمجيات',
    ],
    availableFrom: '11:00 ص',
  },
];

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-1',
    target: 'drRaghad',
    targetName: 'د. رغد النفيعي (رئيسة القسم)',
    sender: 'إياد الحربي (20210045)',
    title: 'طلب حجز ساعة مكتبية - مناقشة مادة Logic Design',
    message:
      'قام الطالب إياد الحربي بحجز موعد لمدة 15 دقيقة (الأحد 11:15 ص) لمناقشة استفسار في مشروع مادة Logic Design.',
    time: 'منذ 5 دقائق',
    read: false,
    icon: 'userCheck',
    badge: 'موعد مؤكد',
  },
  {
    id: 'notif-2',
    target: 'eyad',
    targetName: 'إياد الحربي',
    sender: 'النظام المالي الجامعي',
    title: 'إيداع رصيد جامعي: + 70.00 ر.س (شروحات أكاديمية)',
    message:
      'قام الزميل راكان المطيري بحجز جلسة شرح (MATH 101). تم تحويل 70.00 ر.س تلقائياً إلى رصيدك بالجامعة ويمكنك استخدامها لسداد الرسوم أو حجز المواقف.',
    time: 'منذ 15 دقيقة',
    read: false,
    icon: 'wallet',
    badge: 'رصيد جديد',
  },
  {
    id: 'notif-3',
    target: 'drMezher',
    targetName: 'د. محمد مزهر (عميد الكلية)',
    sender: 'راكان المطيري (20220088)',
    title: 'إشعار مقابلة عميد الكلية - مناقشة ابتكار المنظومة الذكية',
    message:
      'طلب الطالب راكان المطيري موعداً في الساعات المكتبية (الاثنين 01:15 م) لعرض مبادرة تحويل المنصة إلى نظام حرم جامعي متكامل.',
    time: 'منذ 25 دقيقة',
    read: false,
    icon: 'userCheck',
    badge: 'جديد',
  },
];

export const CAMPUS_NOTIFICATIONS = INITIAL_NOTIFICATIONS;

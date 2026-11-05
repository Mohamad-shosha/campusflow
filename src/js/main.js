import '../css/style.css';
import confetti from 'canvas-confetti';
import { createIcon } from './icons.js';

// ============================================================================
// Audio Synthesizer (Professional Subtle Feedback)
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.28);

    osc2.frequency.setValueAtTime(261.63, now);
    osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.28);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  playScan() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.22);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playGateOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.12);
    osc.frequency.setValueAtTime(659.25, now + 0.24);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.linearRampToValueAtTime(180, now + 0.15);
    osc2.frequency.setValueAtTime(130, now);
    osc2.frequency.linearRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(440, now + 0.08);
    osc.frequency.setValueAtTime(392, now + 0.1);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }
}

const soundFX = new AudioSynthesizer();

// ============================================================================
// University Data & Personas
// ============================================================================
// University Data & Personas
// ============================================================================
const USERS = {
  eyad: {
    id: '20210045',
    name: 'إياد الحربي',
    nameEn: 'Eyad Al-Harbi',
    role: 'طالب متميز - كلية الهندسة (معلم أقران)',
    roleEn: 'Honor Student - Engineering (Math Peer Tutor)',
    college: 'كلية الهندسة',
    car: 'تويوتا كامري 2023',
    carEn: 'Toyota Camry 2023',
    plateLetters: 'ب ط ك',
    plateNumbers: '1234',
    walletBalance: 720.00, // Accumulated 720 SAR from tutoring & flex sharing
    tuitionFeesTotal: 12000.00,
    tuitionFeesPaid: 4500.00,
    primarySpot: 1,
    schedule: 'أحد / ثلاثاء (08:00 - 10:00 & 01:30 - 03:30)',
    specialty: 'الرياضيات المتقدمة والهندسة (Calculus & Engineering Math)',
    rating: 4.96,
    tutoringSessionsCount: 14,
    avatarColor: '#116E63'
  },
  rakan: {
    id: '20220088',
    name: 'راكان المطيري',
    nameEn: 'Rakan Al-Mutairi',
    role: 'طالب متميز - كلية الحاسب الآلي (معلم برمجة)',
    roleEn: 'Honor Student - Computing (Coding Peer Tutor)',
    college: 'كلية الحاسب الآلي',
    car: 'هيونداي سوناتا 2024',
    carEn: 'Hyundai Sonata 2024',
    plateLetters: 'د ل س',
    plateNumbers: '8892',
    walletBalance: 280.00,
    tuitionFeesTotal: 11500.00,
    tuitionFeesPaid: 6000.00,
    primarySpot: 2,
    schedule: 'أحد / ثلاثاء (10:15 - 01:00)',
    specialty: 'البرمجة بلغة بايثون وهياكل البيانات (Python & Data Structures)',
    rating: 4.90,
    tutoringSessionsCount: 9,
    avatarColor: '#d7a237'
  },
  abdulaziz: {
    id: '20220199',
    name: 'عبد العزيز البلوي',
    nameEn: 'Abdulaziz Al-Balawi',
    role: 'طالب - كلية الحاسب الآلي (مجموعة العمل)',
    roleEn: 'Student - College of Computing (Team Member)',
    college: 'كلية الحاسب الآلي',
    car: 'فورد تورس 2022',
    carEn: 'Ford Taurus 2022',
    plateLetters: 'ع ب د',
    plateNumbers: '4090',
    walletBalance: 150.00,
    tuitionFeesTotal: 11500.00,
    tuitionFeesPaid: 3000.00,
    primarySpot: 5,
    schedule: 'أحد / ثلاثاء (09:00 - 01:00)',
    avatarColor: '#3b82f6'
  },
  drRaghad: {
    id: 'FAC-8821',
    name: 'د. رغد النفيعي',
    nameEn: 'Dr. Raghad Al-Nefaie',
    role: 'رئيسة قسم كلية الحاسبات وتكنولوجيا المعلومات',
    roleEn: 'Chairperson - Department of Computer Science',
    college: 'كلية الحاسب الآلي',
    department: 'قسم علوم وهندسة الحاسب',
    office: 'مبنى كلية الحاسب - مكتب C-105',
    email: 'r.alnefaie@fbsu.edu.sa',
    car: 'بي إم دبليو X5',
    carEn: 'BMW X5',
    plateLetters: 'ر غ د',
    plateNumbers: '2030',
    walletBalance: 850.00,
    primarySpot: 22,
    schedule: 'الأحد والثلاثاء (10:00 ص - 01:00 م)',
    avatarColor: '#116E63',
    badge: 'رئيسة القسم الأكاديمي',
    isFaculty: true
  },
  drMezher: {
    id: 'FAC-7700',
    name: 'د. محمد مزهر',
    nameEn: 'Dr. Mohammad Mezher',
    role: 'عميد كلية الحاسب الآلي وتقنية المعلومات',
    roleEn: 'Dean - College of Computing & IT',
    college: 'كلية الحاسب الآلي',
    department: 'عمادة كلية الحاسب الآلي',
    office: 'مبنى الإدارة الأكاديمية - جناح العميد C-201',
    email: 'm.mezher@fbsu.edu.sa',
    car: 'مرسيدس S-Class',
    carEn: 'Mercedes S-Class',
    plateLetters: 'م ز هـ',
    plateNumbers: '5000',
    walletBalance: 1200.00,
    primarySpot: 20,
    schedule: 'الاثنين والأربعاء (11:00 ص - 03:00 م)',
    avatarColor: '#d7a237',
    badge: 'عميد الكلية',
    isFaculty: true
  },
  doctor: {
    id: 'FAC-9912',
    name: 'د. عبد الله الغامدي',
    nameEn: 'Dr. Abdullah Al-Ghamdi',
    role: 'أستاذ مشارك - منسق مشاريع التخرج',
    roleEn: 'Associate Prof. - Capstone Coordinator',
    college: 'كلية الحاسب والهندسة',
    office: 'مبنى الهندسة - مكتب A-114',
    car: 'جينيسيس G80',
    carEn: 'Genesis G80',
    plateLetters: 'أ ح م',
    plateNumbers: '5501',
    walletBalance: 450.00,
    primarySpot: 19,
    schedule: 'يومي (08:00 - 04:00)',
    avatarColor: '#8b5cf6',
    badge: 'أستاذ مشارك',
    isFaculty: true
  }
};

// ============================================================================
// Student Peer Tutoring Sessions (الأنشطة والشروحات الطلابية)
// ============================================================================
const INITIAL_TUTORING_SESSIONS = [
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
    coveredScope: 'شرح مبسط لمفاهيم النهايات والاشتقاق، وحل أسئلة الواجبات ونماذج الاختبارات السابقة حتى نهاية الشابتر.',
    hourlyRate: 70, // 70 SAR as requested in audio!
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'اليوم الأحد - 04:30 م',
    location: 'قاعة المذاكرة الذكية A-04 (أو أونلاين عبر المنصة)',
    category: 'math',
    rating: 4.96,
    reviewsCount: 28,
    status: 'open',
    enrolledStudents: ['راكان المطيري']
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
    coveredScope: 'كتابة الأكواد العملية، خوارزميات الترتيب والبحث، وحل أسئلة الكلاس وورك والتكليف الأسبوعي.',
    hourlyRate: 70,
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'غداً الاثنين - 02:00 م',
    location: 'معمل الحاسب 102 (Computer Lab 102)',
    category: 'programming',
    rating: 4.92,
    reviewsCount: 19,
    status: 'open',
    enrolledStudents: ['عبد العزيز البلوي']
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
    coveredScope: 'شرح خرائط كارنوف (K-Maps)، تبسيط الدوائر المنطقية، وبوابات NAND/NOR والتطبيق على حقائب المعمل.',
    hourlyRate: 70,
    durationHours: 1,
    totalPrice: 70,
    dateTime: 'الثلاثاء - 01:15 م',
    location: 'معمل التصميم المنطقي Lab 205',
    category: 'hardware',
    rating: 4.98,
    reviewsCount: 15,
    status: 'open',
    enrolledStudents: []
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
    enrolledStudents: ['عبد العزيز البلوي']
  }
];

// ============================================================================
// Faculty Members & Office Hours (حجز الساعات المكتبية للقيادات والدكاترة)
// ============================================================================
const FACULTY_MEMBERS = [
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
      'الإرشاد الأكاديمي ومعادلة المقررات'
    ],
    timeSlots: [
      { time: '11:00 ص', duration: '15 دقيقة', available: true },
      { time: '11:15 ص', duration: '15 دقيقة', available: true },
      { time: '11:30 ص', duration: '30 دقيقة', available: false, bookedNote: 'محجوز - مناقشة مشروع تخرج' },
      { time: '12:00 م', duration: '15 دقيقة', available: true },
      { time: '12:15 م', duration: '15 دقيقة', available: true }
    ]
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
      'اعتماد الشراكات والهاكاثونات الطلابية'
    ],
    timeSlots: [
      { time: '01:00 م', duration: '15 دقيقة', available: true },
      { time: '01:15 م', duration: '30 دقيقة', available: true },
      { time: '01:45 م', duration: '15 دقيقة', available: false, bookedNote: 'اجتماع مجلس الكلية' },
      { time: '02:00 م', duration: '30 دقيقة', available: true }
    ]
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
      'لجنة تحكيم مشاريع التخرج'
    ],
    timeSlots: [
      { time: '01:00 م', duration: '15 دقيقة', available: true },
      { time: '01:15 م', duration: '15 دقيقة', available: true },
      { time: '01:30 م', duration: '15 دقيقة', available: true },
      { time: '01:45 م', duration: '15 دقيقة', available: true }
    ]
  }
];

// ============================================================================
// Study Rooms & Laboratories (حجز القاعات والمعامل الطلابية)
// ============================================================================
const INITIAL_STUDY_ROOMS = [
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
      teamMembers: ['إياد الحربي (Classwork)', 'راكان المطيري (Assignment)', 'عبد العزيز البلوي (Homework)'],
      purpose: 'إنجاز التكاليف والمهام المشتركة (Classwork & Assignment)',
      startTime: '09:00 ص',
      endTime: '09:20 ص',
      totalMinutes: 20,
      remainingMinutes: 11
    },
    specs: [
      '24 جهاز iMac و HP Workstation مجهزة بـ Python و Java و VS Code',
      'إنترنت ألياف ضوئية فائق السرعة مخصص للمشاريع والتحميل',
      'شاشة ذكية 85 بوصة للعرض والمراجعة الجماعية للأكواد',
      'طابعة ليزر سريعة لطباعة التقارير والأبحاث'
    ],
    availableFrom: '09:20 ص (بعد انتهاء الجلسة المحددة)'
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
      'عازل صوتي متكامل لضمان هدوء المذاكرة والتركيز'
    ],
    availableFrom: 'متاحة للحجز الفوري الآن'
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
      'إشراف فني متخصص وتجهيزات سلامة مهنية'
    ],
    availableFrom: 'متاحة للحجز الفوري الآن'
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
      remainingMinutes: 44
    },
    specs: [
      'طابعات ثلاثية الأبعاد 3D Printers ومحطات تصنيع نماذج أولية',
      'حقائب إنترنت الأشياء IoT وحساسات ESP32 وكاميرات ALPR',
      'شاشات عرض مزدوجة Dual 4K لمراجعة البرمجيات'
    ],
    availableFrom: '11:00 ص'
  }
];

// ============================================================================
// Direct Alerts & Notifications (نظام الإشعارات المباشرة للدكاترة والطلاب)
// ============================================================================
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    target: 'drRaghad',
    targetName: 'د. رغد النفيعي (رئيسة القسم)',
    sender: 'إياد الحربي (20210045)',
    title: 'طلب حجز ساعة مكتبية - مناقشة مادة Logic Design',
    message: 'قام الطالب إياد الحربي بحجز موعد لمدة 15 دقيقة (الأحد 11:15 ص) لمناقشة استفسار في مشروع مادة Logic Design.',
    time: 'منذ 5 دقائق',
    read: false,
    icon: 'userCheck',
    badge: 'موعد مؤكد'
  },
  {
    id: 'notif-2',
    target: 'eyad',
    targetName: 'إياد الحربي',
    sender: 'النظام المالي الجامعي',
    title: 'إيداع رصيد جامعي: + 70.00 ر.س (شروحات أكاديمية)',
    message: 'قام الزميل راكان المطيري بحجز جلسة شرح (MATH 101). تم تحويل 70.00 ر.س تلقائياً إلى رصيدك بالجامعة ويمكنك استخدامها لسداد الرسوم أو حجز المواقف.',
    time: 'منذ 15 دقيقة',
    read: false,
    icon: 'wallet',
    badge: 'رصيد جديد'
  },
  {
    id: 'notif-3',
    target: 'drMezher',
    targetName: 'د. محمد مزهر (عميد الكلية)',
    sender: 'راكان المطيري (20220088)',
    title: 'إشعار مقابلة عميد الكلية - مناقشة ابتكار المنظومة الذكية',
    message: 'طلب الطالب راكان المطيري موعداً في الساعات المكتبية (الاثنين 01:15 م) لعرض مبادرة تحويل المنصة إلى نظام حرم جامعي متكامل.',
    time: 'منذ 25 دقيقة',
    read: false,
    icon: 'userCheck',
    badge: 'جديد'
  }
];

// 30 Detailed Parking Spots
const INITIAL_PARKING_SPOTS = [
  // Zone A: College of Computing & Engineering (1 - 10)
  { id: 1, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'إياد الحربي', car: 'تويوتا كامري', plate: 'ب ط ك 1234', timeLeft: 'بريك بعد 15 د', distance: '30 م (ملاصق للمبنى)', isFlexEligible: true },
  { id: 2, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '35 م', isFlexEligible: false },
  { id: 3, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '40 م', isFlexEligible: false },
  { id: 4, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'سعود الشهري', car: 'شيفروليه كابرس', plate: 'ع س ر 4040', timeLeft: '1 س 45 د', distance: '45 م', isFlexEligible: false },
  { id: 5, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isFlexEligible: false },
  { id: 6, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'فيصل العطوي', car: 'لكزس ES', plate: 'ط ب ك 2030', timeLeft: '2 س 10 د', distance: '55 م', isFlexEligible: false },
  { id: 7, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isFlexEligible: false },
  { id: 8, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'flex-share', occupant: 'محمد الحويطي (في بريك)', car: 'نيسان التيما', plate: 'ر ح ل 7711', timeLeft: 'متاح للتبادل: 2 س 15 د', distance: '65 م', isFlexEligible: true },
  { id: 9, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '70 م', isFlexEligible: false },
  { id: 10, zone: 'A', college: 'الحاسب والهندسة', collegeEn: 'Computing & Engineering', status: 'occupied', occupant: 'عمر البلوي', car: 'فورد تورس', plate: 'د ر ع 9090', timeLeft: '45 د', distance: '75 م', isFlexEligible: false },

  // Zone B: College of Business & Management & Medicine (11 - 18)
  { id: 11, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '40 م', isFlexEligible: false },
  { id: 12, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'occupied', occupant: 'خالد العنزي', car: 'هوندا أكورد', plate: 'ن ج م 3321', timeLeft: '3 س', distance: '45 م', isFlexEligible: false },
  { id: 13, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isFlexEligible: false },
  { id: 14, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'flex-share', occupant: 'سلطان القحطاني (بريك)', car: 'تويوتا أفالون', plate: 'ق ح ط 5050', timeLeft: 'متاح للتبادل: 1 س 50 د', distance: '55 م', isFlexEligible: true },
  { id: 15, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isFlexEligible: false },
  { id: 16, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'occupied', occupant: 'ماجد الرشيدي', car: 'كيا K5', plate: 'س هـ م 1400', timeLeft: '1 س 15 د', distance: '65 م', isFlexEligible: false },
  { id: 17, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '70 م', isFlexEligible: false },
  { id: 18, zone: 'B', college: 'إدارة الأعمال والطب', collegeEn: 'Business & Medicine', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '75 م', isFlexEligible: false },

  // Zone C: Faculty Members & Doctors (19 - 24)
  { id: 19, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. عبد الله الغامدي', car: 'جينيسيس G80', plate: 'أ ح م 5501', timeLeft: 'محجوز يوم كامل', distance: '15 م (بوابة الإدارة)', isFaculty: true },
  { id: 20, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. سمير كمال', car: 'مرسيدس E300', plate: 'س م ر 2020', timeLeft: 'محاضرة حتى 02:00 م', distance: '20 م', isFaculty: true },
  { id: 21, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '25 م', isFaculty: true },
  { id: 22, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. ريم العمراني', car: 'بي إم دبليو X5', plate: 'ر ي م 7070', timeLeft: 'معمل حتى 01:00 م', distance: '20 م', isFaculty: true },
  { id: 23, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '25 م', isFaculty: true },
  { id: 24, zone: 'C', college: 'كادر التدريس (دكاترة)', collegeEn: 'Faculty Members', status: 'faculty-spot', occupant: 'د. طارق السعيد', car: 'أودي A6', plate: 'ط ر ق 1111', timeLeft: 'اجتماع مجلس الكلية', distance: '25 م', isFaculty: true },

  // Zone D: EV Charging & Accessible (25 - 30)
  { id: 25, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '50 م', isEV: true },
  { id: 26, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'occupied', occupant: 'لوسيد آير (طالب ماجستير)', car: 'Lucid Air Pure', plate: 'ل و س 2024', timeLeft: 'شحن 84% - متبقي 20 د', distance: '55 م', isEV: true },
  { id: 27, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '60 م', isEV: true },
  { id: 28, zone: 'D', college: 'مواقف ذوي الاحتياجات', collegeEn: 'Accessible Parking', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '10 م (منحدر مباشر)', isAccessible: true },
  { id: 29, zone: 'D', college: 'مواقف ذوي الاحتياجات', collegeEn: 'Accessible Parking', status: 'occupied', occupant: 'طالب ذوي همم', car: 'تويوتا برادو', plate: 'أ م ل 1010', timeLeft: 'محاضرة حتى 12:00 ظ', distance: '10 م', isAccessible: true },
  { id: 30, zone: 'D', college: 'شحن سيارات كهربائية EV', collegeEn: 'EV Fast Charging (50kW)', status: 'available', occupant: null, car: null, plate: null, timeLeft: null, distance: '65 م', isEV: true }
];

// App Global State
const appState = {
  currentUser: USERS.eyad,
  isLoggedIn: true,
  currentLang: 'ar',
  activeTab: 'map',
  activeZoneFilter: 'all',
  tutoringFilter: 'all',
  parkingSpots: JSON.parse(JSON.stringify(INITIAL_PARKING_SPOTS)),
  tutoringSessions: JSON.parse(JSON.stringify(INITIAL_TUTORING_SESSIONS)),
  facultyMembers: JSON.parse(JSON.stringify(FACULTY_MEMBERS)),
  studyRooms: JSON.parse(JSON.stringify(INITIAL_STUDY_ROOMS)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),

  // Simulator State
  simStep: 0,
  simAutoPlaying: false,
  simTimer: null,

  // Gate Scanner State
  gateStatus: 'idle',
  gateArmOpen: false,
  gateScannedPlate: 'ب ط ك 1234',

  selectedSpot: null,
  activeRoomCountdown: 11 // minutes left in Lab 102
};

// ============================================================================
// Vector Generators
// ============================================================================
function getCarSVG(color = '#116E63') {
  return `
    <svg class="car-svg-icon" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="85" rx="42" ry="70" fill="rgba(0,0,0,0.4)" filter="blur(6px)"/>
      <rect x="18" y="10" width="64" height="135" rx="24" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <path d="M 26 52 Q 50 42 74 52 L 70 76 Q 50 72 30 76 Z" fill="#0c1f1c" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <path d="M 28 114 Q 50 118 72 114 L 68 98 Q 50 101 32 98 Z" fill="#0c1f1c" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <rect x="12" y="55" width="7" height="15" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1"/>
      <rect x="81" y="55" width="7" height="15" rx="3" fill="${color}" stroke="#ffffff" stroke-width="1"/>
      <rect x="23" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9"/>
      <rect x="63" y="14" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9"/>
      <rect x="23" y="136" width="14" height="6" rx="2" fill="#ef4444"/>
      <rect x="63" y="136" width="14" height="6" rx="2" fill="#ef4444"/>
      <rect x="33" y="138" width="34" height="7" rx="1.5" fill="#ffffff"/>
    </svg>
  `;
}

function renderSaudiPlate(plateString) {
  const parts = plateString.split(' ');
  const letters = `${parts[0] || ''} ${parts[1] || ''} ${parts[2] || ''}`;
  const numbers = parts[3] || '';

  return `
    <div class="saudi-license-plate">
      <div class="plate-ksa-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#116E63" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span style="font-size:0.6rem; font-weight:900; color:#116E63; margin-top:2px;">KSA</span>
      </div>
      <div class="plate-letters-ar">${letters}</div>
      <div class="plate-digits-en">${numbers}</div>
    </div>
  `;
}

function getQRSvg(content = 'FBSU-PARK-PASS') {
  return `
    <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white" rx="10"/>
      <rect x="20" y="20" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="28" y="28" width="29" height="29" rx="3" fill="white"/>
      <rect x="34" y="34" width="17" height="17" rx="2" fill="#116E63"/>

      <rect x="135" y="20" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="143" y="28" width="29" height="29" rx="3" fill="white"/>
      <rect x="149" y="34" width="17" height="17" rx="2" fill="#116E63"/>

      <rect x="20" y="135" width="45" height="45" rx="6" fill="#116E63"/>
      <rect x="28" y="143" width="29" height="29" rx="3" fill="white"/>
      <rect x="34" y="149" width="17" height="17" rx="2" fill="#116E63"/>

      <circle cx="80" cy="30" r="4" fill="#116E63"/>
      <circle cx="95" cy="30" r="4" fill="#116E63"/>
      <circle cx="110" cy="40" r="4" fill="#116E63"/>
      <circle cx="80" cy="50" r="4" fill="#116E63"/>
      <circle cx="100" cy="65" r="4" fill="#116E63"/>

      <circle cx="40" cy="85" r="4" fill="#116E63"/>
      <circle cx="60" cy="85" r="4" fill="#116E63"/>
      <circle cx="80" cy="85" r="4" fill="#d7a237"/>
      <circle cx="100" cy="85" r="4" fill="#116E63"/>
      <circle cx="120" cy="85" r="4" fill="#116E63"/>
      <circle cx="140" cy="85" r="4" fill="#116E63"/>
      <circle cx="160" cy="85" r="4" fill="#116E63"/>

      <circle cx="30" cy="105" r="4" fill="#116E63"/>
      <circle cx="60" cy="105" r="4" fill="#116E63"/>
      <circle cx="85" cy="105" r="5" fill="#d7a237"/>
      <circle cx="100" cy="105" r="5" fill="#d7a237"/>
      <circle cx="115" cy="105" r="5" fill="#d7a237"/>
      <circle cx="140" cy="105" r="4" fill="#116E63"/>

      <circle cx="80" cy="130" r="4" fill="#116E63"/>
      <circle cx="100" cy="130" r="4" fill="#116E63"/>
      <circle cx="130" cy="130" r="4" fill="#116E63"/>
      <circle cx="160" cy="130" r="4" fill="#116E63"/>

      <circle cx="80" cy="155" r="4" fill="#116E63"/>
      <circle cx="110" cy="155" r="4" fill="#116E63"/>
      <circle cx="130" cy="165" r="4" fill="#116E63"/>
      <circle cx="150" cy="155" r="4" fill="#116E63"/>
      <circle cx="170" cy="170" r="4" fill="#116E63"/>

      <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#d7a237" stroke-width="2"/>
      <text x="100" y="104" font-size="9" font-weight="900" fill="#116E63" text-anchor="middle" font-family="'Tajawal', sans-serif">FBSU</text>
    </svg>
  `;
}

// ============================================================================
// Simulator Stages (Clean wording without any mention of voice notes)
// ============================================================================
const SIMULATOR_STAGES = [
  {
    step: 0,
    time: '08:00 AM',
    title: 'الصباح: إياد يركن في موقفه #01',
    titleEn: 'Morning: Eyad parks in Spot #01',
    desc: 'وصل الطالب إياد الحربي لحضور محاضرته الأولى في كلية الهندسة (08:00 - 10:00 ص) وركن سيارته كامري في موقفه المخصص #01. زميله راكان المطيري لا يزال في منزله ومحاضرته تبدأ الساعة 10:15 ص وفق جدول (أحد/ثلاثاء).',
    descEn: 'Student Eyad arrived for his first lecture at College of Engineering (08:00 - 10:00 AM) and parked in Spot #01. Student Rakan is at home as his lecture starts at 10:15 AM (Sun/Tue schedule).',
    spot1Status: 'occupied',
    spot1Occupant: 'إياد الحربي',
    spot1Badge: 'مشغول - إياد',
    spot1Plate: 'ب ط ك 1234',
    eyadStatus: 'يحضر المحاضرة',
    rakanStatus: 'في المنزل (محاضرته 10:15)',
    actionText: 'بدء مغادرة إياد للبريك',
    carColor: '#116E63'
  },
  {
    step: 1,
    time: '10:00 AM',
    title: 'إياد يغادر الجامعة في بريك (3 ساعات ونصف)',
    titleEn: 'Eyad leaves for a 3.5h break',
    desc: 'انتهت محاضرة إياد ولديه بريك طويل حتى الساعة 01:30 م. عند خروجه، رصدت كاميرا البوابة (ALPR) سيارته خارجة. قام نظام الذكاء الاصطناعي بتحويل الموقف #01 فوراً إلى "موقف متاح للتبادل الذكي (Flex Share)" بدلاً من تركه فارغاً ومهدوراً طوال اليوم!',
    descEn: 'Eyad finished his morning lecture and has a 3.5h break until 01:30 PM. The gate ALPR camera detected his car exiting. FBSU AI automatically flagged Spot #01 as "Flex Share Available" instead of leaving it wasted all day!',
    spot1Status: 'flex-share',
    spot1Occupant: 'متاح للتبادل (بريك إياد)',
    spot1Badge: 'تبادل ذكي - متاح للزملاء',
    spot1Plate: null,
    eyadStatus: 'غادر الجامعة (بريك 3.5 س)',
    rakanStatus: 'في الطريق إلى الجامعة',
    actionText: 'مطابقة الذكاء الاصطناعي مع راكان',
    carColor: null
  },
  {
    step: 2,
    time: '10:05 AM',
    title: 'خوارزمية الذكاء الاصطناعي تطابق جدول راكان',
    titleEn: 'AI algorithm matches Rakan schedule',
    desc: 'الذكاء الاصطناعي المرتبط بالبوابة الأكاديمية حلل الجداول، واكتشف أن الطالب راكان لديه كلاس الساعة 10:15 ص في كلية الحاسب (ملاصقة للموقف #01). أرسل النظام إشعاراً فورياً لهاتفه: "تم حجز موقف رقم #01 لك حتى 01:00 م بتعرفة ذكية مخفضة 5.75 ر.س/ساعة"!',
    descEn: 'AI parsed academic schedules and found student Rakan has a class at 10:15 AM at Computing College (next to Spot #01). It instantly notified Rakan and reserved Spot #01 for his exact time window (10:15 - 01:00)!',
    spot1Status: 'flex-share',
    spot1Occupant: 'محجوز لراكان (مؤقت)',
    spot1Badge: 'حجز ذكي مؤكد لراكان',
    spot1Plate: 'د ل س 8892',
    eyadStatus: 'في بريك (يحصل على رصيد محفظة)',
    rakanStatus: 'تم توجيهه إلى موقف #01',
    actionText: 'وصول سيارة راكان إلى البوابة',
    carColor: '#0b6d87'
  },
  {
    step: 3,
    time: '10:15 AM',
    title: 'وصول راكان: كاميرا البوابة تتعرف على اللوحة وترفع الحاجز',
    titleEn: 'Rakan arrives: ALPR scans plate & opens gate',
    desc: 'وصل راكان إلى بوابة الجامعة الرئيسية. كاميرا الذكاء الاصطناعي قرأت لوحته (د ل س 8892)، تحققت من الحجز الذكي، ورفعت ذراع البوابة تلقائياً مع شاشة إرشادية: "أهلاً راكان - توجه للموقف #01". ركن راكان في ثوانٍ دون البحث أو الدوران في المواقف!',
    descEn: 'Rakan arrived at the main gate. The AI camera scanned his plate (D L S 8892), validated his flex pass, and lifted the barrier automatically. Rakan parked in seconds without searching!',
    spot1Status: 'occupied',
    spot1Occupant: 'راكان المطيري',
    spot1Badge: 'مشغول - راكان',
    spot1Plate: 'د ل س 8892',
    eyadStatus: 'بريك خارجي مستمر',
    rakanStatus: 'راكن في الموقف #01',
    actionText: 'انتهاء راكان وعودة إياد',
    carColor: '#0b6d87'
  },
  {
    step: 4,
    time: '01:30 PM',
    title: 'راكان يغادر وإياد يعود ويكسب 17.25 ر.س!',
    titleEn: 'Rakan leaves, Eyad returns & earns 17.25 SAR!',
    desc: 'غادر راكان الساعة 01:00 م بعد انتهاء محاضرته. عاد إياد الساعة 01:30 م لحضور محاضرته المسائية ليجد موقفه جاهزاً ونظيفاً! والأروع: أضاف النظام 17.25 ر.س كاش في محفظة إياد مكافأة لمشاركة موقفه (مما خفض تكلفة اشتراكه الشهري بنسبة 50%)!',
    descEn: 'Rakan finished class and left at 01:00 PM. Eyad returned at 01:30 PM to find his spot ready. Best of all: the system credited 17.25 SAR to Eyad’s university wallet for sharing, saving him 50% on his monthly pass!',
    spot1Status: 'occupied',
    spot1Occupant: 'إياد الحربي (مكافأة 17.25 ر.س)',
    spot1Badge: 'إياد - ربح 17.25 ر.س',
    spot1Plate: 'ب ط ك 1234',
    eyadStatus: 'عاد للموقف + رصيد +17.25 ر.س',
    rakanStatus: 'أنهى يومه بنجاح ودون عناء',
    actionText: 'إعادة تشغيل المحاكاة',
    carColor: '#116E63'
  }
];

// ============================================================================
// Category Sub-Navigation Helper (1-Click Peer Switcher)
// ============================================================================
function renderCategorySubnav(isAr) {
  const isParkingCategory = ['map', 'booking', 'simulator', 'gate', 'share'].includes(appState.activeTab);
  const isCampusCategory = ['tutoring', 'office-hours', 'rooms'].includes(appState.activeTab);

  if (isParkingCategory) {
    return `
      <div class="category-subnav-container">
        <div class="category-subnav-pills">
          <div class="subnav-category-badge">
            ${createIcon('car', { size: 14, color: 'var(--fbsu-teal)' })}
            <span>${isAr ? 'منظومة المواقف الذكية' : 'Smart Parking Suite'}</span>
          </div>
          <button class="subnav-chip-btn ${appState.activeTab === 'map' ? 'active' : ''}" data-tab="map">
            ${createIcon('mapPin', { size: 13 })}
            <span>${isAr ? 'خريطة المواقف الحية' : 'Live Map'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'booking' ? 'active' : ''}" data-tab="booking">
            ${createIcon('calendar', { size: 13 })}
            <span>${isAr ? 'حجز موقف وتصريح' : 'Book Spot'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'simulator' ? 'active' : ''}" data-tab="simulator">
            ${createIcon('zap', { size: 13 })}
            <span>${isAr ? 'محاكاة التبادل Flex-Share' : 'Flex Swap Demo'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'gate' ? 'active' : ''}" data-tab="gate">
            ${createIcon('camera', { size: 13 })}
            <span>${isAr ? 'بوابة وكاميرات ALPR' : 'Gate ALPR'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'share' ? 'active' : ''}" data-tab="share">
            ${createIcon('refreshCw', { size: 13 })}
            <span>${isAr ? 'شارك موقفك واربح' : 'Share & Earn'}</span>
          </button>
        </div>
      </div>
    `;
  }

  if (isCampusCategory) {
    return `
      <div class="category-subnav-container">
        <div class="category-subnav-pills">
          <div class="subnav-category-badge" style="border-color:var(--fbsu-gold-border); background:rgba(215,162,55,0.12);">
            ${createIcon('bookOpen', { size: 14, color: 'var(--fbsu-gold)' })}
            <span style="color:var(--fbsu-gold);">${isAr ? 'الحرم الجامعي والأنشطة الطلابية' : 'Smart Campus Hub'}</span>
          </div>
          <button class="subnav-chip-btn ${appState.activeTab === 'tutoring' ? 'active' : ''}" data-tab="tutoring">
            ${createIcon('users', { size: 13 })}
            <span>${isAr ? 'النشاط الطلابي والتدريس (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'office-hours' ? 'active' : ''}" data-tab="office-hours">
            ${createIcon('userCheck', { size: 13 })}
            <span>${isAr ? 'الساعات المكتبية للعمداء والرؤساء' : 'Faculty Office Hours'}</span>
          </button>
          <button class="subnav-chip-btn ${appState.activeTab === 'rooms' ? 'active' : ''}" data-tab="rooms">
            ${createIcon('doorClosed', { size: 13 })}
            <span>${isAr ? 'حجز القاعات ومعامل الحاسوب' : 'Labs & Study Pods'}</span>
          </button>
        </div>
      </div>
    `;
  }

  return '';
}

// ============================================================================
// Main Application Renderer
// ============================================================================
function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const user = appState.currentUser;
  const isAr = appState.currentLang === 'ar';

  const totalSpots = appState.parkingSpots.length;
  const availableCount = appState.parkingSpots.filter(s => s.status === 'available').length;
  const flexCount = appState.parkingSpots.filter(s => s.status === 'flex-share').length;

  app.innerHTML = `
    <!-- Top Institutional Ribbon -->
    <div class="uni-ribbon">
      <div class="container ribbon-flex-row">
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span class="ribbon-item">
            <span class="pulse-dot-green"></span>
            <strong>${isAr ? 'جامعة فهد بن سلطان - تبوك' : 'Fahad Bin Sultan University - Tabuk'}</strong>
          </span>
          <span class="ribbon-item" style="color:var(--text-muted);">
            ${createIcon('shieldCheck', { size: 14, color: 'var(--fbsu-primary)' })}
            ${isAr ? 'بوابة المواقف الذكية المعتمدة' : 'Official Smart Campus Gateway'}
          </span>
          <span class="ribbon-item" style="color:var(--fbsu-gold);">
            <span class="pulse-dot-gold"></span>
            ${isAr ? 'التبادل الذكي نشط: ' + flexCount + ' مواقف متاحة للتبادل' : 'Flex Active: ' + flexCount + ' spots open'}
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span class="ribbon-item">
            ${createIcon('calendar', { size: 14, color: 'var(--fbsu-gold)' })}
            ${isAr ? 'الفصل الدراسي الأول 1448 هـ' : 'Academic Term 1448H'}
          </span>
          <span class="ribbon-item">
            ${createIcon('clock', { size: 14, color: 'var(--text-muted)' })}
            <span id="live-time-clock">--:--:--</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Main Header (Ultra-Responsive Mobile & Desktop Design) -->
    <header class="main-header">
      <div class="header-compact-container">
        <!-- Right Group: University Brand & Navigation Menu (يمين الهيدر) -->
        <div class="header-right-group">
          <div class="brand-section">
            <img src="./assets/branding/fbsu-logo.png" alt="شعار جامعة فهد بن سلطان" class="brand-logo-img" />
            <h1 class="brand-uni-name">${isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}</h1>
          </div>

          <!-- Grouped Responsive Navigation Menu -->
          <nav class="nav-menu">
            <!-- Group 1: Smart Parking Services Dropdown -->
            <div class="nav-dropdown-group" id="parking-dropdown-group">
              <button class="nav-item nav-dropdown-trigger ${['map', 'booking', 'simulator', 'gate', 'share'].includes(appState.activeTab) ? 'active' : ''}" id="parking-menu-btn" title="${isAr ? 'خدمات المواقف الذكية' : 'Smart Parking Suite'}">
                ${createIcon('car', { size: 14 })}
                <span>${isAr ? 'المواقف الذكية' : 'Smart Parking'}</span>
                ${createIcon('chevronDown', { size: 12, className: 'dropdown-arrow' })}
              </button>
              <div class="nav-dropdown-menu">
                <button class="dropdown-item ${appState.activeTab === 'map' ? 'active' : ''}" data-tab="map">
                  ${createIcon('mapPin', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'خريطة المواقف الحية' : 'Live Map'}</span>
                    <span class="dropdown-item-desc">${isAr ? '30 موقفاً وحساسات إنترنت الأشياء' : '30 Bays & IoT'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'booking' ? 'active' : ''}" data-tab="booking">
                  ${createIcon('calendar', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'حجز موقف وتصريح ذكي' : 'Book Parking'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'تصريح رقمي FBSU Pass فوري' : 'Digital QR & NFC'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'simulator' ? 'active' : ''}" data-tab="simulator">
                  ${createIcon('zap', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'محاكاة التبادل Flex-Share' : 'Flex Swap Demo'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'سيناريو بريك إياد وراكان' : 'Break Swap'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'gate' ? 'active' : ''}" data-tab="gate">
                  ${createIcon('camera', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'كاميرات وقارئ اللوحات ALPR' : 'Gate ALPR'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'رؤية حاسوبية وبوابة آلية' : 'Optical Plate Reader'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'share' ? 'active' : ''}" data-tab="share">
                  ${createIcon('refreshCw', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'شارك موقفك واربح' : 'Share & Earn'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'كاش باك 17.25 ر.س بالمحفظة' : '17.25 SAR per break'}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Group 2: Smart Campus & Student Hub Dropdown -->
            <div class="nav-dropdown-group" id="campus-dropdown-group">
              <button class="nav-item nav-dropdown-trigger ${['tutoring', 'office-hours', 'rooms'].includes(appState.activeTab) ? 'active' : ''}" id="campus-menu-btn" title="${isAr ? 'الحرم الجامعي والأنشطة الأكاديمية' : 'Campus Hub'}">
                ${createIcon('bookOpen', { size: 14 })}
                <span>${isAr ? 'الحرم والأنشطة' : 'Campus Hub'}</span>
                <span class="nav-highlight-dot"></span>
                ${createIcon('chevronDown', { size: 12, className: 'dropdown-arrow' })}
              </button>
              <div class="nav-dropdown-menu">
                <button class="dropdown-item ${appState.activeTab === 'tutoring' ? 'active' : ''}" data-tab="tutoring">
                  ${createIcon('users', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'النشاط الطلابي والتدريس (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'حصص تقوية وسداد الرسوم الجامعية' : 'Lectures & tuition fee offset'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'office-hours' ? 'active' : ''}" data-tab="office-hours">
                  ${createIcon('userCheck', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'الساعات المكتبية للعمداء والرؤساء' : 'Faculty Office Hours'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'د. رغد النفيعي ود. محمد مزهر' : 'Dr. Raghad & Dr. Mezher'}</span>
                  </div>
                </button>
                <button class="dropdown-item ${appState.activeTab === 'rooms' ? 'active' : ''}" data-tab="rooms">
                  ${createIcon('doorClosed', { size: 14 })}
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-title">${isAr ? 'حجز القاعات ومعامل الحاسوب' : 'Labs & Study Pods'}</span>
                    <span class="dropdown-item-desc">${isAr ? 'إياد، راكان، عبد العزيز ومؤقت المغادرة' : 'Teamwork & countdown timer'}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Direct Tab: Analytics -->
            <button class="nav-item ${appState.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" title="${isAr ? 'مؤشرات الأداء والتحليلات' : 'Analytics'}">
              ${createIcon('barChart3', { size: 14 })}
              <span>${isAr ? 'التحليلات' : 'Analytics'}</span>
            </button>
          </nav>
        </div>

        <!-- Left Group: Utilities, Wallet, Profile & Figma Link (شمال الهيدر) -->
        <div class="header-left-cluster">
          <div class="system-utilities-capsule">
            <button class="utility-pill-btn ${soundFX.enabled ? 'sound-active' : ''}" id="sound-toggle-btn" title="${soundFX.enabled ? (isAr ? 'كتم المؤثرات الصوتية' : 'Mute Sound Effects') : (isAr ? 'تشغيل المؤثرات الصوتية' : 'Enable Sound Effects')}">
              ${soundFX.enabled ? createIcon('volume2', { size: 14 }) : createIcon('volumeX', { size: 14 })}
              <span class="utility-text-label">${soundFX.enabled ? (isAr ? 'صوت' : 'Sound') : (isAr ? 'صامت' : 'Muted')}</span>
            </button>
            <span class="utility-divider"></span>
            <button class="utility-pill-btn" id="lang-toggle-btn" title="${isAr ? 'التحويل إلى اللغة الإنجليزية' : 'Switch to Arabic'}">
              ${createIcon('globe', { size: 14 })}
              <span class="utility-text-label" style="font-weight:800; font-size:0.75rem;">${isAr ? 'EN' : 'عربي'}</span>
            </button>
            <span class="utility-divider"></span>
            <button class="utility-pill-btn" id="theme-toggle-btn" title="${isAr ? 'تبديل المظهر النهاري / الليلي' : 'Toggle Day/Night Theme'}">
              ${document.body.classList.contains('theme-light') ? createIcon('sun', { size: 14, color: 'var(--fbsu-gold)' }) : createIcon('moon', { size: 14 })}
              <span class="utility-text-label">${isAr ? (document.body.classList.contains('theme-light') ? 'نهاري' : 'ليلي') : (document.body.classList.contains('theme-light') ? 'Light' : 'Dark')}</span>
            </button>
          </div>

          <!-- Direct Notifications Button -->
          <button class="wallet-badge-btn" id="open-notifications-btn" title="${isAr ? 'الإشعارات الأكاديمية المباشرة للدكاترة والطلاب' : 'Direct Campus Alerts'}" style="background:rgba(215, 162, 55, 0.12); border-color:var(--fbsu-gold-border); gap:0.4rem;">
            ${createIcon('bell', { size: 14, color: 'var(--fbsu-gold)' })}
            <span style="font-size:0.78rem; font-weight:800; color:var(--fbsu-gold);">${appState.notifications.filter(n => !n.read).length || 3}</span>
          </button>

          <!-- Wallet Button -->
          <button class="wallet-badge-btn" id="open-wallet-btn" title="${isAr ? 'رصيد المحفظة وسداد الرسوم' : 'University Balance & Tuition'}">
            ${createIcon('wallet', { size: 13, color: 'var(--fbsu-gold)' })}
            <span>${user.walletBalance.toFixed(2)} ر.س</span>
          </button>

          <!-- Auth / Profile Button -->
          <button class="auth-btn-header" id="open-auth-btn" title="${isAr ? 'الملف الشخصي وتبديل المستخدم' : 'Academic Profile'}">
            <span style="width:8px; height:8px; border-radius:50%; background:${user.avatarColor || '#116E63'}; display:inline-block;"></span>
            <span>${user.name.split(' ')[0]} (${user.role.split(' ')[0]})</span>
          </button>

          <!-- Figma UI/UX Showcase Link Button -->
          <a href="./index.html" class="showcase-nav-btn" title="${isAr ? 'استعراض لوحة فيجما وتوثيق UI/UX' : 'Open Figma Showcase'}">
            <svg width="12" height="12" viewBox="0 0 38 57" fill="none"><path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/><path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/><path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/><path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/><path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/></svg>
            <span>${isAr ? 'معرض فيجما' : 'Figma System'}</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Body Container -->
    <main>
      ${renderHeroSection(isAr, totalSpots, availableCount, flexCount)}
      
      <div class="container" style="margin-top:2.5rem;">
        ${renderCategorySubnav(isAr)}
        ${appState.activeTab === 'map' ? renderParkingMapTab(isAr) : ''}
        ${appState.activeTab === 'tutoring' ? renderTutoringTab(isAr) : ''}
        ${appState.activeTab === 'office-hours' ? renderOfficeHoursTab(isAr) : ''}
        ${appState.activeTab === 'rooms' ? renderRoomsTab(isAr) : ''}
        ${appState.activeTab === 'simulator' ? renderSimulatorTab(isAr) : ''}
        ${appState.activeTab === 'gate' ? renderGateScannerTab(isAr) : ''}
        ${appState.activeTab === 'booking' ? renderBookingTab(isAr) : ''}
        ${appState.activeTab === 'share' ? renderShareTab(isAr) : ''}
        ${appState.activeTab === 'analytics' ? renderAnalyticsTab(isAr) : ''}
      </div>
    </main>

    <!-- Footer -->
    ${renderFooter(isAr)}

    <!-- Dynamic Modals Container -->
    <div id="modal-container"></div>
  `;

  updateLiveClock();
  attachEventListeners();
}

// ============================================================================
// Hero Section
// ============================================================================
function renderHeroSection(isAr, totalSpots, availableCount, flexCount) {
  return `
    <section class="hero-section">
      <div class="hero-backdrop"></div>
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-tag">
              ${createIcon('sparkles', { size: 14, color: '#38c2b0' })}
              <span>${isAr ? 'مبادرة التحول الرقمي بالذكاء الاصطناعي - جامعة فهد بن سلطان' : 'AI Digital Transformation - FBSU Campus'}</span>
            </div>
            <h2 class="hero-title">
              ${isAr
      ? 'مواقف ذكية بتبادل مرن تلقائي <span class="highlight">دون إهدار لأي موقف</span>'
      : 'Smart Parking with AI Flex Sharing <span class="highlight">Zero Wasted Spaces</span>'
    }
            </h2>
            <p class="hero-desc">
              ${isAr
      ? 'حل هندسي متكامل ينهي أزمة مواقف الجامعة: عندما يغادر الطالب في أوقات البريك (2-4 ساعات)، يتعرف النظام تلقائياً على خروجه عبر كاميرات قراءة اللوحات (ALPR) ويفتح الموقف لزميله القادم للمحاضرة، مع كسب رصيد مكافأة وحجز متوافق مع جداول الكليات!'
      : 'An intelligent platform solving campus parking congestion: when a student leaves during breaks (2-4 hrs), AI ALPR cameras detect departure and dynamically reallocate the spot to incoming students based on class schedules, earning cashback rewards!'
    }
            </p>
            <div class="hero-cta-group">
              <button class="btn-primary" id="hero-explore-map-btn">
                ${createIcon('mapPin', { size: 18, color: '#ffffff' })}
                <span>${isAr ? 'خريطة المواقف' : 'Explore Parking'}</span>
              </button>
              <button class="btn-gold" id="hero-quick-tutoring-btn">
                ${createIcon('bookOpen', { size: 18, color: '#0b1a17' })}
                <span>${isAr ? 'شروحات الأقران (70 ر.س)' : 'Peer Tutoring (70 SAR)'}</span>
              </button>
              <button class="btn-outline" id="hero-quick-office-btn">
                ${createIcon('userCheck', { size: 18 })}
                <span>${isAr ? 'الساعات المكتبية (د. رغد ود. محمد مزهر)' : 'Office Hours'}</span>
              </button>
              <button class="btn-outline" id="hero-quick-rooms-btn">
                ${createIcon('doorClosed', { size: 18 })}
                <span>${isAr ? 'حجز القاعات والمعامل' : 'Study Pods & Labs'}</span>
              </button>
            </div>
          </div>

          <!-- Feature Showcase Card -->
          <div class="glass-panel" style="padding:1.75rem; border-color:var(--fbsu-primary-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.85rem; margin-bottom:1.25rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center;">
                  ${createIcon('sparkles', { size: 22, color: 'var(--fbsu-primary)' })}
                </div>
                <div>
                  <h3 style="font-size:1.05rem; font-weight:800; color:var(--text-main);">${isAr ? 'مبدأ التبادل الذكي (Flex Share)' : 'Smart Flex Share Logic'}</h3>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'نموذج محاكاة واقعي للتبادل الذكي بين الطلاب' : 'Realistic Student Flex Sharing Model'}</span>
                </div>
              </div>
              <span class="badge badge-flex">
                ${createIcon('zap', { size: 13, color: 'var(--fbsu-gold)' })}
                ${isAr ? 'نشط الآن' : 'Active'}
              </span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  1
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">رصد خروج إياد بالذكاء الاصطناعي</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">كاميرا البوابة تقرأ لوحة (ب ط ك 1234) وترصد خروج إياد في بريك 3 ساعات.</div>
                </div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  2
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">تحويل الموقف #01 إلى "تبادل ذكي"</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">بدل إهدار الموقف فارغاً، يفتحه النظام تلقائياً لمن لديه كلاس بنفس التوقيت.</div>
                </div>
              </div>

              <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.95rem; display:flex; align-items:center; gap:0.85rem;">
                <div style="width:30px; height:30px; border-radius:50%; background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
                  3
                </div>
                <div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--text-main);">توجيه راكان وربح إياد للمكافأة</div>
                  <div style="font-size:0.78rem; color:var(--text-muted);">راكان يركن فور وصوله، وإياد يكسب 17.25 ر.س في محفظته الجامعية!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero Stats Banner -->
        <div class="hero-stats-banner">
          <div class="stat-chip">
            <div class="stat-chip-icon">
              ${createIcon('car', { size: 22, color: 'var(--fbsu-primary)' })}
            </div>
            <div>
              <div class="stat-chip-num">${totalSpots}</div>
              <div class="stat-chip-label">${isAr ? 'إجمالي مواقف القطاع' : 'Total Pilot Bays'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon" style="background:var(--status-available-bg); color:var(--status-available);">
              ${createIcon('checkCircle2', { size: 22, color: 'var(--status-available)' })}
            </div>
            <div>
              <div class="stat-chip-num" style="color:var(--status-available);">${availableCount}</div>
              <div class="stat-chip-label">${isAr ? 'مواقف شاغرة الآن' : 'Available Right Now'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon" style="background:var(--fbsu-gold-light); color:var(--fbsu-gold);">
              ${createIcon('refreshCw', { size: 22, color: 'var(--fbsu-gold)' })}
            </div>
            <div>
              <div class="stat-chip-num" style="color:var(--fbsu-gold);">${flexCount}</div>
              <div class="stat-chip-label">${isAr ? 'مواقف بالتبادل الذكي' : 'In Flex Mode'}</div>
            </div>
          </div>

          <div class="stat-chip">
            <div class="stat-chip-icon">
              ${createIcon('shieldCheck', { size: 22, color: 'var(--fbsu-primary)' })}
            </div>
            <div>
              <div class="stat-chip-num">99.4%</div>
              <div class="stat-chip-label">${isAr ? 'دقة قارئ اللوحات' : 'ALPR Accuracy'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ============================================================================
// Tab 1: Live Interactive 30-Spot Parking Lot Grid
// ============================================================================
function renderParkingMapTab(isAr) {
  const filter = appState.activeZoneFilter;
  const filteredSpots = appState.parkingSpots.filter(spot => {
    if (filter === 'all') return true;
    return spot.zone === filter;
  });

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('mapPin', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'خريطة المواقف التفاعلية' : 'Interactive Map'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان (30 موقف)' : 'FBSU Live Digital Parking Lot (30 Bays)'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'عرض لحظي لحالة الحساسات الأرضية وكاميرات الرؤية الحاسوبية. اضغط على أي موقف لعرض التفاصيل الكاملة، أو حجزه، أو تفعيل التبادل الذكي!'
      : 'Real-time sensor & computer vision status. Click any bay to view details, reserve, or initiate AI flex exchange!'
    }
      </p>
    </div>

    <!-- Parking Toolbar: Filters & Legend -->
    <div class="parking-toolbar">
      <div class="zone-filter-tabs">
        <button class="zone-btn ${filter === 'all' ? 'active' : ''}" data-zone="all">
          ${createIcon('building2', { size: 14 })}
          <span>${isAr ? 'جميع القطاعات (30 موقف)' : 'All Zones (30)'}</span>
        </button>
        <button class="zone-btn ${filter === 'A' ? 'active' : ''}" data-zone="A">
          <span>${isAr ? 'قطاع A - الحاسب والهندسة' : 'Zone A - Computing & Eng'}</span>
        </button>
        <button class="zone-btn ${filter === 'B' ? 'active' : ''}" data-zone="B">
          <span>${isAr ? 'قطاع B - إدارة الأعمال والطب' : 'Zone B - Business & Med'}</span>
        </button>
        <button class="zone-btn ${filter === 'C' ? 'active' : ''}" data-zone="C">
          <span>${isAr ? 'قطاع C - كادر التدريس' : 'Zone C - Faculty VIP'}</span>
        </button>
        <button class="zone-btn ${filter === 'D' ? 'active' : ''}" data-zone="D">
          <span>${isAr ? 'قطاع D - شحن كهربائي EV' : 'Zone D - EV Charging'}</span>
        </button>
      </div>

      <div class="legend-list">
        <div class="legend-item"><span class="legend-chip avail"></span> ${isAr ? 'متاح' : 'Available'}</div>
        <div class="legend-item"><span class="legend-chip occ"></span> ${isAr ? 'مشغول' : 'Occupied'}</div>
        <div class="legend-item"><span class="legend-chip flx"></span> ${isAr ? 'تبادل ذكي (بريك)' : 'AI Flex (Break)'}</div>
        <div class="legend-item"><span class="legend-chip res"></span> ${isAr ? 'محجوز لك' : 'Your Spot'}</div>
        <div class="legend-item"><span class="legend-chip fac"></span> ${isAr ? 'أعضاء التدريس' : 'Faculty'}</div>
      </div>
    </div>

    <!-- 2D/3D Parking Lot Canvas -->
    <div class="parking-lot-canvas">
      <!-- Simulated Campus Road Signage -->
      <div class="campus-road-header">
        <div style="display:flex; align-items:center; gap:0.4rem;">
          ${createIcon('arrowUp', { size: 14, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'طريق الملك خالد - بوابة الحرم الجامعي الرئيسية' : 'King Khalid Road - Main Gate'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.4rem; color:var(--fbsu-gold);">
          ${createIcon('shieldCheck', { size: 14, color: 'var(--fbsu-gold)' })}
          <span>${isAr ? 'مزامنة إنترنت الأشياء IoT نشطة' : 'IoT Real-time Sync Active'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          ${createIcon('arrowDown', { size: 14, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'مبنى كلية الهندسة والحاسب الآلي' : 'College of Engineering & Computing'}</span>
        </div>
      </div>

      <!-- Bays Grid -->
      <div class="parking-bays-container">
        ${filteredSpots.map(spot => renderSpotCard(spot, isAr)).join('')}
      </div>
    </div>
  `;
}

function renderSpotCard(spot, isAr) {
  let statusClass = 'available';
  let badgeText = isAr ? 'متاح الآن' : 'Available';
  let statusColor = 'var(--status-available)';
  let subInfo = isAr ? 'احجز الآن' : 'Reserve now';

  if (spot.status === 'occupied') {
    statusClass = 'occupied';
    badgeText = isAr ? 'مشغول' : 'Occupied';
    statusColor = 'var(--status-occupied)';
    subInfo = spot.timeLeft || (isAr ? 'حتى نهاية المحاضرة' : 'Until class end');
  } else if (spot.status === 'flex-share') {
    statusClass = 'flex-share';
    badgeText = isAr ? 'تبادل ذكي' : 'AI Flex Share';
    statusColor = 'var(--fbsu-gold)';
    subInfo = isAr ? 'متاح خلال البريك' : 'Available during break';
  } else if (spot.status === 'faculty-spot') {
    statusClass = 'faculty-spot';
    badgeText = isAr ? 'دكاترة' : 'Faculty';
    statusColor = 'var(--status-faculty)';
    subInfo = isAr ? 'مخصص للكادر' : 'Staff Only';
  }

  if (appState.currentUser && appState.currentUser.primarySpot === spot.id) {
    statusClass += ' reserved-user';
  }

  let visualCenter = '';
  if (spot.status === 'occupied' || spot.status === 'faculty-spot') {
    const carColor = spot.id === 1 ? '#116E63' : (spot.id === 2 ? '#0b6d87' : (spot.isFaculty ? '#8b5cf6' : '#d97706'));
    visualCenter = getCarSVG(carColor);
  } else if (spot.status === 'flex-share') {
    visualCenter = `
      <div style="text-align:center; padding:0.6rem 0;">
        ${createIcon('refreshCw', { size: 32, color: 'var(--fbsu-gold)' })}
        <span style="font-size:0.7rem; color:var(--fbsu-gold); font-weight:800; display:block; margin-top:0.35rem;">AI FLEX</span>
      </div>
    `;
  } else {
    visualCenter = `
      <div style="width:40px; height:68px; border:1.5px dashed var(--border-subtle); border-radius:6px; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:0.75rem; font-weight:800;">
        ${spot.isEV ? createIcon('zap', { size: 18, color: 'var(--fbsu-primary)' }) : (spot.isAccessible ? createIcon('shieldCheck', { size: 18 }) : 'P')}
      </div>
    `;
  }

  return `
    <div class="parking-spot-card ${statusClass}" data-spot-id="${spot.id}">
      <div class="spot-top-meta">
        <span class="spot-number">#${String(spot.id).padStart(2, '0')}</span>
        <span class="spot-zone-badge">${spot.zone} - ${spot.college}</span>
      </div>

      <div class="spot-visual-center">
        ${visualCenter}
      </div>

      <div class="spot-bottom-status">
        <span class="status-text" style="color:${statusColor};">${badgeText}</span>
        <span class="status-sub-info">${spot.occupant || subInfo}</span>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 2: The Eyad & Rakan AI Sharing Simulator
// ============================================================================
function renderSimulatorTab(isAr) {
  const stage = SIMULATOR_STAGES[appState.simStep];

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('zap', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'المحاكي التفاعلي الذكي' : 'Interactive AI Simulator'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'المحاكاة الذكية للتبادل المرن بين الطلاب (نموذج إياد وراكان)' : 'Smart Student Flex Swapping Simulation'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'محاكاة هندسية دقيقة لكيفية القضاء على الشواغر المهدورة: عندما يغادر الطالب في بريك دراسي، يُعاد تخصيص الموقف تلقائياً لزميله المحتاج مع ضمان عدم حدوث أي تعارض!'
      : 'Zero-conflict automated parking slot reallocation when students depart during campus breaks.'
    }
      </p>
    </div>

    <div class="simulator-box">
      <!-- 5-Step Timeline Navigation -->
      <div class="sim-timeline-bar">
        ${SIMULATOR_STAGES.map((s, idx) => `
          <button class="sim-step-btn ${idx === appState.simStep ? 'current' : (idx < appState.simStep ? 'completed' : '')}" data-sim-step="${idx}">
            <span class="sim-time-tag">${s.time}</span>
            <span class="sim-label">${idx + 1}. ${isAr ? s.title.split(':')[0] : 'Step ' + (idx + 1)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Simulator Viewport -->
      <div class="sim-viewport-grid">
        <!-- Visual Stage: Spot #01 Live State -->
        <div class="sim-visual-stage">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span class="badge badge-gold">
                ${createIcon('mapPin', { size: 13, color: 'var(--fbsu-gold)' })}
                <span>${isAr ? 'موقف رقم #01 - كلية الهندسة والحاسب' : 'Bay #01 - Engineering & Computing'}</span>
              </span>
              <span class="badge ${stage.spot1Status === 'occupied' ? 'badge-occupied' : 'badge-flex'}">
                ${stage.spot1Badge}
              </span>
            </div>

            <!-- Spotlight Visual -->
            <div class="sim-spot-spotlight ${stage.spot1Status === 'occupied' ? 'occupied' : 'flex-active'}">
              <div style="font-size:0.8rem; font-weight:800; color:var(--text-muted); margin-bottom:0.5rem; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                ${createIcon('camera', { size: 14, color: 'var(--fbsu-primary)' })}
                <span>${isAr ? 'المستشعر الأرضي وكاميرا الرؤية الحاسوبية' : 'IoT Bay Sensor & Vision'}</span>
              </div>

              ${stage.carColor ? `
                <div style="width:120px; height:180px; margin:0.85rem auto;">
                  ${getCarSVG(stage.carColor)}
                </div>
                <div style="font-weight:800; font-size:1.1rem; color:var(--text-main); margin-top:0.35rem;">${stage.spot1Occupant}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                  <span>${isAr ? 'اللوحة المسجلة:' : 'Registered Plate:'} <strong>${stage.spot1Plate}</strong></span>
                </div>
              ` : `
                <div style="height:180px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem;">
                  ${createIcon('refreshCw', { size: 44, color: 'var(--fbsu-gold)' })}
                  <div style="font-weight:800; font-size:1.1rem; color:var(--fbsu-gold);">
                    ${isAr ? 'الموقف شاغر ومتاح للتبادل الذكي' : 'Vacant & Open for AI Flex Share'}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">
                    ${isAr ? 'نافذة التبادل: من 10:00 ص إلى 01:30 م (3.5 ساعات)' : 'Flex Window: 10:00 AM - 01:30 PM (3.5 hrs)'}
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Quick Metrics inside simulator -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:1.5rem;">
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--status-available);">+100%</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'استغلال السعة' : 'Capacity Boost'}</div>
              </div>
            </div>
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--fbsu-gold);">${appState.simStep === 4 ? '17.25 ر.س' : '0.00 ر.س'}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'أرباح إياد (محفظة)' : 'Eyad Cashback'}</div>
              </div>
            </div>
            <div class="stat-chip" style="padding:0.75rem;">
              <div>
                <div style="font-size:1.2rem; font-weight:800; color:var(--fbsu-primary);">0 دقيقة</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${isAr ? 'وقت بحث راكان' : 'Search Time for Rakan'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Narrative & Participants Status Panel -->
        <div style="display:flex; flex-direction:column; justify-content:space-between;">
          <div class="sim-narrative-box">
            <div class="sim-narrative-title">
              ${createIcon('clock', { size: 18, color: 'var(--fbsu-gold)' })}
              <span>${stage.time} - ${isAr ? stage.title : stage.titleEn}</span>
            </div>
            <p class="sim-narrative-text">
              ${isAr ? stage.desc : stage.descEn}
            </p>
          </div>

          <!-- Participants Status Cards -->
          <div class="sim-participants-row">
            <div class="participant-card ${stage.step === 0 || stage.step === 4 ? 'active' : ''}">
              <div class="participant-avatar-icon">
                ${createIcon('graduationCap', { size: 20, color: '#ffffff' })}
              </div>
              <div class="participant-info">
                <h4>إياد الحربي (هندسة)</h4>
                <p>الحالة: <strong>${stage.eyadStatus}</strong></p>
                <p style="color:var(--fbsu-gold);">موقفه الأساسي: #01</p>
              </div>
            </div>

            <div class="participant-card ${stage.step === 2 || stage.step === 3 ? 'active' : ''}">
              <div class="participant-avatar-icon" style="background:#0b6d87;">
                ${createIcon('user', { size: 20, color: '#ffffff' })}
              </div>
              <div class="participant-info">
                <h4>راكان المطيري (حاسب)</h4>
                <p>الحالة: <strong>${stage.rakanStatus}</strong></p>
                <p style="color:var(--fbsu-primary);">كلاسه: 10:15 ص</p>
              </div>
            </div>
          </div>

          <!-- Simulation Controls -->
          <div class="sim-controls-footer">
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-outline" id="sim-prev-btn" ${appState.simStep === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                ${createIcon('arrowRight', { size: 16 })}
                <span>${isAr ? 'السابق' : 'Previous'}</span>
              </button>
              <button class="btn-gold" id="sim-next-btn">
                <span>${stage.actionText}</span>
                ${createIcon('arrowLeft', { size: 16, color: '#0b1a17' })}
              </button>
            </div>

            <button class="btn-primary" id="sim-autoplay-btn">
              ${appState.simAutoPlaying ? createIcon('pause', { size: 16, color: '#ffffff' }) : createIcon('play', { size: 16, color: '#ffffff' })}
              <span>${appState.simAutoPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل تلقائي' : 'Auto Play')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 3: AI Gate & ALPR License Plate Camera Simulator
// ============================================================================
function renderGateScannerTab(isAr) {
  const isGranted = appState.gateStatus === 'granted';
  const isScanning = appState.gateStatus === 'scanning';

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('camera', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'محاكي بوابات الجامعة والذكاء الاصطناعي' : 'Gate & ALPR Computer Vision'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'نظام التعرف التلقائي على اللوحات (ALPR) وفتح البوابات الذكي' : 'Automated License Plate Recognition & Smart Barrier'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'كاميرات عالية الدقة مثبتة على البوابات الرئيسية لجامعة فهد بن سلطان تحلل لوحات السيارات، تتحقق من الحجوزات والتبادل الذكي، وترفع الحواجز دون الحاجة للتوقف أو إبراز بطاقات!'
      : 'High-speed AI cameras at FBSU main gates recognize Saudi license plates, verify schedule permits and flex slots, and lift the barrier seamlessly!'
    }
      </p>
    </div>

    <div class="sim-viewport-grid">
      <!-- Camera Feed Simulated Viewport -->
      <div class="camera-feed-box">
        <div class="camera-header-overlay">
          <div style="display:flex; align-items:center; gap:0.5rem; color:#ff3344; font-weight:800; font-family:var(--font-en);">
            <span style="width:8px; height:8px; background:#ff3344; border-radius:50%;"></span>
            <span>LIVE: CAM-01 (MAIN_NORTH_GATE_FBSU)</span>
          </div>
          <div style="color:var(--text-dim); font-family:var(--font-en); font-size:0.75rem;">
            60 FPS | 4K HDR | MODEL: FBSU-ALPR-v4.2
          </div>
        </div>

        <div class="camera-viewport">
          <div class="cam-target-bracket ${isGranted ? 'locked' : ''}">
            ${isScanning ? '<div class="scan-laser-line"></div>' : ''}
            <div style="position:absolute; top:-22px; right:0; font-size:0.7rem; color:var(--status-available); font-family:var(--font-en); font-weight:800;">
              AI CONFIDENCE: ${isScanning ? 'ANALYZING...' : (isGranted ? '99.8%' : 'READY')}
            </div>
          </div>

          <!-- Saudi Plate Component -->
          ${renderSaudiPlate(appState.gateScannedPlate)}
        </div>

        <!-- Physical Barrier Gate Simulation View -->
        <div class="gate-barrier-stage">
          <div class="barrier-pillar">
            <div class="barrier-led ${appState.gateArmOpen ? 'green' : ''}"></div>
          </div>
          <div class="barrier-arm ${appState.gateArmOpen ? 'open' : ''}"></div>
          <div style="margin-right:2rem; margin-bottom:0.75rem; font-size:0.85rem; font-weight:800; color:${appState.gateArmOpen ? 'var(--status-available)' : '#ef4444'};">
            ${appState.gateArmOpen ? (isAr ? 'البوابة مفتوحة - تفضل بالمرور' : 'GATE OPEN') : (isAr ? 'البوابة مغلقة - بانتظار الفحص' : 'GATE CLOSED')}
          </div>
        </div>
      </div>

      <!-- Controls & AI Recognition Result -->
      <div class="glass-panel" style="padding:1.75rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            ${createIcon('camera', { size: 18, color: 'var(--fbsu-primary)' })}
            <span>${isAr ? 'لوحة تحكم فحص البوابة' : 'Gate Simulator Controls'}</span>
          </h4>

          <div class="form-group">
            <label class="form-label">${isAr ? 'اختر سيارة للتجربة والفحص المباشر:' : 'Select Vehicle to Scan:'}</label>
            <div style="display:grid; grid-template-columns:1fr; gap:0.6rem;">
              <button class="pattern-option ${appState.gateScannedPlate === 'ب ط ك 1234' ? 'selected' : ''}" data-plate="ب ط ك 1234" style="text-align:right;">
                <h5>سيارة الطالب إياد الحربي (كامري)</h5>
                <span>لوحة: <strong>ب ط ك 1234</strong> - موقف #01 (كلية الهندسة)</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'د ل س 8892' ? 'selected' : ''}" data-plate="د ل س 8892" style="text-align:right;">
                <h5>سيارة الطالب راكان المطيري (سوناتا)</h5>
                <span>لوحة: <strong>د ل س 8892</strong> - حجز تبادل ذكي في بريك إياد</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'أ ح م 5501' ? 'selected' : ''}" data-plate="أ ح م 5501" style="text-align:right;">
                <h5>سيارة د. عبد الله الغامدي (جينيسيس)</h5>
                <span>لوحة: <strong>أ ح م 5501</strong> - كادر التدريس - موقف #19</span>
              </button>
              <button class="pattern-option ${appState.gateScannedPlate === 'ق ر ط 9921' ? 'selected' : ''}" data-plate="ق ر ط 9921" style="text-align:right;">
                <h5>سيارة زائر خارجي</h5>
                <span>لوحة: <strong>ق ر ط 9921</strong> - حجز مسبق عبر التطبيق</span>
              </button>
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <button class="btn-primary" id="trigger-scan-btn" style="width:100%; justify-content:center;" ${isScanning ? 'disabled' : ''}>
              ${createIcon('camera', { size: 18, color: '#ffffff' })}
              <span>${isScanning ? (isAr ? 'جاري الفحص والمعالجة...' : 'Scanning...') : (isAr ? 'مسح اللوحة والتحقق بالذكاء الاصطناعي' : 'Scan & Validate Plate')}</span>
            </button>
          </div>
        </div>

        <!-- Result Box -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid ${isGranted ? 'var(--status-available-border)' : 'var(--border-subtle)'}; border-radius:var(--radius-md); padding:1rem; margin-top:1rem;">
          ${isGranted ? `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              ${createIcon('checkCircle2', { size: 28, color: 'var(--status-available)' })}
              <div>
                <h5 style="color:var(--status-available); font-weight:800; font-size:0.95rem;">
                  ${isAr ? 'تم التحقق بنجاح - مرحباً بك في جامعة فهد بن سلطان' : 'Access Granted - Welcome to FBSU'}
                </h5>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
                  ${isAr ? 'اللوحة مصرح لها بالدخول. توجه إلى الموقف المخصص وتم تفعيل إضاءة التوجيه الذكية.' : 'Authorized plate. Proceed to assigned spot with dynamic lighting guide.'}
                </p>
              </div>
            </div>
          ` : `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              ${createIcon('shieldCheck', { size: 28, color: 'var(--text-dim)' })}
              <div>
                <h5 style="color:var(--text-main); font-weight:700; font-size:0.9rem;">
                  ${isAr ? 'بانتظار اقتراب السيارة من البوابة' : 'Waiting for vehicle approach'}
                </h5>
                <p style="font-size:0.78rem; color:var(--text-muted);">
                  ${isAr ? 'اضغط زر المسح أعلاه لتشغيل قارئ الكاميرا ورفع الذراع آلياً.' : 'Click scan above to test ALPR recognition and barrier lifting.'}
                </p>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 4: Booking Wizard & Pricing Calculator
// ============================================================================
function renderBookingTab(isAr) {
  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('calendar', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'حجز موقف جديد' : 'Parking Booking'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'حجز موقف ذكي متوافق مع جدولك الدراسي' : 'Reserve Spot Synchronized with Academic Schedule'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'نظام تعرفة ذكي ومرن مطابق لمعايير المطارات والمواقف الذكية (5.75 ر.س / ساعة، أو سقف يومي 15 ر.س، أو اشتراك شهري مع خصم التبادل الذكي).'
      : 'Flexible tariff structure compliant with Saudi smart parking standards (5.75 SAR/hr, 15 SAR daily cap, or monthly pass with 50% sharing discount).'
    }
      </p>
    </div>

    <div class="booking-split-grid">
      <!-- Booking Form -->
      <div class="glass-panel" style="padding:2rem;">
        <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
          ${createIcon('calendar', { size: 18, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'بيانات الحجز الأكاديمي' : 'Reservation Details'}</span>
        </h4>

        <!-- Academic Schedule Pattern Selector -->
        <div class="form-group">
          <label class="form-label">${isAr ? '1. نظام الجدول الأكاديمي بجامعة فهد بن سلطان:' : '1. FBSU Class Schedule Pattern:'}</label>
          <div class="schedule-pattern-picker" id="pattern-picker">
            <div class="pattern-option selected" data-pattern="sun-tue">
              <h5>الأحد / الثلاثاء</h5>
              <span>محاضرات منتظمة</span>
            </div>
            <div class="pattern-option" data-pattern="mon-wed">
              <h5>الاثنين / الأربعاء</h5>
              <span>محاضرات منتظمة</span>
            </div>
            <div class="pattern-option" data-pattern="thu-labs">
              <h5>الخميس (معامل)</h5>
              <span>أيام اللابات والمختبرات</span>
            </div>
          </div>
        </div>

        <!-- Target College -->
        <div class="form-group">
          <label class="form-label">${isAr ? '2. الكلية المستهدفة (لاختيار أقرب موقف):' : '2. Target College:'}</label>
          <select id="booking-college" class="form-control">
            <option value="computing">كلية الحاسب الآلي (علوم حاسب - هندسة حاسب)</option>
            <option value="engineering">كلية الهندسة (مدنية - كهربائية - ميكانيكية - طاقة متجددة)</option>
            <option value="business">كلية الأعمال والإدارة (تسويق - لوجستيات - محاسبة)</option>
            <option value="medicine">كلية الطب والعلوم الطبية</option>
            <option value="sciences">كلية العلوم والدراسات الإنسانية والقانون</option>
          </select>
        </div>

        <!-- Tariff Plan -->
        <div class="form-group">
          <label class="form-label">${isAr ? '3. نوع الباقة / التعرفة:' : '3. Tariff Plan:'}</label>
          <div class="tariff-picker-grid" id="tariff-picker">
            <div class="pattern-option selected" data-tariff="hourly">
              <h5>بالساعة</h5>
              <span style="color:var(--fbsu-gold);">5.75 ر.س / ساعة</span>
            </div>
            <div class="pattern-option" data-tariff="daily">
              <h5>يومي كامل</h5>
              <span style="color:var(--fbsu-gold);">15.00 ر.س / يوم</span>
            </div>
            <div class="pattern-option" data-tariff="monthly">
              <h5>اشتراك شهري</h5>
              <span style="color:var(--fbsu-gold);">450 ر.س (أو 225 ر.س*)</span>
            </div>
          </div>
        </div>

        <!-- Time Range Picker -->
        <div class="form-group" id="hourly-time-group">
          <label class="form-label">${isAr ? '4. الساعات المطلوبة للموقف:' : '4. Required Hours:'}</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <span style="font-size:0.78rem; color:var(--text-muted);">${isAr ? 'من الساعة:' : 'From:'}</span>
              <input type="time" id="booking-time-from" class="form-control" value="09:00" />
            </div>
            <div>
              <span style="font-size:0.78rem; color:var(--text-muted);">${isAr ? 'إلى الساعة:' : 'To:'}</span>
              <input type="time" id="booking-time-to" class="form-control" value="12:00" />
            </div>
          </div>
        </div>

        <!-- Smart Share Checkbox -->
        <div class="form-group" style="background:var(--fbsu-gold-light); border:1px solid var(--fbsu-gold-border); padding:1rem; border-radius:var(--radius-md);">
          <label style="display:flex; align-items:center; gap:0.6rem; cursor:pointer;">
            <input type="checkbox" id="smart-share-optin" checked style="width:18px; height:18px; accent-color:var(--fbsu-gold);" />
            <div>
              <strong style="color:var(--fbsu-gold); font-size:0.9rem;">
                ${isAr ? 'تفعيل ميزة التبادل الذكي التلقائي (اربح حتى 50% خصم)' : 'Opt-in for AI Flex Sharing (Save up to 50%)'}
              </strong>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">
                ${isAr ? 'عند خروجك من الجامعة في أوقات البريك، يُتاح الموقف لزملائك وتُضاف الأرباح فوراً لمحفظتك.' : 'Whenever you leave campus during breaks, your spot is shared and you earn instant credit.'}
              </p>
            </div>
          </label>
        </div>

        <button class="btn-gold" id="confirm-booking-btn" style="width:100%; justify-content:center; padding:0.95rem;">
          ${createIcon('shieldCheck', { size: 18, color: '#0b1a17' })}
          <span>${isAr ? 'تأكيد الحجز وإصدار التصريح الرقمي الذكي' : 'Confirm & Generate Digital Gate Pass'}</span>
        </button>
      </div>

      <!-- Live Pricing & Order Ticket -->
      <div class="glass-panel" style="padding:2rem; border-color:var(--fbsu-primary-border);">
        <div style="text-align:center; border-bottom:1px dashed var(--border-subtle); padding-bottom:1.25rem; margin-bottom:1.5rem;">
          <img src="./assets/branding/fbsu-logo.png" style="height:38px; margin-bottom:0.5rem;" alt="FBSU" />
          <h4 style="color:var(--text-main); font-weight:800; font-size:1.05rem;">جامعة فهد بن سلطان</h4>
          <span style="font-size:0.75rem; color:var(--fbsu-primary);">فاتورة تصريح المواقف الذكية (Smart Pass Receipt)</span>
        </div>

        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>المركبة المسجلة:</span>
          <strong style="color:var(--text-main);" id="ticket-car">${appState.currentUser.car}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>رقم اللوحة:</span>
          <strong style="color:var(--fbsu-gold); font-family:var(--font-en);" id="ticket-plate">${appState.currentUser.plateLetters} ${appState.currentUser.plateNumbers}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>الموقف المخصص:</span>
          <strong style="color:var(--status-available);">موقف #02 (كلية الحاسب)</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>فترة الحجز:</span>
          <span id="ticket-hours">3 ساعات (09:00 - 12:00)</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>التعرفة الأساسية:</span>
          <span>5.75 ر.س / س</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0; font-size:0.88rem; color:var(--text-muted);">
          <span>خصم التبادل المتوقع:</span>
          <span style="color:var(--status-available);">- 5.75 ر.س</span>
        </div>

        <div style="border-top:1px dashed var(--border-subtle); margin-top:0.75rem; padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; font-size:1.1rem; color:var(--text-main);">الإجمالي المستحق:</span>
          <div style="font-size:1.6rem; font-weight:900; color:var(--fbsu-gold); font-family:var(--font-en);" id="ticket-total-price">11.50 ر.س</div>
        </div>

        <div style="margin-top:1.25rem; font-size:0.75rem; color:var(--text-dim); text-align:center;">
          * متوافق مع نظام الدفع الموحد: مدى، أبل باي، والمحفظة الجامعية.
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// Tab 5: "Share My Spot & Earn"
// ============================================================================
function renderShareTab(isAr) {
  const user = appState.currentUser;

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('refreshCw', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'بوابة التبادل الذكي' : 'Flex Share Portal'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'شارك موقفك في أوقات البريك واربح رصيداً في محفظتك' : 'Share Your Spot During Breaks & Earn Credits'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'الميزة الجوهرية للمشروع: بدل ترك موقفك فارغاً أثناء خروجك في بريك، فعّل وضع المغادرة وسيقوم النظام بتأجيره لزميل يحتاجه ويحوّل الأرباح فوراً لمحفظتك!'
      : 'The core innovation: instead of leaving your spot vacant during long breaks, activate flex share and AI will allocate it to a peer, crediting your wallet immediately!'
    }
      </p>
    </div>

    <div style="max-width:850px; margin:0 auto;" class="glass-panel" style="padding:2.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:1.5rem; margin-bottom:2rem;">
        <div>
          <h4 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">
            ${user.name} (${user.role})
          </h4>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">
            ${isAr ? 'الموقف المسجل لك حالياً: ' : 'Your Assigned Spot: '} 
            <strong style="color:var(--fbsu-gold);">موقف رقم #${user.primarySpot || '01'}</strong>
          </p>
        </div>

        <div style="text-align:left;">
          <span style="font-size:0.8rem; color:var(--text-muted);">${isAr ? 'رصيدك الحالي' : 'Current Balance'}</span>
          <div style="font-size:1.6rem; font-weight:800; color:var(--fbsu-gold);">${user.walletBalance.toFixed(2)} ر.س</div>
        </div>
      </div>

      <!-- Break Selector -->
      <div class="form-group">
        <label class="form-label" style="font-size:0.95rem;">
          ${createIcon('clock', { size: 16, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'كم مدة البريك المتوقعة التي ستغادر فيها الجامعة؟' : 'Expected Break Duration Outside Campus:'}</span>
        </label>
        <div class="break-hours-grid" id="break-hours-picker">
          <div class="pattern-option" data-hours="1">
            <h5>1 ساعة</h5>
            <span>بريك قصير</span>
          </div>
          <div class="pattern-option" data-hours="2">
            <h5>2 ساعتان</h5>
            <span>بريك متوسط</span>
          </div>
          <div class="pattern-option selected" data-hours="3">
            <h5>3 ساعات</h5>
            <span style="color:var(--fbsu-gold);">نموذج البريك المعتاد</span>
          </div>
          <div class="pattern-option" data-hours="4">
            <h5>4 ساعات</h5>
            <span>بريك طويل</span>
          </div>
        </div>
      </div>

      <!-- Calculation Card -->
      <div style="background:var(--fbsu-gold-light); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-lg); padding:1.5rem; margin:1.75rem 0;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h5 style="color:var(--fbsu-gold); font-size:1.05rem; font-weight:800; display:flex; align-items:center; gap:0.45rem;">
              ${createIcon('wallet', { size: 18, color: 'var(--fbsu-gold)' })}
              <span>${isAr ? 'العائد المالي المضاف لمحفظتك الجامعية فوراً:' : 'Direct Wallet Cashback Earning:'}</span>
            </h5>
            <p style="color:var(--text-muted); font-size:0.825rem; margin-top:0.35rem;">
              ${isAr ? 'محسوب وفق تعرفة 5.75 ر.س/ساعة مع ضمان توفير الموقف لك فور عودتك بنسبة 100%.' : 'Calculated at standard 5.75 SAR/hr with guaranteed vacancy upon your return.'}
            </p>
          </div>
          <div style="font-size:2rem; font-weight:900; color:var(--fbsu-gold); font-family:var(--font-en);" id="calculated-earn">
            17.25 ر.س
          </div>
        </div>
      </div>

      <!-- Activation CTA -->
      <button class="btn-gold" id="activate-flex-share-btn" style="width:100%; justify-content:center; padding:1rem; font-size:1rem;">
        ${createIcon('refreshCw', { size: 18, color: '#0b1a17' })}
        <span>${isAr ? 'أنا مغادر الآن - إتاحة موقفي للزملاء وإيداع المكافأة' : 'I am Leaving Now - Activate Flex Share & Earn'}</span>
      </button>
    </div>
  `;
}

// ============================================================================
// Tab 2: Student Peer Tutoring & Academic Activities (الأنشطة والشروحات الطلابية)
// ============================================================================
function renderTutoringTab(isAr) {
  const filter = appState.tutoringFilter;
  const sessions = appState.tutoringSessions.filter(s => {
    if (filter === 'all') return true;
    return s.category === filter;
  });

  const currentUser = appState.currentUser;

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('bookOpen', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'الأنشطة الطلابية وشروحات الأقران' : 'Peer Tutoring & Student Economy'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'منظومة الشروحات الطلابية والرصيد الجامعي الذكي' : 'FBSU Peer Tutoring & Academic Wallet Hub'}</h3>
      <p class="section-subtitle">
        ${isAr
          ? 'منصة رسمية تتيح للطلاب المتميزين (مثل إياد في الرياضيات وراكان في البرمجة) تقديم شروحات للمحاضرات والشباتر بأسعار محددة (70 ر.س / ساعة). لا تُحول المبالغ كاش؛ بل تتحول تلقائياً إلى "رصيد جامعي" معتمد في محفظة الطالب يُسدد به رسوم جامعته أو مواقفه!'
          : 'Distinguished students (e.g. Eyad in Math, Rakan in Coding) provide peer tutoring at 70 SAR/hour. Earnings transfer directly into University Balance to settle tuition fees or parking!'
        }
      </p>
    </div>

    <!-- Student Economy Banner -->
    <div style="background:linear-gradient(135deg, rgba(17,110,99,0.2), rgba(215,162,55,0.15)); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-xl); padding:1.4rem 1.6rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;">
      <div style="display:flex; align-items:center; gap:1rem;">
        <div style="width:46px; height:46px; border-radius:var(--radius-lg); background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          ${createIcon('graduationCap', { size: 24, color: 'var(--fbsu-gold)' })}
        </div>
        <div>
          <div style="font-weight:900; font-size:1.05rem; color:var(--text-main);">${isAr ? 'دورة الرصيد الجامعي (Student Tuition Offset)' : 'Tuition Offset Flow'}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.2rem;">
            ${isAr
              ? 'الشرح بـ 70 ر.س/ساعة ➔ تجميع 10 ساعات = 700 ر.س ➔ خصم مباشر وسداد فوري من رسوم الفصل الدراسي بالجامعة!'
              : 'Teach for 70 SAR/hr ➔ 10 hrs = 700 SAR credited to University Balance ➔ Offsets tuition & parking!'
            }
          </div>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:0.75rem;">
        <button class="btn-gold" id="quick-pay-tuition-btn">
          ${createIcon('wallet', { size: 16, color: '#0b1a17' })}
          <span>${isAr ? 'سداد الرسوم الجامعية من رصيدك' : 'Pay Tuition From Balance'}</span>
        </button>
        <button class="btn-primary" id="open-create-session-btn">
          ${createIcon('plus', { size: 16, color: '#ffffff' })}
          <span>${isAr ? 'طرح جلسة شرح جديدة' : 'Post New Session'}</span>
        </button>
      </div>
    </div>

    <!-- Tutoring Hub Filter Toolbar -->
    <div class="campus-hub-toolbar">
      <div class="hub-filter-pills">
        <button class="hub-filter-btn ${filter === 'all' ? 'active' : ''}" data-tutor-filter="all">
          <span>${isAr ? 'جميع الشروحات الأكاديمية' : 'All Sessions'}</span>
        </button>
        <button class="hub-filter-btn ${filter === 'math' ? 'active' : ''}" data-tutor-filter="math">
          <span>${isAr ? 'الرياضيات والهندسة (إياد الحربي)' : 'Math & Calculus'}</span>
        </button>
        <button class="hub-filter-btn ${filter === 'programming' ? 'active' : ''}" data-tutor-filter="programming">
          <span>${isAr ? 'البرمجة وهياكل البيانات (راكان المطيري)' : 'Programming (Rakan)'}</span>
        </button>
        <button class="hub-filter-btn ${filter === 'hardware' ? 'active' : ''}" data-tutor-filter="hardware">
          <span>${isAr ? 'التصميم المنطقي (Logic Design)' : 'Digital Logic Design'}</span>
        </button>
      </div>

      <div style="font-size:0.82rem; color:var(--text-muted);">
        ${isAr ? 'المستخدم الحالي الحاجز:' : 'Current User:'} <strong>${currentUser.name}</strong> (${currentUser.walletBalance.toFixed(2)} ر.س)
      </div>
    </div>

    <!-- Tutoring Cards Grid -->
    <div class="tutoring-grid">
      ${sessions.map(s => `
        <div class="tutoring-card">
          <div>
            <div class="tutoring-top-bar">
              <span class="course-code-badge">
                ${createIcon('award', { size: 13, color: 'var(--fbsu-primary)' })}
                <span>${s.courseCode}</span>
              </span>

              <div class="tutor-rate-badge">
                <span class="tutor-rate-num">${s.hourlyRate} ر.س</span>
                <span class="tutor-rate-unit">${isAr ? 'للساعة الواحدة' : 'per hour'}</span>
              </div>
            </div>

            <!-- Tutor Profile Info -->
            <div class="tutor-profile-strip">
              <div class="tutor-avatar-circle" style="background:${s.tutorAvatarColor};">
                ${s.tutorName.charAt(0)}
              </div>
              <div class="tutor-info-meta">
                <div class="tutor-title-row">
                  <span class="tutor-name">${s.tutorName}</span>
                  <span class="tutor-badge-tag">${isAr ? 'طالب متميز' : 'Honor Tutor'}</span>
                </div>
                <div class="tutor-college-text">${s.tutorRole}</div>
                <div style="display:flex; align-items:center; gap:0.35rem; font-size:0.75rem; color:var(--fbsu-gold); margin-top:0.25rem;">
                  <span>★ ${s.rating}</span>
                  <span style="color:var(--text-dim);">(${s.reviewsCount} تقييم طالب)</span>
                </div>
              </div>
            </div>

            <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin-bottom:0.65rem;">
              ${s.courseName}
            </h4>

            <!-- Scope Box -->
            <div class="tutoring-content-box">
              <div class="lectures-scope-title">
                ${createIcon('bookOpen', { size: 14, color: 'var(--fbsu-gold)' })}
                <span>${s.coveredLectures}</span>
              </div>
              <div class="lectures-scope-desc">
                ${s.coveredScope}
              </div>
            </div>

            <!-- Meta details -->
            <div class="tutoring-meta-row">
              <div style="display:flex; align-items:center; gap:0.35rem;">
                ${createIcon('clock', { size: 14, color: 'var(--text-dim)' })}
                <span>${s.dateTime}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.35rem;">
                ${createIcon('mapPin', { size: 14, color: 'var(--text-dim)' })}
                <span>${s.location}</span>
              </div>
            </div>

            <!-- University Balance routing notice -->
            <div class="wallet-routing-notice">
              ${createIcon('shieldCheck', { size: 14, color: 'var(--fbsu-primary)' })}
              <span>${isAr ? 'يتم تحويل ' + s.hourlyRate + ' ر.س كرصيد جامعي للطالب ' + s.tutorName.split(' ')[0] + ' لسداد رسوم جامعته.' : 'Payment converted to official university tuition credit.'}</span>
            </div>
          </div>

          <!-- Action Button -->
          <button class="btn-gold book-tutoring-btn" data-session-id="${s.id}" style="width:100%; justify-content:center; padding:0.85rem; font-size:0.9rem;">
            ${createIcon('wallet', { size: 16, color: '#0b1a17' })}
            <span>${isAr ? 'حجز الجلسة وسداد ' + s.hourlyRate + ' ر.س' : 'Book & Settle ' + s.hourlyRate + ' SAR'}</span>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// Tab 3: Faculty Office Hours Booking (حجز الساعات المكتبية للقيادات والدكاترة)
// ============================================================================
function renderOfficeHoursTab(isAr) {
  const faculty = appState.facultyMembers;

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('userCheck', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'الساعات المكتبية والتواصل الأكاديمي' : 'Faculty Office Hours'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'حجز الساعات المكتبية للعمداء ورؤساء الأقسام' : 'FBSU Academic Leadership & Faculty Office Hours'}</h3>
      <p class="section-subtitle">
        ${isAr
          ? 'احجز موعداً مباشراً في الساعات المكتبية لرئيسة قسم كلية الحاسبات (د. رغد النفيعي) أو عميد كلية الحاسب (د. محمد مزهر) لمناقشة مشروع التخرج أو استفسار مادة Logic Design. يرسل النظام إشعاراً فورياً للعميد أو رئيسة القسم بالموعد وتفاصيل الطالب!'
          : 'Book an office hour slot with Chairperson Dr. Raghad Al-Nefaie or Dean Dr. Mohammad Mezher for project reviews or Logic Design questions with instant notifications!'
        }
      </p>
    </div>

    <!-- Direct Notification Alert Banner -->
    <div class="direct-alert-banner">
      ${createIcon('bell', { size: 18, color: 'var(--fbsu-gold)' })}
      <div>
        <strong>${isAr ? 'إشعار فوري مباشر:' : 'Instant Direct Notification:'}</strong>
        ${isAr
          ? ' فور تأكيد حجزك، يرسل النظام تنبيهاً مباشراً مع بيانات الطالب والموضوع إلى لوحة رئيسة القسم د. رغد النفيعي أو العميد د. محمد مزهر.'
          : ' Instant alert is dispatched to the Dean or Dept Chair dashboard upon booking confirmation.'
        }
      </div>
    </div>

    <!-- Faculty Cards Grid -->
    <div class="faculty-grid">
      ${faculty.map(f => `
        <div class="faculty-card">
          <div>
            <div class="faculty-header-pod">
              <div class="faculty-avatar-circle" style="background:${f.avatarColor};">
                ${f.name.split(' ')[1] ? f.name.split(' ')[1].charAt(0) : 'د'}
              </div>
              <div class="faculty-meta-col">
                <span class="faculty-rank-badge">${f.badge}</span>
                <h4 class="faculty-name">${f.name}</h4>
                <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700; margin-bottom:0.25rem;">
                  ${f.rank}
                </div>
                <div class="faculty-office-location">
                  ${createIcon('mapPin', { size: 13, color: 'var(--fbsu-primary)' })}
                  <span>${f.office}</span>
                </div>
              </div>
            </div>

            <!-- Supervised courses -->
            <div style="font-size:0.78rem; font-weight:800; color:var(--text-dim); margin-bottom:0.4rem;">
              ${isAr ? 'المقررات والمجالات المتاحة للنقاش:' : 'Supervised Topics & Courses:'}
            </div>
            <div class="faculty-subjects-tag-list">
              ${f.coursesSupervised.map(subj => `
                <span class="faculty-subject-chip">${subj}</span>
              `).join('')}
            </div>

            <!-- Slots container -->
            <div class="slots-container-card">
              <div class="slots-subhead">
                <span>${isAr ? 'مواعيد الساعات المكتبية:' : 'Office Hours Available:'} ${f.daysText}</span>
                <span style="color:var(--status-available); font-weight:800;">${f.nextAvailable}</span>
              </div>

              <div class="time-slots-picker-grid">
                ${f.timeSlots.map((slot, sIdx) => `
                  <button class="time-slot-btn ${slot.available ? '' : 'disabled'}" ${slot.available ? '' : 'disabled'} data-faculty-id="${f.id}" data-slot-time="${slot.time}">
                    <div>${slot.time}</div>
                    <div style="font-size:0.65rem; color:var(--text-dim); font-weight:600;">${slot.duration}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Booking trigger CTA -->
          <button class="btn-primary open-faculty-booking-btn" data-faculty-id="${f.id}" style="width:100%; justify-content:center; padding:0.85rem; font-size:0.9rem;">
            ${createIcon('calendar', { size: 16, color: '#ffffff' })}
            <span>${isAr ? 'حجز موعد ساعة مكتبية مع ' + f.name.split(' ')[0] + ' ' + f.name.split(' ')[1] : 'Book Office Hour Slot'}</span>
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// Tab 4: Study Rooms & Laboratories Hub (حجز القاعات والمعامل الطلابية)
// ============================================================================
function renderRoomsTab(isAr) {
  const rooms = appState.studyRooms;

  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('doorClosed', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'المعامل والقاعات الدراسية' : 'Study Rooms & Labs Hub'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'حجز القاعات والمعامل الطلابية للعمل الجماعي' : 'FBSU Interactive Study Pods & Specialized Labs'}</h3>
      <p class="section-subtitle">
        ${isAr
          ? 'مساحات عمل جماعية ومجهزة للطلاب لإنجاز المهام والتكاليف (Classwork, Assignment, Homework). يتم الحجز بوقت دقيق ومحدد (مثلاً من 09:00 ص إلى 09:20 ص) مع عداد تنازلي نشط لضمان إخلاء المعمل في الموعد المحدد!'
          : 'Collaborative spaces for students to finish Classwork, Assignments & Homework with precise reservation windows (e.g. 09:00 to 09:20 AM) and live countdowns!'
        }
      </p>
    </div>

    <!-- Hub Header Action -->
    <div class="campus-hub-toolbar">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span class="pulse-dot-green"></span>
        <span style="font-size:0.85rem; color:var(--text-main); font-weight:800;">
          ${isAr ? 'معمل الحاسب 102 مشغول حالياً بجلسة عمل جماعي لـ (إياد وراكان وعبد العزيز)' : 'Computer Lab 102 actively in use by student study group'}
        </span>
      </div>

      <button class="btn-primary" id="open-book-room-btn">
        ${createIcon('plus', { size: 16, color: '#ffffff' })}
        <span>${isAr ? 'حجز قاعة أو معمل لمجموعتك' : 'Reserve Room / Lab'}</span>
      </button>
    </div>

    <!-- Rooms Grid -->
    <div class="rooms-grid">
      ${rooms.map(room => {
        const isInUse = room.status === 'in-use';
        const isReserved = room.status === 'reserved';

        return `
          <div class="room-card">
            <div>
              <div class="room-card-head">
                <span class="room-badge-type">
                  ${createIcon('monitor', { size: 13, color: 'var(--fbsu-primary)' })}
                  <span>${room.typeBadge}</span>
                </span>

                <span class="badge ${isInUse ? 'badge-occ' : (isReserved ? 'badge-flex' : 'badge-avail')}">
                  ${isInUse ? (isAr ? 'مشغول حالياً (جلسة نشطة)' : 'In Session') : (isReserved ? (isAr ? 'محجوز' : 'Reserved') : (isAr ? 'شاغر ومتاح الآن' : 'Available Now'))}
                </span>
              </div>

              <h4 class="room-title">${room.name}</h4>
              <div class="room-location-text">
                ${createIcon('mapPin', { size: 13, color: 'var(--text-dim)' })}
                <span>${room.building} • سعة: <strong>${room.capacity}</strong></span>
              </div>

              <!-- Active countdown for Lab 102 -->
              ${isInUse && room.activeBooking ? `
                <div class="room-active-timer-box">
                  <div class="timer-header-flex">
                    <span class="timer-team-label">${room.activeBooking.purpose}</span>
                    <span class="countdown-digits" id="lab102-countdown-clock">09:00 - 09:20 (${appState.activeRoomCountdown} د متبقية)</span>
                  </div>

                  <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.35rem;">
                    ${isAr ? 'المجموعة:' : 'Team:'} <strong>${room.activeBooking.teamMembers.join(' • ')}</strong>
                  </div>

                  <div class="timer-progress-track">
                    <div class="timer-progress-fill" style="width:${(appState.activeRoomCountdown / 20) * 100}%;"></div>
                  </div>

                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
                    <span>${isAr ? 'وقت الدخول: 09:00 ص' : 'Start: 09:00 AM'}</span>
                    <span style="color:#f43f5e; font-weight:800;">${isAr ? 'موعد الخروج الإلزامي: 09:20 ص' : 'Exit: 09:20 AM'}</span>
                  </div>
                </div>
              ` : ''}

              ${!isInUse && !isReserved ? `
                <div class="room-active-timer-box timer-available">
                  <div class="timer-header-flex">
                    <span class="timer-team-label" style="color:var(--status-available);">${isAr ? 'القاعة جاهزة للحجز الفوري' : 'Pod Ready For Immediate Use'}</span>
                    <span class="countdown-digits avail">${isAr ? 'متاحة' : 'Open'}</span>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">
                    ${isAr ? 'يمكنك حجزها الآن لأداء واجباتك مع زملائك وتحديد وقت الخروج بدقة.' : 'Book for teamwork with your peers with fixed departure time.'}
                  </div>
                </div>
              ` : ''}

              <!-- Specs List -->
              <div style="font-size:0.76rem; font-weight:800; color:var(--text-dim); margin-bottom:0.4rem;">
                ${isAr ? 'التجهيزات والتقنيات المتوفرة:' : 'Included Tech & Equipment:'}
              </div>
              <div class="room-specs-list">
                ${room.specs.map(spec => `
                  <div class="room-spec-item">
                    ${createIcon('checkCircle2', { size: 13, color: 'var(--status-available)' })}
                    <span>${spec}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action buttons -->
            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
              ${isInUse ? `
                <button class="btn-outline extend-lab-time-btn" data-room-id="${room.id}" style="flex:1; justify-content:center; padding:0.75rem; font-size:0.8rem;">
                  ${createIcon('clock', { size: 14 })}
                  <span>${isAr ? 'تمديد 10 د' : '+10 Mins'}</span>
                </button>
                <button class="btn-primary release-lab-btn" data-room-id="${room.id}" style="flex:1; justify-content:center; padding:0.75rem; font-size:0.8rem; background:var(--status-available); border-color:var(--status-available);">
                  ${createIcon('check', { size: 14 })}
                  <span>${isAr ? 'إخلاء المعمل الآن' : 'Release Lab'}</span>
                </button>
              ` : `
                <button class="btn-primary book-room-now-btn" data-room-id="${room.id}" style="width:100%; justify-content:center; padding:0.85rem; font-size:0.88rem;">
                  ${createIcon('calendar', { size: 16, color: '#ffffff' })}
                  <span>${isAr ? 'حجز هذه القاعة لمجموعتك' : 'Book Room for Your Team'}</span>
                </button>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================================
// Tab 6: AI Analytics & University Insights
// ============================================================================
function renderAnalyticsTab(isAr) {
  return `
    <div class="section-head">
      <span class="section-eyebrow">
        ${createIcon('barChart3', { size: 16, color: 'var(--fbsu-gold)' })}
        <span>${isAr ? 'لوحة تحليلات الذكاء الاصطناعي' : 'AI Analytics'}</span>
      </span>
      <h3 class="section-title">${isAr ? 'مؤشرات الأداء والكفاءة التشغيلية لمواقف الجامعة' : 'FBSU Smart Parking Efficiency & Forecast'}</h3>
      <p class="section-subtitle">
        ${isAr
      ? 'بيانات حية توضح التحسن الناتج عن خوارزمية التبادل الذكي في زيادة السعة الاستيعابية وخفض الازدحام.'
      : 'Real-time metrics demonstrating how AI flex swapping increases capacity and eliminates traffic congestion.'
    }
      </p>
    </div>

    <div class="analytics-kpi-grid">
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--status-available);">+42%</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">زيادة في سعة المواقف الفعلية</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">دون بناء أي خرسانات أو مساحات إضافية</div>
        </div>
      </div>
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--fbsu-gold);">14.2 دقيقة</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">توفير في وقت كل طالب</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">اختفاء ظاهرة الدوران والبحث عن موقف</div>
        </div>
      </div>
      <div class="stat-chip" style="padding:1.5rem;">
        <div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--fbsu-primary);">98.8%</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0.35rem 0;">مستوى رضا طلاب ودكاترة الجامعة</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">وفق استبيان عمادة شؤون الطلاب بتبوك</div>
        </div>
      </div>
    </div>

    <!-- AI Hourly Heatmap -->
    <div class="glass-panel" style="padding:2rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
        ${createIcon('barChart3', { size: 18, color: 'var(--fbsu-primary)' })}
        <span>التوزيع الذكي للطلب على المواقف حسب ساعات الدوام الجامعي (FBSU Daily Peak Hours)</span>
      </h4>

      <div style="display:grid; grid-template-columns:repeat(9, 1fr); gap:0.75rem; text-align:center;">
        ${[
      { time: '08:00', load: 85, color: '#f59e0b', label: 'ذروة 1' },
      { time: '09:00', load: 95, color: '#ef4444', label: 'ذروة قصوى' },
      { time: '10:00', load: 70, color: '#10b981', label: 'فترة خروج البريك' },
      { time: '11:00', load: 90, color: '#ef4444', label: 'محاضرات الظهر' },
      { time: '12:00', load: 80, color: '#f59e0b', label: 'صلاة الظهر' },
      { time: '01:00', load: 65, color: '#10b981', label: 'تبادل المواقف' },
      { time: '02:00', load: 75, color: '#f59e0b', label: 'عودة الطلاب' },
      { time: '03:00', load: 50, color: '#10b981', label: 'هدوء' },
      { time: '04:00', load: 25, color: '#10b981', label: 'نهاية الدوام' },
    ].map(item => `
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem 0.5rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">${item.time}</div>
            <div style="height:120px; display:flex; align-items:flex-end; justify-content:center; margin-bottom:0.5rem;">
              <div style="width:26px; height:${item.load}%; background:${item.color}; border-radius:4px; box-shadow:0 0 10px ${item.color}50; transition:height 1s;"></div>
            </div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">${item.load}%</div>
            <div style="font-size:0.7rem; color:${item.color}; font-weight:700; margin-top:0.25rem;">${item.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// Footer Component (100% High Contrast & Readable)
// ============================================================================
function renderFooter(isAr) {
  return `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="./assets/branding/fbsu-logo.png" style="height:40px;" alt="FBSU Logo" />
              <h4 style="font-size:1.15rem; font-weight:800; color:#ffffff !important;">جامعة فهد بن سلطان</h4>
            </div>
            <p style="font-size:0.85rem; line-height:1.8; color:#e2e8f0 !important; max-width:380px;">
              ${isAr
      ? 'منظومة المواقف الذكية التفاعلية بالذكاء الاصطناعي وإنترنت الأشياء. صُممت خصيصاً لتواكب رؤية المملكة 2030 وتوفر تجربة تنقل أكاديمية فائقة الذكاء لطلاب ومنسوبي الجامعة في تبوك.'
      : 'Intelligent IoT & AI parking management engineered for Fahad Bin Sultan University in Tabuk, aligned with Saudi Vision 2030.'
    }
            </p>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">كليات الجامعة</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.55rem; font-size:0.85rem;">
              <li><a href="https://fbsu.edu.sa/Ar/All/computing-college" target="_blank" style="color:#e2e8f0 !important;">كلية الحاسب الآلي</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/engineering-college" target="_blank" style="color:#e2e8f0 !important;">كلية الهندسة</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management" target="_blank" style="color:#e2e8f0 !important;">كلية الأعمال والإدارة</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Medicine" target="_blank" style="color:#e2e8f0 !important;">كلية الطب</a></li>
              <li><a href="https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities" target="_blank" style="color:#e2e8f0 !important;">كلية العلوم والدراسات الإنسانية</a></li>
            </ul>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">روابط المنظومة</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.55rem; font-size:0.85rem;">
              <li><a href="#booking" style="color:#e2e8f0 !important;">حجز تصريح مواقف</a></li>
              <li><a href="#simulator" style="color:#e2e8f0 !important;">محاكاة التبادل الذكي</a></li>
              <li><a href="#wallet" style="color:#e2e8f0 !important;">المحفظة الجامعية والاشتراكات</a></li>
              <li><a href="#gate" style="color:#e2e8f0 !important;">بوابات ALPR والتحقق التلقائي</a></li>
              <li><a href="https://fbsu.edu.sa" target="_blank" style="color:#e2e8f0 !important;">بوابة الجامعة الرسمية</a></li>
            </ul>
          </div>

          <div>
            <h5 style="color:#ffffff !important; font-weight:800; margin-bottom:1rem;">موقع الجامعة والتواصل</h5>
            <p style="font-size:0.85rem; color:#e2e8f0 !important; margin-bottom:0.5rem;">
              طريق الملك خالد، تبوك 47721، المملكة العربية السعودية
            </p>
            <p style="font-size:0.85rem; color:#e2e8f0 !important; margin-bottom:0.5rem;">
              هاتف: +966 14 425 2500
            </p>
            <p style="font-size:0.85rem; color:#e2e8f0 !important;">
              info@fbsu.edu.sa
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © 2026 جميع الحقوق محفوظة - جامعة فهد بن سلطان (FBSU AI Smart Parking System)
          </div>
          <div style="display:flex; gap:1.25rem;">
            <span>سياسة الخصوصية</span>
            <span>الشروط والأحكام</span>
            <span>بوابة الاتصال المؤسسي</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ============================================================================
// Interactive Modals: Auth (Login & Register), Digital Pass, Spot Info, Wallet
// ============================================================================

// Complete Login & Register Modal
function openAuthModal(initialTab = 'login') {
  soundFX.playClick();
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="auth-modal-backdrop">
      <div class="modal-content-box" style="max-width:520px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="text-align:center; margin-bottom:1.5rem;">
          <img src="./assets/branding/fbsu-logo.png" style="height:48px; margin-bottom:0.6rem;" alt="FBSU" />
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">بوابة الدخول الموحد لجامعة فهد بن سلطان</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">نظام إدارة وتصاريح المواقف الذكية بالذكاء الاصطناعي</p>
        </div>

        <!-- Tab Switcher: Login vs Register -->
        <div class="auth-tab-buttons">
          <button class="auth-tab-btn ${initialTab === 'login' ? 'active' : ''}" id="tab-login-btn">
            ${createIcon('user', { size: 15 })}
            <span>تسجيل الدخول</span>
          </button>
          <button class="auth-tab-btn ${initialTab === 'register' ? 'active' : ''}" id="tab-register-btn">
            ${createIcon('shieldCheck', { size: 15 })}
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        <!-- Login Form -->
        <div id="login-form-section" style="${initialTab === 'login' ? 'display:block;' : 'display:none;'}">
          <div class="form-group">
            <label class="form-label">الرقم الجامعي / الوظيفي:</label>
            <input type="text" id="login-id" class="form-control" value="20210045" placeholder="مثال: 20210045" />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" id="login-pwd" class="form-control" value="••••••••" placeholder="أدخل كلمة المرور" />
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted); margin-bottom:1.25rem;">
            <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--fbsu-primary);" />
              <span>تذكر بيانات الدخول</span>
            </label>
            <a href="#" style="color:var(--fbsu-gold);">نسيت كلمة المرور؟</a>
          </div>

          <!-- Quick Demo Buttons -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem; margin-bottom:1.25rem;">
            <span style="font-size:0.75rem; color:var(--text-dim); display:block; margin-bottom:0.5rem;">دخول سريع بحسابات المنظومة:</span>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.4rem; margin-bottom:0.4rem;">
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-eyad">
                إياد (ماث 720 ر.س)
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-rakan">
                راكان (برمجة)
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-abdulaziz">
                عبد العزيز (طالب)
              </button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.4rem;">
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-raghad">
                د. رغد النفيعي
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-mezher">
                د. محمد مزهر
              </button>
              <button class="zone-btn" style="text-align:center; padding:0.35rem 0.4rem; font-size:0.72rem;" id="quick-login-doctor">
                د. الغامدي
              </button>
            </div>
          </div>

          <button class="btn-primary" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;" id="submit-login-btn">
            ${createIcon('shieldCheck', { size: 18, color: '#ffffff' })}
            <span>تسجيل الدخول (FBSU SSO)</span>
          </button>
        </div>

        <!-- Register Form -->
        <div id="register-form-section" style="${initialTab === 'register' ? 'display:block;' : 'display:none;'}">
          <div class="form-group">
            <label class="form-label">الاسم الثلاثي الكامل:</label>
            <input type="text" id="reg-name" class="form-control" placeholder="مثال: عبد العزيز فهد الشمري" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">الصفة الأكاديمية:</label>
              <select id="reg-role" class="form-control">
                <option value="طالب">طالب جامعي</option>
                <option value="عضو هيئة تدريس">عضو هيئة تدريس (دكتور)</option>
                <option value="موظف إداري">موظف إداري</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">الرقم الجامعي / الوظيفي:</label>
              <input type="text" id="reg-id" class="form-control" placeholder="مثال: 20240192" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الكلية التابع لها:</label>
            <select id="reg-college" class="form-control">
              <option value="كلية الحاسب الآلي">كلية الحاسب الآلي</option>
              <option value="كلية الهندسة">كلية الهندسة</option>
              <option value="كلية الأعمال والإدارة">كلية الأعمال والإدارة</option>
              <option value="كلية الطب">كلية الطب</option>
              <option value="كلية العلوم والدراسات">كلية العلوم والدراسات الإنسانية</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">حروف اللوحة (عربي):</label>
              <input type="text" id="reg-plate-letters" class="form-control" placeholder="مثال: ن ص ر" />
            </div>
            <div class="form-group">
              <label class="form-label">أرقام اللوحة:</label>
              <input type="text" id="reg-plate-numbers" class="form-control" placeholder="مثال: 5020" />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="form-group">
              <label class="form-label">طراز ولون المركبة:</label>
              <input type="text" id="reg-car" class="form-control" placeholder="تويوتا كامري أبيض" />
            </div>
            <div class="form-group">
              <label class="form-label">رقم الجوال:</label>
              <input type="tel" id="reg-phone" class="form-control" placeholder="05XXXXXXXX" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" id="reg-pwd" class="form-control" placeholder="أنشئ كلمة مرور قوية" />
          </div>

          <button class="btn-gold" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;" id="submit-register-btn">
            ${createIcon('sparkles', { size: 18, color: '#0b1a17' })}
            <span>إنشاء الحساب وتفعيل تصريح المواقف الذكي</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach auth modal events
  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('auth-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal-backdrop') closeModal();
  });

  document.getElementById('tab-login-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.getElementById('login-form-section').style.display = 'block';
    document.getElementById('register-form-section').style.display = 'none';
    document.getElementById('tab-login-btn').classList.add('active');
    document.getElementById('tab-register-btn').classList.remove('active');
  });

  document.getElementById('tab-register-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.getElementById('login-form-section').style.display = 'none';
    document.getElementById('register-form-section').style.display = 'block';
    document.getElementById('tab-register-btn').classList.add('active');
    document.getElementById('tab-login-btn').classList.remove('active');
  });

  // Quick login presets
  document.getElementById('quick-login-eyad')?.addEventListener('click', () => {
    appState.currentUser = USERS.eyad;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-rakan')?.addEventListener('click', () => {
    appState.currentUser = USERS.rakan;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-abdulaziz')?.addEventListener('click', () => {
    appState.currentUser = USERS.abdulaziz;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-raghad')?.addEventListener('click', () => {
    appState.currentUser = USERS.drRaghad;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-mezher')?.addEventListener('click', () => {
    appState.currentUser = USERS.drMezher;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('quick-login-doctor')?.addEventListener('click', () => {
    appState.currentUser = USERS.doctor;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    closeModal();
    renderApp();
  });

  document.getElementById('submit-login-btn')?.addEventListener('click', () => {
    const enteredId = document.getElementById('login-id').value;
    if (enteredId.includes('88') || enteredId.includes('rakan')) {
      appState.currentUser = USERS.rakan;
    } else if (enteredId.includes('FAC') || enteredId.includes('doctor')) {
      appState.currentUser = USERS.doctor;
    } else {
      appState.currentUser = USERS.eyad;
    }
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    closeModal();
    renderApp();
  });

  document.getElementById('submit-register-btn')?.addEventListener('click', () => {
    const name = document.getElementById('reg-name').value || 'طالب جديد';
    const role = document.getElementById('reg-role').value || 'طالب';
    const college = document.getElementById('reg-college').value || 'كلية الحاسب الآلي';
    const id = document.getElementById('reg-id').value || '20249901';
    const letters = document.getElementById('reg-plate-letters').value || 'س ع د';
    const numbers = document.getElementById('reg-plate-numbers').value || '2030';
    const car = document.getElementById('reg-car').value || 'هيونداي إلنترا 2024';

    const newUser = {
      id: id,
      name: name,
      nameEn: name,
      role: `${role} - ${college}`,
      roleEn: `${role} - ${college}`,
      car: car,
      carEn: car,
      plateLetters: letters,
      plateNumbers: numbers,
      walletBalance: 100.00,
      primarySpot: 3,
      schedule: 'أحد / ثلاثاء'
    };

    appState.currentUser = newUser;
    appState.isLoggedIn = true;
    soundFX.playSuccess();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    const isArReg = (typeof appState !== 'undefined' && appState.currentLang === 'ar') || document.documentElement.lang === 'ar';
    showToast(
      isArReg
        ? `🎉 مرحباً بك يا ${name}! تم إنشاء حسابك بنجاح، وتخصيص 100 ر.س رصيد ترحيبي في محفظتك وتفعيل قارئ البوابة لمركبتك.`
        : `🎉 Welcome ${name}! Your account was created successfully with 100 SAR welcome credit and gate reader access.`,
      'success',
      isArReg ? 'تم إنشاء الحساب بنجاح' : 'Account Created Successfully',
      6000
    );
    closeModal();
    renderApp();
  });
}

function openDigitalPassModal(passData) {
  soundFX.playSuccess();
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });

  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="pass-modal-backdrop">
      <div class="modal-content-box" style="max-width:480px; padding:2rem;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div class="digital-pass-card">
          <div class="pass-header">
            <div>
              <div style="font-size:0.75rem; color:var(--fbsu-gold); font-weight:800;">FBSU SMART PASS</div>
              <h3 style="font-size:1.15rem; font-weight:800; color:#fff;">تصريح دخول المواقف الذكي</h3>
            </div>
            <img src="./assets/branding/fbsu-logo.png" style="height:36px;" alt="FBSU" />
          </div>

          <div style="text-align:center;">
            <div style="font-size:0.85rem; color:var(--text-muted);">الموقف المخصص</div>
            <div style="font-size:2.5rem; font-weight:900; color:var(--fbsu-gold); line-height:1.2;">
              #${String(passData.spotId).padStart(2, '0')}
            </div>
            <span class="badge badge-fbsu">${passData.college}</span>
          </div>

          <div class="pass-qr-box">
            ${getQRSvg('FBSU-PASS-' + passData.spotId + '-' + passData.plate)}
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.825rem; border-top:1px dashed rgba(215,162,55,0.3); padding-top:1rem;">
            <div>
              <span style="color:var(--text-muted); display:block;">المستفيد:</span>
              <strong style="color:#ffffff;">${passData.userName}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">الرقم الجامعي:</span>
              <strong style="color:#ffffff;">${passData.userId}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">لوحة المركبة:</span>
              <strong style="color:var(--fbsu-gold);">${passData.plate}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">الصلاحية:</span>
              <strong style="color:var(--status-available);">${passData.duration}</strong>
            </div>
          </div>

          <div style="margin-top:1.5rem;">
            <button class="btn-primary" style="width:100%; justify-content:center;" id="simulate-gate-open-from-pass-btn">
              ${createIcon('camera', { size: 16, color: '#ffffff' })}
              <span>فتح البوابة الذكية تلقائياً (NFC)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('pass-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'pass-modal-backdrop') closeModal();
  });
  document.getElementById('simulate-gate-open-from-pass-btn')?.addEventListener('click', () => {
    closeModal();
    appState.activeTab = 'gate';
    appState.gateScannedPlate = passData.plate;
    renderApp();
    setTimeout(() => {
      triggerGateScan();
    }, 300);
  });
}

function openSpotModal(spot) {
  soundFX.playClick();
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const isAvailable = spot.status === 'available';
  const isFlex = spot.status === 'flex-share';

  modal.innerHTML = `
    <div class="modal-overlay open" id="spot-modal-backdrop">
      <div class="modal-content-box">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
          <div>
            <span class="badge badge-gold">قطاع ${spot.zone} - ${spot.college}</span>
            <h3 style="font-size:1.6rem; font-weight:800; color:var(--text-main); margin-top:0.35rem;">
              موقف رقم #${String(spot.id).padStart(2, '0')}
            </h3>
            <span style="font-size:0.85rem; color:var(--text-muted);">المسافة حتى مدخل الكلية: ${spot.distance}</span>
          </div>
          <span class="badge ${spot.status === 'available' ? 'badge-available' : (spot.status === 'flex-share' ? 'badge-flex' : 'badge-occupied')}">
            ${spot.status === 'available' ? 'متاح الآن' : (spot.status === 'flex-share' ? 'تبادل ذكي نشط' : 'مشغول')}
          </span>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.9rem;">
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">الحالة الحالية:</span>
              <strong style="color:var(--text-main);">${spot.occupant || 'شاغر وجاهز للاستخدام'}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">المستشعر الذكي IoT:</span>
              <strong style="color:var(--status-available);">متصل (إشارة ممتازة)</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">المركبة الحالية:</span>
              <strong style="color:var(--text-main);">${spot.car || 'لا يوجد'}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block; font-size:0.8rem;">الوقت المتبقي:</span>
              <strong style="color:var(--fbsu-gold);">${spot.timeLeft || 'متاح فوري'}</strong>
            </div>
          </div>
        </div>

        ${isAvailable || isFlex ? `
          <div style="display:flex; gap:1rem;">
            <button class="btn-gold" style="flex:1; justify-content:center;" id="quick-book-spot-btn" data-spot-id="${spot.id}">
              ${createIcon('zap', { size: 16, color: '#0b1a17' })}
              <span>احجز هذا الموقف الآن (${isFlex ? 'تعرفة مخفضة 5.75 ر.س' : 'حجز فوري'})</span>
            </button>
          </div>
        ` : `
          <div style="text-align:center; padding:0.5rem; color:var(--text-muted); font-size:0.85rem;">
            هذا الموقف مشغول حالياً وسيتاح تلقائياً فور مغادرة صاحبه أو في وقت البريك القادم.
          </div>
        `}
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('spot-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'spot-modal-backdrop') closeModal();
  });
  document.getElementById('quick-book-spot-btn')?.addEventListener('click', () => {
    closeModal();
    openDigitalPassModal({
      spotId: spot.id,
      college: spot.college,
      userName: appState.currentUser.name,
      userId: appState.currentUser.id,
      plate: `${appState.currentUser.plateLetters} ${appState.currentUser.plateNumbers}`,
      duration: '3 ساعات (09:00 - 12:00)'
    });
  });
}

// ============================================================================
// FBSU Luxury Toast & Custom Alert Engine
// ============================================================================
function getOrCreateToastContainer() {
  let container = document.getElementById('fbsu-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'fbsu-toast-container';
    container.className = 'fbsu-toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  return container;
}

function showToast(arg1, arg2, arg3 = null, arg4 = 4500) {
  const isAr = (typeof appState !== 'undefined' && appState.currentLang === 'ar') || document.documentElement.lang === 'ar';
  let title = '';
  let message = '';
  let type = 'info';
  let iconName = '';
  let duration = 4500;

  const validTypes = ['success', 'error', 'warning', 'info'];

  if (typeof arg2 === 'string' && validTypes.includes(arg2.toLowerCase())) {
    // Pattern: showToast(message, type, title, duration)
    message = String(arg1 || '');
    type = arg2.toLowerCase();
    title = arg3;
    duration = typeof arg4 === 'number' ? arg4 : 4500;
  } else if (typeof arg2 === 'string') {
    // Pattern: showToast(title, message, iconName)
    title = String(arg1 || '');
    message = String(arg2 || '');
    iconName = typeof arg3 === 'string' ? arg3 : '';
    if (iconName === 'wallet' || iconName === 'checkCircle2' || iconName === 'award') {
      type = 'success';
    } else if (iconName === 'doorClosed' || iconName === 'bookOpen' || iconName === 'clock') {
      type = 'info';
    } else {
      type = 'success';
    }
    duration = 4500;
  } else {
    // Pattern: showToast(message) or alert(message)
    message = String(arg1 || '');
    type = 'info';
    duration = 4500;
  }

  // Fallback title if none provided
  if (!title) {
    const defaultTitles = {
      success: isAr ? 'تمت العملية بنجاح' : 'Success',
      error: isAr ? 'تنبيه خطأ' : 'Error Occurred',
      warning: isAr ? 'تنبيه هـام' : 'Attention',
      info: isAr ? 'منظومة الجامعة الذكية' : 'Campus Notification'
    };
    title = defaultTitles[type] || defaultTitles.info;
  }

  // Auditory feedback
  if (type === 'success') {
    soundFX.playSuccess();
  } else if (type === 'error') {
    soundFX.playError();
  } else if (type === 'warning') {
    soundFX.playWarning();
  } else {
    soundFX.playClick();
  }

  // Icon selection
  if (!iconName) {
    const defaultIcons = {
      success: 'checkCircle2',
      error: 'alertCircle',
      warning: 'alertTriangle',
      info: 'info'
    };
    iconName = defaultIcons[type] || 'info';
  }

  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = `fbsu-toast fbsu-toast-${type}`;
  toast.setAttribute('role', 'alert');

  toast.innerHTML = `
    <div class="fbsu-toast-icon-wrap">
      ${createIcon(iconName, { size: 20 })}
    </div>
    <div class="fbsu-toast-body">
      ${title ? `<div class="fbsu-toast-title">${title}</div>` : ''}
      <div class="fbsu-toast-message">${message}</div>
    </div>
    <button class="fbsu-toast-close" type="button" aria-label="${isAr ? 'إغلاق' : 'Close'}" title="${isAr ? 'إغلاق' : 'Close'}">
      ${createIcon('close', { size: 14 })}
    </button>
    <div class="fbsu-toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  let dismissTimeout = null;
  let remainingTime = duration;
  let startTime = Date.now();
  let isDismissed = false;

  function dismiss() {
    if (isDismissed) return;
    isDismissed = true;
    clearTimeout(dismissTimeout);
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    }, { once: true });
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 350);
  }

  function startTimer() {
    startTime = Date.now();
    dismissTimeout = setTimeout(dismiss, remainingTime);
  }

  function pauseTimer() {
    clearTimeout(dismissTimeout);
    remainingTime -= (Date.now() - startTime);
  }

  startTimer();

  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', () => {
    if (remainingTime > 0) startTimer();
  });

  toast.querySelector('.fbsu-toast-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    soundFX.playClick();
    dismiss();
  });

  container.appendChild(toast);
  return { dismiss };
}

function showModalAlert(message, { title = null, type = 'info', confirmText = null } = {}) {
  return new Promise((resolve) => {
    const isAr = (typeof appState !== 'undefined' && appState.currentLang === 'ar') || document.documentElement.lang === 'ar';
    const defaultTitles = {
      success: isAr ? 'تمت العملية بنجاح' : 'Success',
      error: isAr ? 'تنبيه خطأ' : 'Attention Required',
      warning: isAr ? 'تنبيه هـام' : 'Notice',
      info: isAr ? 'منظومة جامعة فهد بن سلطان' : 'FBSU Smart Campus'
    };
    const finalTitle = title || defaultTitles[type] || defaultTitles.info;
    const finalConfirm = confirmText || (isAr ? 'حسناً، فهمت' : 'OK, Understood');

    if (type === 'success') soundFX.playSuccess();
    else if (type === 'error') soundFX.playError();
    else if (type === 'warning') soundFX.playWarning();
    else soundFX.playClick();

    const iconMap = {
      success: 'checkCircle2',
      error: 'alertCircle',
      warning: 'alertTriangle',
      info: 'info'
    };
    const iconName = iconMap[type] || 'info';

    const backdrop = document.createElement('div');
    backdrop.className = 'fbsu-alert-backdrop';
    backdrop.innerHTML = `
      <div class="fbsu-alert-dialog type-${type}" role="dialog" aria-modal="true">
        <div class="fbsu-alert-icon-ring">
          ${createIcon(iconName, { size: 36 })}
        </div>
        <h3 class="fbsu-alert-title">${finalTitle}</h3>
        <p class="fbsu-alert-message">${message}</p>
        <div class="fbsu-alert-actions">
          <button class="fbsu-alert-btn-primary" id="fbsu-alert-ok-btn">${finalConfirm}</button>
        </div>
      </div>
    `;

    function closeDialog() {
      soundFX.playClick();
      backdrop.remove();
      document.removeEventListener('keydown', handleKey);
      resolve(true);
    }

    function handleKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        closeDialog();
      }
    }

    backdrop.querySelector('#fbsu-alert-ok-btn')?.addEventListener('click', closeDialog);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDialog();
    });
    document.addEventListener('keydown', handleKey);

    document.body.appendChild(backdrop);
  });
}

// Global luxury overrides
window.fbsuToast = showToast;
window.fbsuAlert = showModalAlert;
window.alert = function (message) {
  showToast(String(message), 'info');
};

// ============================================================================
// Enhanced University Wallet & Tuition Settlement Modal
// ============================================================================
function openWalletModal() {
  soundFX.playClick();
  const user = appState.currentUser;
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const totalTuition = user.tuitionFeesTotal || 12000.00;
  const paidTuition = user.tuitionFeesPaid || 4500.00;
  const remainingTuition = Math.max(0, totalTuition - paidTuition);
  const tuitionProgress = Math.min(100, Math.round((paidTuition / totalTuition) * 100));

  modal.innerHTML = `
    <div class="modal-overlay open" id="wallet-modal-backdrop">
      <div class="modal-content-box" style="max-width:560px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
          <div style="width:42px; height:42px; border-radius:var(--radius-md); background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center;">
            ${createIcon('wallet', { size: 22, color: 'var(--fbsu-gold)' })}
          </div>
          <div>
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">${isAr ? 'المحفظة الجامعية والرصيد المعتمد' : 'FBSU Academic Wallet & Tuition Hub'}</h3>
            <span style="font-size:0.8rem; color:var(--fbsu-primary);">${isAr ? 'جامعة فهد بن سلطان - رصيد الشروحات الطلابية والمواقف' : 'Official Tuition Settlement & Flex Balance'}</span>
          </div>
        </div>

        <!-- Balance Card -->
        <div style="background:linear-gradient(135deg, rgba(17,110,99,0.25), rgba(215,162,55,0.18)); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="font-size:0.82rem; color:var(--text-muted);">${isAr ? 'الرصيد الجامعي المتاح حالياً' : 'Available University Balance'}</span>
              <div style="font-size:2.4rem; font-weight:900; color:var(--fbsu-gold); margin:0.25rem 0;">
                ${user.walletBalance.toFixed(2)} ر.س
              </div>
            </div>
            <span class="badge badge-flex">${isAr ? 'معتمد أكاديمياً' : 'Verified'}</span>
          </div>

          <div style="font-size:0.82rem; color:var(--text-main); border-top:1px solid var(--border-subtle); padding-top:0.75rem; margin-top:0.5rem; display:flex; justify-content:space-between;">
            <span>${isAr ? 'المستفيد:' : 'Beneficiary:'} <strong>${user.name}</strong> (${user.id})</span>
            <span style="color:var(--text-muted);">${user.role.split('-')[0]}</span>
          </div>
        </div>

        <!-- Tuition Offset Progress Box -->
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem 1.15rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-main);">
              ${isAr ? 'سداد الرسوم الدراسية للفصل الحالي' : 'Term Tuition Fee Offset Progress'}
            </div>
            <span style="font-size:0.8rem; font-weight:800; color:var(--status-available);">${tuitionProgress}% ${isAr ? 'مسدد' : 'Paid'}</span>
          </div>

          <div class="timer-progress-track">
            <div class="timer-progress-fill" style="width:${tuitionProgress}%; background:linear-gradient(90deg, var(--fbsu-primary), var(--fbsu-gold));"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.76rem; color:var(--text-dim); margin-top:0.4rem;">
            <span>${isAr ? 'المدفوع:' : 'Paid:'} ${paidTuition.toFixed(2)} ر.س</span>
            <span>${isAr ? 'المتبقي:' : 'Remaining:'} <strong style="color:#f43f5e;">${remainingTuition.toFixed(2)} ر.س</strong></span>
            <span>${isAr ? 'الإجمالي:' : 'Total:'} ${totalTuition.toFixed(2)} ر.س</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; gap:0.65rem; margin-bottom:1.25rem;">
          <button class="btn-gold" style="flex:1.4; justify-content:center; padding:0.85rem;" id="modal-pay-tuition-btn">
            ${createIcon('graduationCap', { size: 16, color: '#0b1a17' })}
            <span>${isAr ? 'سداد الرسوم الدراسية من الرصيد' : 'Pay Tuition From Balance'}</span>
          </button>
          <button class="btn-outline" style="flex:1; justify-content:center; padding:0.85rem;" id="add-wallet-funds-btn">
            ${createIcon('plus', { size: 16 })}
            <span>${isAr ? 'شحن رصيد (+50)' : 'Top Up (+50)'}</span>
          </button>
        </div>

        <h5 style="color:var(--text-main); font-weight:800; margin-bottom:0.65rem; font-size:0.9rem;">
          ${isAr ? 'سجل العمليات الأكاديمية والمكافآت:' : 'Academic Transaction History:'}
        </h5>

        <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:190px; overflow-y:auto; padding-right:0.25rem;">
          <div style="background:rgba(255,255,255,0.03); padding:0.65rem 0.85rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.82rem;">
            <div>
              <strong style="color:var(--status-available);">+ 70.00 ر.س</strong>
              <div style="font-size:0.74rem; color:var(--text-muted);">${isAr ? 'عوائد شرح الأقران (MATH 101 - حجز راكان)' : 'Peer Tutoring (MATH 101)'}</div>
            </div>
            <span style="font-size:0.72rem; color:var(--text-dim);">${isAr ? 'اليوم 11:30 ص' : 'Today'}</span>
          </div>

          <div style="background:rgba(255,255,255,0.03); padding:0.65rem 0.85rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.82rem;">
            <div>
              <strong style="color:var(--status-available);">+ 17.25 ر.س</strong>
              <div style="font-size:0.74rem; color:var(--text-muted);">${isAr ? 'مكافأة تبادل ذكي (بريك إياد - موقف #01)' : 'AI Parking Flex Reward'}</div>
            </div>
            <span style="font-size:0.72rem; color:var(--text-dim);">${isAr ? 'اليوم 10:05 ص' : 'Today'}</span>
          </div>

          <div style="background:rgba(255,255,255,0.03); padding:0.65rem 0.85rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; font-size:0.82rem;">
            <div>
              <strong style="color:#f43f5e;">- 500.00 ر.س</strong>
              <div style="font-size:0.74rem; color:var(--text-muted);">${isAr ? 'سداد دفعة رسوم دراسية (جامعة فهد بن سلطان)' : 'Tuition Payment'}</div>
            </div>
            <span style="font-size:0.72rem; color:var(--text-dim);">${isAr ? 'أمس 02:15 م' : 'Yesterday'}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('wallet-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'wallet-modal-backdrop') closeModal();
  });

  document.getElementById('modal-pay-tuition-btn')?.addEventListener('click', () => {
    closeModal();
    openTuitionPaymentModal();
  });

  document.getElementById('add-wallet-funds-btn')?.addEventListener('click', () => {
    user.walletBalance += 50.00;
    soundFX.playSuccess();
    showToast('تم شحن المحفظة', 'تمت إضافة 50.00 ر.س إلى رصيدك الجامعي بنجاح.', 'wallet');
    closeModal();
    renderApp();
  });
}

// ============================================================================
// Tuition Payment & Official Receipt Modal
// ============================================================================
function openTuitionPaymentModal() {
  soundFX.playClick();
  const user = appState.currentUser;
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const totalTuition = user.tuitionFeesTotal || 12000.00;
  const paidTuition = user.tuitionFeesPaid || 4500.00;
  const remainingTuition = Math.max(0, totalTuition - paidTuition);

  modal.innerHTML = `
    <div class="modal-overlay open" id="tuition-modal-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
          <img src="./assets/branding/fbsu-logo.png" style="height:44px;" alt="FBSU" />
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${isAr ? 'سداد الرسوم الجامعية بالرصيد المكتسب' : 'Tuition Settlement via Earned Credits'}</h3>
            <span style="font-size:0.78rem; color:var(--fbsu-primary);">${isAr ? 'عمادة القبول والتسجيل - جامعة فهد بن سلطان' : 'Deanship of Admissions & Registration'}</span>
          </div>
        </div>

        <div style="background:var(--fbsu-primary-light); border:1px solid var(--fbsu-gold-border); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.85rem;">
            <span style="color:var(--text-muted);">${isAr ? 'رصيد محفظتك المتاح:' : 'Available Balance:'}</span>
            <strong style="color:var(--fbsu-gold); font-size:1.15rem;">${user.walletBalance.toFixed(2)} ر.س</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
            <span style="color:var(--text-muted);">${isAr ? 'المتبقي من رسوم الفصل:' : 'Remaining Tuition:'}</span>
            <strong style="color:#f43f5e; font-size:1.15rem;">${remainingTuition.toFixed(2)} ر.س</strong>
          </div>
        </div>

        <!-- Presets -->
        <label class="form-label">${isAr ? 'حدد المبلغ المراد سداده من رصيدك الجامعي:' : 'Choose Payment Amount:'}</label>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; margin-bottom:1.25rem;">
          <button class="pattern-option tuition-preset-btn" data-amt="70">70 ر.س</button>
          <button class="pattern-option tuition-preset-btn" data-amt="140">140 ر.س</button>
          <button class="pattern-option tuition-preset-btn selected" data-amt="350">350 ر.س</button>
          <button class="pattern-option tuition-preset-btn" data-amt="${Math.min(user.walletBalance, remainingTuition)}">${isAr ? 'كامل الرصيد' : 'Full'}</button>
        </div>

        <div class="form-group">
          <label class="form-label">${isAr ? 'المبلغ المحدد للسداد (ر.س):' : 'Amount to Offset (SAR):'}</label>
          <input type="number" id="tuition-pay-input" class="form-control" value="350" min="10" max="${user.walletBalance}" />
        </div>

        <div class="wallet-routing-notice" style="margin-bottom:1.5rem;">
          ${createIcon('checkCircle2', { size: 16, color: 'var(--status-available)' })}
          <span>${isAr ? 'سيتم خصم المبلغ فوراً من محفظتك وتحديث سجلك الأكاديمي مع إصدار سند قبض جامعي رسمي.' : 'Directly updates your academic ledger with official receipt.'}</span>
        </div>

        <button class="btn-gold" id="confirm-tuition-settle-btn" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;">
          ${createIcon('shieldCheck', { size: 18, color: '#0b1a17' })}
          <span>${isAr ? 'تأكيد سداد الرسوم الجامعية وإصدار السند' : 'Confirm Tuition Settlement'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('tuition-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'tuition-modal-backdrop') closeModal();
  });

  document.querySelectorAll('.tuition-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('.tuition-preset-btn').forEach(b => b.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const amt = e.currentTarget.getAttribute('data-amt');
      const input = document.getElementById('tuition-pay-input');
      if (input) input.value = amt;
    });
  });

  document.getElementById('confirm-tuition-settle-btn')?.addEventListener('click', () => {
    const input = document.getElementById('tuition-pay-input');
    const amt = parseFloat(input?.value || '0');
    if (amt <= 0 || amt > user.walletBalance) {
      showToast(
        isAr ? 'عفواً، رصيد محفظتك غير كافٍ لسداد هذا المبلغ الجامعي. يرجى شحن الرصيد أولاً.' : 'Insufficient wallet balance to settle tuition fees. Please top up.',
        'error',
        isAr ? 'رصيد غير كافٍ' : 'Insufficient Balance'
      );
      return;
    }

    user.walletBalance -= amt;
    user.tuitionFeesPaid = (user.tuitionFeesPaid || 0) + amt;
    soundFX.playSuccess();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

    // Show Official Receipt
    modal.innerHTML = `
      <div class="modal-overlay open" id="tuition-receipt-backdrop">
        <div class="modal-content-box" style="max-width:560px;">
          <button class="modal-close-btn" id="modal-close-x">
            ${createIcon('close', { size: 16 })}
          </button>

          <div class="tuition-receipt-card">
            <div class="tuition-receipt-header">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <img src="./assets/branding/fbsu-logo.png" style="height:48px;" alt="FBSU" />
                <div>
                  <h4 style="font-size:1.15rem; font-weight:900; color:#116E63; margin-bottom:0.15rem;">جامعة فهد بن سلطان</h4>
                  <div style="font-size:0.75rem; color:#64748b;">سند قبض رسوم دراسية إلكتروني معتمد</div>
                </div>
              </div>
              <div class="tuition-stamp-seal">
                معتمد رسمياً<br>FBSU PAID
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; font-size:0.82rem; margin-bottom:1.5rem;">
              <div>
                <span style="color:#64748b; display:block;">اسم الطالب:</span>
                <strong>${user.name}</strong>
              </div>
              <div>
                <span style="color:#64748b; display:block;">الرقم الأكاديمي:</span>
                <strong>${user.id}</strong>
              </div>
              <div>
                <span style="color:#64748b; display:block;">الكلية والتخصص:</span>
                <strong>${user.college || user.role}</strong>
              </div>
              <div>
                <span style="color:#64748b; display:block;">مصدر السداد:</span>
                <strong style="color:#116E63;">رصيد الشروحات الطلابية والمواقف</strong>
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem; margin-bottom:1.25rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.4rem;">
                <span style="color:#64748b;">المبلغ المسدد:</span>
                <strong style="font-size:1.3rem; color:#116E63;">${amt.toFixed(2)} ر.س</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:#64748b;">
                <span>رقم العملية:</span>
                <span>FBSU-TXN-2026-${Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <button class="btn-primary" id="close-receipt-btn" style="width:100%; justify-content:center; padding:0.85rem;">
              ${createIcon('check', { size: 16, color: '#ffffff' })}
              <span>إغلاق وحفظ السند في السجل</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x')?.addEventListener('click', () => { closeModal(); renderApp(); });
    document.getElementById('close-receipt-btn')?.addEventListener('click', () => { closeModal(); renderApp(); });
    showToast('تم سداد الرسوم بنجاح', `تم خصم ${amt.toFixed(2)} ر.س من رصيدك وسدادها للرسوم الجامعية.`, 'graduationCap');
  });
}

// ============================================================================
// Direct Campus Notifications Drawer
// ============================================================================
function openNotificationsModal() {
  soundFX.playClick();
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  const notifs = appState.notifications;

  modal.innerHTML = `
    <div class="modal-overlay open" id="notif-modal-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <div style="width:38px; height:38px; border-radius:var(--radius-md); background:var(--fbsu-gold-light); color:var(--fbsu-gold); display:flex; align-items:center; justify-content:center;">
              ${createIcon('bell', { size: 20, color: 'var(--fbsu-gold)' })}
            </div>
            <div>
              <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main);">${isAr ? 'صندوق الإشعارات المباشرة' : 'Direct Campus Alerts'}</h3>
              <span style="font-size:0.76rem; color:var(--text-muted);">${isAr ? 'إشعارات حجز الساعات المكتبية والشروحات والقاعات' : 'Faculty & Student Alerts'}</span>
            </div>
          </div>
          <button class="btn-outline" id="mark-all-read-btn" style="padding:0.35rem 0.75rem; font-size:0.75rem;">
            ${isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:380px; overflow-y:auto;">
          ${notifs.map(n => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1rem; display:flex; gap:0.85rem; align-items:flex-start;">
              <div style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${createIcon(n.icon || 'bell', { size: 18, color: 'var(--fbsu-primary)' })}
              </div>
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                  <strong style="font-size:0.88rem; color:var(--text-main);">${n.title}</strong>
                  <span class="badge badge-avail" style="font-size:0.65rem;">${n.badge || 'جديد'}</span>
                </div>
                <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.45; margin-bottom:0.4rem;">
                  ${n.message}
                </p>
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim);">
                  <span>${isAr ? 'المُرسل:' : 'From:'} <strong>${n.sender}</strong></span>
                  <span>${n.time}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('notif-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'notif-modal-backdrop') closeModal();
  });

  document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
    appState.notifications.forEach(n => n.read = true);
    soundFX.playClick();
    closeModal();
    renderApp();
  });
}

// ============================================================================
// Book Peer Tutoring Session Modal (خصم 70 ر.س وإضافتها لرصيد الشارح)
// ============================================================================
function openBookTutoringModal(sessionId) {
  soundFX.playClick();
  const session = appState.tutoringSessions.find(s => s.id === sessionId);
  if (!session) return;
  const currentUser = appState.currentUser;
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="tutoring-book-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
          <div style="width:42px; height:42px; border-radius:var(--radius-md); background:${session.tutorAvatarColor}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem;">
            ${session.tutorName.charAt(0)}
          </div>
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${isAr ? 'تأكيد حجز جلسة الشرح الأكاديمي' : 'Confirm Tutoring Session'}</h3>
            <span style="font-size:0.78rem; color:var(--fbsu-primary);">${session.courseCode} • ${session.tutorName}</span>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.25rem;">
          <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.25rem;">${isAr ? 'المحتوى التعليمي المشروح:' : 'Covered Scope:'}</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--fbsu-gold); margin-bottom:0.6rem;">${session.coveredLectures}</div>
          <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">${session.coveredScope}</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem; font-size:0.82rem;">
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <span style="color:var(--text-dim); display:block;">${isAr ? 'الموعد والمكان:' : 'Time & Venue:'}</span>
            <strong style="color:var(--text-main);">${session.dateTime} (${session.location})</strong>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <span style="color:var(--text-dim); display:block;">${isAr ? 'التكلفة الإجمالية:' : 'Total Cost:'}</span>
            <strong style="color:var(--fbsu-gold); font-size:1.15rem;">${session.hourlyRate} ر.س</strong>
          </div>
        </div>

        <!-- Student Economy Principle Note -->
        <div class="wallet-routing-notice" style="margin-bottom:1.5rem;">
          ${createIcon('wallet', { size: 18, color: 'var(--fbsu-gold)' })}
          <div>
            <strong>${isAr ? 'التحويل المالي المباشر إلى رصيد الجامعة:' : 'Direct University Balance Routing:'}</strong>
            ${isAr
              ? ' سيتم خصم ' + session.hourlyRate + ' ر.س من محفظتك وإيداعها مباشرة في رصيد الجامعة للطالب ' + session.tutorName + ' ليستخدمها في سداد رسومه الجامعية ومواقفه.'
              : ' Converted into University balance for the student tutor to pay tuition & parking.'
            }
          </div>
        </div>

        <button class="btn-gold" id="confirm-tutoring-pay-btn" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;">
          ${createIcon('checkCircle2', { size: 18, color: '#0b1a17' })}
          <span>${isAr ? 'تأكيد الحجز وسداد ' + session.hourlyRate + ' ر.س' : 'Confirm & Settle ' + session.hourlyRate + ' SAR'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('tutoring-book-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'tutoring-book-backdrop') closeModal();
  });

  document.getElementById('confirm-tutoring-pay-btn')?.addEventListener('click', () => {
    if (currentUser.walletBalance < session.hourlyRate) {
      showToast(
        isAr ? 'عفواً، رصيدك الحالي غير كافٍ لحجز جلسة الشرح. يرجى شحن المحفظة الجامعية أولاً!' : 'Insufficient balance for this tutoring session! Please top up your wallet.',
        'warning',
        isAr ? 'تنبيه رصيد المحفظة' : 'Wallet Balance Alert'
      );
      return;
    }

    // Deduct from buyer
    currentUser.walletBalance -= session.hourlyRate;

    // Credit to tutor's university balance!
    const tutorUser = USERS[session.tutorId];
    if (tutorUser) {
      tutorUser.walletBalance += session.hourlyRate;
    }

    // Add alert notification
    appState.notifications.unshift({
      id: 'notif-' + Date.now(),
      target: session.tutorId,
      targetName: session.tutorName,
      sender: `${currentUser.name} (${currentUser.id})`,
      title: `حجز جديد لجلسة الشرح (${session.courseCode})`,
      message: `قام الطالب ${currentUser.name} بحجز جلسة الشرح (${session.coveredLectures}). تم إيداع ${session.hourlyRate}.00 ر.س كرصيد جامعي معتمد في محفظتك.`,
      time: 'الآن',
      read: false,
      icon: 'wallet',
      badge: '+70 ر.س'
    });

    soundFX.playSuccess();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });

    closeModal();
    renderApp();
    showToast('تم تأكيد حجز الجلسة', `تم تحويل ${session.hourlyRate} ر.س إلى رصيد الجامعة للطالب ${session.tutorName.split(' ')[0]} بنجاح!`, 'award');
  });
}

// ============================================================================
// Post New Peer Tutoring Session Modal
// ============================================================================
function openCreateTutoringModal() {
  soundFX.playClick();
  const currentUser = appState.currentUser;
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="create-tutoring-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
          <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center;">
            ${createIcon('bookOpen', { size: 20, color: 'var(--fbsu-primary)' })}
          </div>
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${isAr ? 'طرح جلسة شرح أو نشاط طلابي' : 'Post Peer Tutoring Session'}</h3>
            <span style="font-size:0.78rem; color:var(--text-muted);">${isAr ? 'المقدم: ' + currentUser.name + ' (' + currentUser.role + ')' : currentUser.name}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">${isAr ? 'رمز واسم المادة الدراسية:' : 'Course Code & Name:'}</label>
          <input type="text" id="new-tutor-course" class="form-control" placeholder="مثال: MATH 101 - حساب التفاضل والتكامل" />
        </div>

        <div class="form-group">
          <label class="form-label">${isAr ? 'المحاضرات أو الشابتر المشروح:' : 'Covered Lectures / Scope:'}</label>
          <input type="text" id="new-tutor-lectures" class="form-control" placeholder="مثال: المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)" value="المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)" />
        </div>

        <div class="form-group">
          <label class="form-label">${isAr ? 'تفاصيل المحتوى والمخرجات:' : 'Detailed Topics:'}</label>
          <textarea id="new-tutor-desc" class="form-control" rows="2" placeholder="شرح تفصيلي للمفاهيم وحل أسئلة الواجبات والاختبارات السابقة"></textarea>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div class="form-group">
            <label class="form-label">${isAr ? 'سعر الساعة (ر.س):' : 'Hourly Rate (SAR):'}</label>
            <input type="number" id="new-tutor-rate" class="form-control" value="70" />
          </div>

          <div class="form-group">
            <label class="form-label">${isAr ? 'مكان الجلسة:' : 'Location:'}</label>
            <select id="new-tutor-loc" class="form-control">
              <option value="معمل الحاسب 102">معمل الحاسب 102</option>
              <option value="قاعة المذاكرة الذكية A-04">قاعة المذاكرة الذكية A-04</option>
              <option value="معمل التصميم المنطقي Lab 205">معمل التصميم المنطقي Lab 205</option>
              <option value="جلسة تفاعلية أونلاين">جلسة تفاعلية أونلاين</option>
            </select>
          </div>
        </div>

        <div class="wallet-routing-notice" style="margin-bottom:1.5rem;">
          ${createIcon('graduationCap', { size: 16, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'جميع العوائد المالية ستتحول تلقائياً كرصيد جامعي في محفظتك تستفيد منه في سداد الرسوم الدراسية واشتراكات المواقف.' : 'Earnings route to your official tuition credit.'}</span>
        </div>

        <button class="btn-primary" id="submit-new-tutoring-btn" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;">
          ${createIcon('plus', { size: 16, color: '#ffffff' })}
          <span>${isAr ? 'نشر الجلسة وإتاحتها للطلاب' : 'Publish Tutoring Session'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('create-tutoring-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'create-tutoring-backdrop') closeModal();
  });

  document.getElementById('submit-new-tutoring-btn')?.addEventListener('click', () => {
    const course = document.getElementById('new-tutor-course')?.value || 'MATH 201';
    const lectures = document.getElementById('new-tutor-lectures')?.value || 'المحاضرات 1 إلى 4';
    const desc = document.getElementById('new-tutor-desc')?.value || 'شرح وحل التكاليف المعتمدة';
    const rate = parseFloat(document.getElementById('new-tutor-rate')?.value || '70');
    const loc = document.getElementById('new-tutor-loc')?.value || 'قاعة المذاكرة A-04';

    appState.tutoringSessions.unshift({
      id: 'TUT-' + Date.now(),
      tutorId: currentUser.id === USERS.eyad.id ? 'eyad' : 'rakan',
      tutorName: currentUser.name,
      tutorRole: currentUser.role,
      tutorAvatarColor: currentUser.avatarColor || '#116E63',
      courseCode: course.split('-')[0].trim() || 'ACAD 101',
      courseName: course,
      courseNameEn: 'Peer Tutoring Session',
      coveredLectures: lectures,
      coveredScope: desc,
      hourlyRate: rate,
      durationHours: 1,
      totalPrice: rate,
      dateTime: 'اليوم - 05:00 م',
      location: loc,
      category: 'math',
      rating: 5.0,
      reviewsCount: 1,
      status: 'open',
      enrolledStudents: []
    });

    soundFX.playSuccess();
    closeModal();
    renderApp();
    showToast('تم طرح الجلسة بنجاح', `تمت إتاحة جلسة (${course}) بسعر ${rate} ر.س/ساعة.`, 'bookOpen');
  });
}

// ============================================================================
// Book Faculty Office Hours Modal (إشعار فوري وتأكيد الحجز للدكتور)
// ============================================================================
function openBookOfficeHoursModal(facultyId, initialSlotTime = '11:15 ص') {
  soundFX.playClick();
  const f = appState.facultyMembers.find(m => m.id === facultyId) || appState.facultyMembers[0];
  const currentUser = appState.currentUser;
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="faculty-book-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
          <div class="faculty-avatar-circle" style="background:${f.avatarColor}; width:48px; height:48px; font-size:1.1rem;">
            ${f.name.split(' ')[1] ? f.name.split(' ')[1].charAt(0) : 'د'}
          </div>
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${f.name}</h3>
            <span style="font-size:0.78rem; color:var(--fbsu-primary);">${f.rank}</span>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1rem; margin-bottom:1.25rem;">
          <div style="font-size:0.8rem; color:var(--text-dim); margin-bottom:0.25rem;">${isAr ? 'مكتب المقابلة والموقع الأكاديمي:' : 'Office Location:'}</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--text-main);">${f.office}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">${f.daysText}</div>
        </div>

        <!-- Topic selection -->
        <div class="form-group">
          <label class="form-label">${isAr ? 'موضوع المقابلة والاستشارة الأكاديمية:' : 'Discussion Topic:'}</label>
          <select id="faculty-topic-select" class="form-control">
            <option value="استفسار ومناقشة مشروع مادة Logic Design (التصميم المنطقي)">استفسار ومناقشة مشروع مادة Logic Design (التصميم المنطقي)</option>
            <option value="مناقشة فكرة مشروع التخرج النهائي (Senior Capstone Project)">مناقشة فكرة مشروع التخرج النهائي (Senior Capstone Project)</option>
            <option value="مراجعة الكلاس وورك والتكليف الفصلي">مراجعة الكلاس وورك والتكليف الفصلي</option>
            <option value="الإرشاد الأكاديمي ومعادلة المواد">الإرشاد الأكاديمي ومعادلة المواد</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
          <div class="form-group">
            <label class="form-label">${isAr ? 'مدة المقابلة:' : 'Duration:'}</label>
            <select id="faculty-duration-select" class="form-control">
              <option value="15 دقيقة">15 دقيقة</option>
              <option value="30 دقيقة">30 دقيقة</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${isAr ? 'الوقت المحدد:' : 'Slot Time:'}</label>
            <select id="faculty-slot-select" class="form-control">
              ${f.timeSlots.filter(s => s.available).map(s => `
                <option value="${s.time}" ${s.time === initialSlotTime ? 'selected' : ''}>${s.time}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">${isAr ? 'ملاحظات أو روابط إضافية (اختياري):' : 'Notes / Attachments:'}</label>
          <input type="text" id="faculty-notes-input" class="form-control" placeholder="مثال: استفسار حول دائرة Karnaugh Map وجدول الحقيقة" />
        </div>

        <!-- Direct Notification Alert Banner -->
        <div class="direct-alert-banner" style="margin-bottom:1.5rem;">
          ${createIcon('bell', { size: 16, color: 'var(--fbsu-gold)' })}
          <div>
            <strong>${isAr ? 'إشعار فوري تلقائي:' : 'Instant Direct Alert:'}</strong>
            ${isAr
              ? ' فور تأكيد الحجز، يُرسل إشعار فوري مباشر إلى مكتب ' + f.name + ' لجدولة موعدك واعتماده رسمياً.'
              : ' An instant priority alert is pushed directly to faculty calendar.'
            }
          </div>
        </div>

        <button class="btn-primary" id="confirm-faculty-booking-btn" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;">
          ${createIcon('checkCircle2', { size: 18, color: '#ffffff' })}
          <span>${isAr ? 'تأكيد حجز الموعد وإرسال الإشعار الفوري' : 'Confirm & Dispatch Instant Alert'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('faculty-book-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'faculty-book-backdrop') closeModal();
  });

  document.getElementById('confirm-faculty-booking-btn')?.addEventListener('click', () => {
    const topic = document.getElementById('faculty-topic-select')?.value || 'استفسار أكاديمي';
    const dur = document.getElementById('faculty-duration-select')?.value || '15 دقيقة';
    const slot = document.getElementById('faculty-slot-select')?.value || '11:15 ص';

    // Dispatch instant notification
    appState.notifications.unshift({
      id: 'notif-' + Date.now(),
      target: f.id,
      targetName: f.name,
      sender: `${currentUser.name} (${currentUser.id})`,
      title: `طلب حجز موعد ساعة مكتبية - ${topic.substring(0, 32)}...`,
      message: `قام الطالب ${currentUser.name} بحجز موعد لمدة ${dur} في الساعات المكتبية (${slot}) لمناقشة: "${topic}".`,
      time: 'الآن',
      read: false,
      icon: 'userCheck',
      badge: 'إشعار مباشر'
    });

    soundFX.playGateOpen();
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.5 } });

    closeModal();
    renderApp();
    showToast('تم إرسال الإشعار وتأكيد الموعد', `تم إرسال إشعار فوري لمكتب ${f.name} بموعدك (${slot}) لمناقشة "${topic}".`, 'bell');
  });
}

// ============================================================================
// Book Study Room / Lab Modal
// ============================================================================
function openBookRoomModal(roomId = 'ROOM-A04') {
  soundFX.playClick();
  const room = appState.studyRooms.find(r => r.id === roomId) || appState.studyRooms[1];
  const isAr = appState.currentLang === 'ar';
  const modal = document.getElementById('modal-container');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-overlay open" id="room-book-backdrop">
      <div class="modal-content-box" style="max-width:540px;">
        <button class="modal-close-btn" id="modal-close-x">
          ${createIcon('close', { size: 16 })}
        </button>

        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
          <div style="width:42px; height:42px; border-radius:var(--radius-md); background:var(--fbsu-primary-light); color:var(--fbsu-primary); display:flex; align-items:center; justify-content:center;">
            ${createIcon('doorClosed', { size: 20, color: 'var(--fbsu-primary)' })}
          </div>
          <div>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${room.name}</h3>
            <span style="font-size:0.78rem; color:var(--fbsu-primary);">${room.building} • سعة: ${room.capacity}</span>
          </div>
        </div>

        <!-- Purpose selection -->
        <div class="form-group">
          <label class="form-label">${isAr ? 'الغرض والنشاط الطلابي:' : 'Teamwork Purpose:'}</label>
          <select id="room-purpose-select" class="form-control">
            <option value="أداء Classwork و Assignment جماعي">أداء Classwork و Assignment جماعي</option>
            <option value="حل Homework وتكليفات أسبوعية">حل Homework وتكليفات أسبوعية</option>
            <option value="اجتماع فريق مشروع التخرج والبرمجة">اجتماع فريق مشروع التخرج والبرمجة</option>
            <option value="مذاكرة جماعية لاختبار الميدتيرم">مذاكرة جماعية لاختبار الميدتيرم</option>
          </select>
        </div>

        <!-- Team members -->
        <div class="form-group">
          <label class="form-label">${isAr ? 'أعضاء المجموعة المشاركين بالعمل:' : 'Team Members:'}</label>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.82rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" checked disabled style="accent-color:var(--fbsu-primary);" />
              <span>إياد الحربي (أداء Classwork)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--fbsu-primary);" id="chk-rakan" />
              <span>راكان المطيري (أداء Assignment)</span>
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--fbsu-primary);" id="chk-abdulaziz" />
              <span>عبد العزيز البلوي (أداء Homework)</span>
            </label>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
          <div class="form-group">
            <label class="form-label">${isAr ? 'وقت الدخول:' : 'Start Time:'}</label>
            <input type="text" id="room-start-time" class="form-control" value="09:00 ص" />
          </div>

          <div class="form-group">
            <label class="form-label">${isAr ? 'موعد الخروج الإلزامي:' : 'Strict Exit Time:'}</label>
            <input type="text" id="room-end-time" class="form-control" value="09:20 ص (20 دقيقة)" />
          </div>
        </div>

        <div class="wallet-routing-notice" style="margin-bottom:1.5rem;">
          ${createIcon('clock', { size: 16, color: 'var(--fbsu-primary)' })}
          <span>${isAr ? 'يتم تفعيل عداد تنازلي إلكتروني على شاشة القاعة لضمان إنهاء المهام وإخلاء القاعة في الوقت المحدد.' : 'Enforces strict countdown timer to respect slot allocation.'}</span>
        </div>

        <button class="btn-primary" id="confirm-room-booking-btn" style="width:100%; justify-content:center; padding:0.95rem; font-size:0.95rem;">
          ${createIcon('calendar', { size: 18, color: '#ffffff' })}
          <span>${isAr ? 'تأكيد حجز القاعة وتفعيل العداد التنازلي' : 'Confirm Reservation & Start Timer'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('room-book-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'room-book-backdrop') closeModal();
  });

  document.getElementById('confirm-room-booking-btn')?.addEventListener('click', () => {
    const purpose = document.getElementById('room-purpose-select')?.value || 'عمل جماعي';
    const targetRoom = appState.studyRooms.find(r => r.id === room.id);
    if (targetRoom) {
      targetRoom.status = 'in-use';
      targetRoom.activeBooking = {
        teamLead: 'إياد الحربي',
        teamMembers: ['إياد الحربي', 'راكان المطيري', 'عبد العزيز البلوي'],
        purpose: purpose,
        startTime: '09:00 ص',
        endTime: '09:20 ص',
        totalMinutes: 20,
        remainingMinutes: 20
      };
    }

    soundFX.playSuccess();
    confetti({ particleCount: 80, spread: 50, origin: { y: 0.5 } });

    closeModal();
    renderApp();
    showToast('تم حجز القاعة بنجاح', `تم حجز ${room.name} حتى الساعة 09:20 ص وبدأ العداد التنازلي.`, 'doorClosed');
  });
}

function closeModal() {
  const modal = document.getElementById('modal-container');
  if (modal) modal.innerHTML = '';
}


// ============================================================================
// Interactive Listeners
// ============================================================================
function attachEventListeners() {
  // Tab change handlers across nav, dropdowns, and subnav chips
  document.querySelectorAll('.nav-item[data-tab], .dropdown-item[data-tab], .subnav-chip-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab) {
        appState.activeTab = tab;
        renderApp();
      }
    });
  });

  // Nav Dropdowns mobile & click toggle
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = trigger.closest('.nav-dropdown-group');
      const wasOpen = parent?.classList.contains('open');
      document.querySelectorAll('.nav-dropdown-group').forEach(g => g.classList.remove('open'));
      if (!wasOpen && parent) {
        parent.classList.add('open');
      }
    });
  });

  // Close dropdowns on outside document click
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown-group').forEach(g => g.classList.remove('open'));
  });

  document.getElementById('hero-explore-map-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'map';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-quick-tutoring-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'tutoring';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-quick-office-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'office-hours';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-quick-rooms-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'rooms';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-run-sim-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'simulator';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  document.getElementById('hero-quick-gate-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    appState.activeTab = 'gate';
    renderApp();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  // Auth Button
  document.getElementById('open-auth-btn')?.addEventListener('click', () => {
    openAuthModal('login');
  });

  document.getElementById('open-wallet-btn')?.addEventListener('click', openWalletModal);
  document.getElementById('open-notifications-btn')?.addEventListener('click', openNotificationsModal);
  document.getElementById('quick-pay-tuition-btn')?.addEventListener('click', openTuitionPaymentModal);
  document.getElementById('open-create-session-btn')?.addEventListener('click', openCreateTutoringModal);

  // Tutoring Filter Buttons
  document.querySelectorAll('.hub-filter-btn[data-tutor-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      appState.tutoringFilter = e.currentTarget.getAttribute('data-tutor-filter');
      renderApp();
    });
  });

  // Book Tutoring Buttons
  document.querySelectorAll('.book-tutoring-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sessionId = e.currentTarget.getAttribute('data-session-id');
      openBookTutoringModal(sessionId);
    });
  });

  // Office Hours Booking Buttons
  document.querySelectorAll('.open-faculty-booking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fid = e.currentTarget.getAttribute('data-faculty-id');
      openBookOfficeHoursModal(fid);
    });
  });

  document.querySelectorAll('.time-slot-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fid = e.currentTarget.getAttribute('data-faculty-id');
      const slot = e.currentTarget.getAttribute('data-slot-time');
      openBookOfficeHoursModal(fid, slot);
    });
  });

  // Study Rooms Buttons
  document.getElementById('open-book-room-btn')?.addEventListener('click', () => {
    openBookRoomModal('ROOM-A04');
  });

  document.querySelectorAll('.book-room-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = e.currentTarget.getAttribute('data-room-id');
      openBookRoomModal(roomId);
    });
  });

  document.querySelectorAll('.extend-lab-time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.activeRoomCountdown += 10;
      soundFX.playClick();
      showToast('تم تمديد وقت المعمل', 'تمت إضافة 10 دقائق لجلسة العمل الجماعي بمعمل الحاسب 102.', 'clock');
      renderApp();
    });
  });

  document.querySelectorAll('.release-lab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lab = appState.studyRooms.find(r => r.id === 'LAB-102');
      if (lab) {
        lab.status = 'available';
        lab.activeBooking = null;
      }
      soundFX.playSuccess();
      showToast('تم إخلاء المعمل', 'تم إنهاء الجلسة وتسليم معمل الحاسب 102 بنجاح.', 'checkCircle2');
      renderApp();
    });
  });

  document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
    soundFX.enabled = !soundFX.enabled;
    if (soundFX.enabled) soundFX.playClick();
    renderApp();
  });

  document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    appState.currentLang = appState.currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = appState.currentLang;
    document.documentElement.dir = appState.currentLang === 'ar' ? 'rtl' : 'ltr';
    renderApp();
  });

  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    document.body.classList.toggle('theme-light');
    renderApp();
  });

  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const zone = e.currentTarget.getAttribute('data-zone');
      appState.activeZoneFilter = zone;
      renderApp();
    });
  });

  document.querySelectorAll('.parking-spot-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const spotId = parseInt(e.currentTarget.getAttribute('data-spot-id'));
      const spot = appState.parkingSpots.find(s => s.id === spotId);
      if (spot) {
        openSpotModal(spot);
      }
    });
  });

  document.querySelectorAll('.sim-step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const stepIdx = parseInt(e.currentTarget.getAttribute('data-sim-step'));
      goToSimStep(stepIdx);
    });
  });

  document.getElementById('sim-prev-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    if (appState.simStep > 0) {
      goToSimStep(appState.simStep - 1);
    }
  });

  document.getElementById('sim-next-btn')?.addEventListener('click', () => {
    soundFX.playClick();
    if (appState.simStep < SIMULATOR_STAGES.length - 1) {
      goToSimStep(appState.simStep + 1);
    } else {
      goToSimStep(0);
    }
  });

  document.getElementById('sim-autoplay-btn')?.addEventListener('click', () => {
    toggleSimAutoPlay();
  });

  document.querySelectorAll('.pattern-option[data-plate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      const plate = e.currentTarget.getAttribute('data-plate');
      appState.gateScannedPlate = plate;
      appState.gateStatus = 'idle';
      appState.gateArmOpen = false;
      renderApp();
    });
  });

  document.getElementById('trigger-scan-btn')?.addEventListener('click', triggerGateScan);

  document.querySelectorAll('#pattern-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#pattern-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
    });
  });

  document.querySelectorAll('#tariff-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#tariff-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const tariff = e.currentTarget.getAttribute('data-tariff');
      const timeGroup = document.getElementById('hourly-time-group');
      const totalEl = document.getElementById('ticket-total-price');
      if (tariff === 'hourly') {
        if (timeGroup) timeGroup.style.display = 'block';
        if (totalEl) totalEl.textContent = '11.50 ر.س';
      } else if (tariff === 'daily') {
        if (timeGroup) timeGroup.style.display = 'none';
        if (totalEl) totalEl.textContent = '15.00 ر.س';
      } else {
        if (timeGroup) timeGroup.style.display = 'none';
        if (totalEl) totalEl.textContent = '225.00 ر.س*';
      }
    });
  });

  document.getElementById('confirm-booking-btn')?.addEventListener('click', () => {
    const user = appState.currentUser;
    openDigitalPassModal({
      spotId: 2,
      college: 'كلية الحاسب الآلي',
      userName: user.name,
      userId: user.id,
      plate: `${user.plateLetters} ${user.plateNumbers}`,
      duration: 'أحد / ثلاثاء (10:15 - 01:00)'
    });
  });

  document.querySelectorAll('#break-hours-picker .pattern-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      soundFX.playClick();
      document.querySelectorAll('#break-hours-picker .pattern-option').forEach(el => el.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      const hours = parseInt(e.currentTarget.getAttribute('data-hours') || '3');
      const earn = (hours * 5.75).toFixed(2);
      const earnEl = document.getElementById('calculated-earn');
      if (earnEl) earnEl.textContent = `${earn} ر.س`;
    });
  });

  document.getElementById('activate-flex-share-btn')?.addEventListener('click', () => {
    soundFX.playSuccess();
    const spot1 = appState.parkingSpots.find(s => s.id === 1);
    if (spot1) {
      spot1.status = 'flex-share';
      spot1.occupant = 'متاح للتبادل الذكي';
      spot1.timeLeft = 'بريك 3 ساعات';
    }
    appState.currentUser.walletBalance += 17.25;
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    const isArSwap = (typeof appState !== 'undefined' && appState.currentLang === 'ar') || document.documentElement.lang === 'ar';
    showToast(
      isArSwap
        ? 'تم تفعيل وضع التبادل الذكي لموقفك بنجاح! موعد عودتك مضمون بنسبة 100%، وتم إيداع 17.25 ر.س في محفظتك الجامعية!'
        : 'Smart parking swap activated! Your return time is 100% guaranteed, and 17.25 SAR was deposited to your wallet!',
      'success',
      isArSwap ? 'التبادل الذكي نشط' : 'Smart Swap Activated',
      6000
    );
    renderApp();
  });
}

function goToSimStep(stepIdx) {
  appState.simStep = stepIdx;
  const stage = SIMULATOR_STAGES[stepIdx];

  const spot1 = appState.parkingSpots.find(s => s.id === 1);
  if (spot1) {
    spot1.status = stage.spot1Status;
    spot1.occupant = stage.spot1Occupant;
    spot1.plate = stage.spot1Plate;
  }

  renderApp();
}

function toggleSimAutoPlay() {
  if (appState.simAutoPlaying) {
    clearInterval(appState.simTimer);
    appState.simAutoPlaying = false;
    renderApp();
  } else {
    appState.simAutoPlaying = true;
    renderApp();
    appState.simTimer = setInterval(() => {
      if (appState.simStep < SIMULATOR_STAGES.length - 1) {
        goToSimStep(appState.simStep + 1);
      } else {
        goToSimStep(0);
      }
    }, 4500);
  }
}

function triggerGateScan() {
  soundFX.playScan();
  appState.gateStatus = 'scanning';
  appState.gateArmOpen = false;
  renderApp();

  setTimeout(() => {
    soundFX.playGateOpen();
    appState.gateStatus = 'granted';
    appState.gateArmOpen = true;
    renderApp();

    setTimeout(() => {
      appState.gateArmOpen = false;
      renderApp();
    }, 4000);
  }, 1200);
}

function updateLiveClock() {
  const clockEl = document.getElementById('live-time-clock');
  if (!clockEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  clockEl.textContent = timeStr;
  setTimeout(updateLiveClock, 1000);
}

// Initial Render
renderApp();

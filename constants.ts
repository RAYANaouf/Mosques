import { Student, Group, CalendarEvent, Teacher } from './types';

export const QURAN_SURAHS = [
  "1. الفاتحة", "2. البقرة", "3. آل عمران", "4. النساء", "5. المائدة", "6. الأنعام", "7. الأعراف", "8. الأنفال", "9. التوبة", "10. يونس",
  "11. هود", "12. يوسف", "13. الرعد", "14. إبراهيم", "15. الحجر", "16. النحل", "17. الإسراء", "18. الكهف", "19. مريم", "20. طه",
  "21. الأنبياء", "22. الحج", "23. المؤمنون", "24. النور", "25. الفرقان", "26. الشعراء", "27. النمل", "28. القصص", "29. العنكبوت", "30. الروم",
  "31. لقمان", "32. السجدة", "33. الأحزاب", "34. سبأ", "35. فاطر", "36. يس", "37. الصافات", "38. ص", "39. الزمر", "40. غافر",
  "41. فصلت", "42. الشورى", "43. الزخرف", "44. الدخان", "45. الجاثية", "46. الأحقاف", "47. محمد", "48. الفتح", "49. الحجرات", "50. ق",
  "51. الذاريات", "52. الطور", "53. النجم", "54. القمر", "55. الرحمن", "56. الواقعة", "57. الحديد", "58. المجادلة", "59. الحشر", "60. الممتحنة",
  "61. الصف", "62. الجمعة", "63. المنافقون", "64. التغابن", "65. الطلاق", "66. التحريم", "67. الملك", "68. القلم", "69. الحاقة", "70. المعارج",
  "71. نوح", "72. الجن", "73. المزمل", "74. المدثر", "75. القيامة", "76. الإنسان", "77. المرسلات", "78. النبأ", "79. النازعات", "80. عبس",
  "81. التكوير", "82. الانفطار", "83. المطففين", "84. الانشقاق", "85. البروج", "86. الطارق", "87. الأعلى", "88. الغاشية", "89. الفجر", "90. البلد",
  "91. الشمس", "92. الليل", "93. الضحى", "94. الشرح", "95. التين", "96. العلق", "97. القدر", "98. البينة", "99. الزلزلة", "100. العاديات",
  "101. القارعة", "102. التكاثر", "103. العصر", "104. الهمزة", "105. الفيل", "106. قريش", "107. الماعون", "108. الكوثر", "109. الكافرون", "110. النصر",
  "111. المسد", "112. الإخلاص", "113. الفلق", "114. الناس"
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'الشيخ عبد الله',
    subject: 'القرآن والتجويد',
    email: 'abdullah@mosque.com',
    password: 'password',
    yearsExperience: 15
  },
  {
    id: 't2',
    name: 'أ. مريم',
    subject: 'الدراسات الإسلامية',
    email: 'maryam@mosque.com',
    password: 'password',
    yearsExperience: 8
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'أحمد علي',
    grade: 85,
    behaviorScore: 9,
    interests: ['تلاوة القرآن', 'كرة القدم'],
    notes: 'طالب مجتهد جداً.',
    birthDate: '2010-05-15',
    age: 14,
    email: 'ahmed@example.com',
    password: 'password',
    phone: '555-0101',
    parentName: 'علي حسن',
    parentPhone: '555-0202',
    parentEmail: 'ali@parent.com',
    parentPassword: 'password',
    currentSurah: '2. البقرة',
    currentAyah: 15
  },
  {
    id: 's2',
    name: 'فاطمة عمر',
    grade: 92,
    behaviorScore: 10,
    interests: ['التاريخ الإسلامي', 'الرسم'],
    birthDate: '2011-03-20',
    age: 13,
    email: 'fatima@example.com',
    password: 'password',
    phone: '555-0303',
    parentName: 'عمر خالد',
    parentPhone: '555-0404',
    parentEmail: 'omar@parent.com',
    parentPassword: 'password',
    currentSurah: '36. يس',
    currentAyah: 5
  },
   {
    id: 's3',
    name: 'يوسف إبراهيم',
    grade: 75,
    behaviorScore: 7,
    interests: ['كرة السلة', 'القراءة'],
    notes: 'يحتاج للتركيز على أحكام التجويد.',
    birthDate: '2009-12-10',
    age: 14,
    email: 'yusuf@example.com',
    password: 'password',
    phone: '555-0505',
    parentName: 'إبراهيم يوسف',
    parentPhone: '555-0606',
    parentEmail: 'ibrahim@parent.com',
    parentPassword: 'password',
    currentSurah: '18. الكهف',
    currentAyah: 40
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'حلقة المتميزين (أ)',
    description: 'مستوى متقدم في الحفظ والمراجعة',
    studentIds: ['s1', 's2'],
    teacherId: 't1'
  },
  {
    id: 'g2',
    name: 'شباب المستقبل',
    description: 'لقاءات أسبوعية ومناقشات',
    studentIds: ['s3'],
    teacherId: 't2'
  }
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'حلقة الفجر',
    startTime: new Date(tomorrow.setHours(5, 30, 0, 0)).toISOString(),
    durationMinutes: 60,
    type: 'class',
    description: 'مراجعة سورة البقرة',
    groupId: 'g1',
    teacherId: 't1'
  },
  {
    id: 'e2',
    title: 'اجتماع المعلمين',
    startTime: new Date(dayAfter.setHours(14, 0, 0, 0)).toISOString(),
    durationMinutes: 45,
    type: 'meeting',
    description: 'التنسيق الأسبوعي',
    teacherId: 't1'
  },
    {
    id: 'e3',
    title: 'درس فقه',
    startTime: new Date(dayAfter.setHours(16, 0, 0, 0)).toISOString(),
    durationMinutes: 90,
    type: 'class',
    description: 'باب الطهارة',
    groupId: 'g2',
    teacherId: 't2'
  }
];
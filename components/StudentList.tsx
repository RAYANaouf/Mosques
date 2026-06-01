import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { User, Trash2, TrendingUp, Star, AlertTriangle, Plus, X, Phone, Mail, Calendar, BookOpen, UserCheck, Lock, Search, Filter } from 'lucide-react';
import { QURAN_SURAHS } from '../constants';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
  onAdd: (student: Omit<Student, 'id'>) => void;
  onSelect: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onDelete, onAdd, onSelect }) => {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [behaviorFilter, setBehaviorFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 0,
    behaviorScore: 10,
    interests: '',
    birthDate: '',
    age: 0,
    phone: '',
    email: '',
    password: '',
    notes: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentPassword: '',
    currentSurah: '',
    currentAyah: 1
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStudentToDelete(id);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete);
      setStudentToDelete(null);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const age = calculateAge(date);
    setNewStudent(prev => ({ ...prev, birthDate: date, age }));
  };

  const getProgress = (surah: string | undefined) => {
    if (!surah) return 0;
    const index = QURAN_SURAHS.indexOf(surah);
    return index !== -1 ? Math.round(((index + 1) / 114) * 100) : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: newStudent.name,
      grade: Number(newStudent.grade),
      behaviorScore: Number(newStudent.behaviorScore),
      interests: newStudent.interests ? newStudent.interests.split(',').map(i => i.trim()).filter(i => i) : [],
      birthDate: newStudent.birthDate,
      age: newStudent.age,
      phone: newStudent.phone,
      email: newStudent.email,
      password: newStudent.password,
      notes: newStudent.notes,
      parentName: newStudent.parentName,
      parentPhone: newStudent.parentPhone,
      parentEmail: newStudent.parentEmail,
      parentPassword: newStudent.parentPassword,
      currentSurah: newStudent.currentSurah,
      currentAyah: Number(newStudent.currentAyah)
    });
    setIsAdding(false);
    setNewStudent({
      name: '',
      grade: 0,
      behaviorScore: 10,
      interests: '',
      birthDate: '',
      age: 0,
      phone: '',
      email: '',
      password: '',
      notes: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      parentPassword: '',
      currentSurah: '',
      currentAyah: 1
    });
  };

  const allInterests = Array.from(new Set(students.flatMap(s => s.interests || []))).filter(Boolean);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.id.includes(searchTerm);
    
    let matchesGrade = true;
    if (gradeFilter === 'excellent') matchesGrade = student.grade >= 90;
    else if (gradeFilter === 'good') matchesGrade = student.grade >= 70 && student.grade < 90;
    else if (gradeFilter === 'needs_improvement') matchesGrade = student.grade < 70;

    let matchesBehavior = true;
    if (behaviorFilter === 'excellent') matchesBehavior = student.behaviorScore >= 9;
    else if (behaviorFilter === 'good') matchesBehavior = student.behaviorScore >= 7 && student.behaviorScore < 9;
    else if (behaviorFilter === 'needs_improvement') matchesBehavior = student.behaviorScore < 7;

    let matchesInterest = true;
    if (interestFilter !== 'all') {
      matchesInterest = (student.interests || []).includes(interestFilter);
    }

    return matchesSearch && matchesGrade && matchesBehavior && matchesInterest;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">دليل الطلاب</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <User size={18} />
          إضافة طالب
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
          <Filter size={18} />
          <span>تصفية الطلاب</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="البحث بالاسم أو الرقم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="all">جميع الدرجات</option>
            <option value="excellent">ممتاز (90-100)</option>
            <option value="good">جيد (70-89)</option>
            <option value="needs_improvement">يحتاج تحسين (&lt;70)</option>
          </select>
          <select
            value={behaviorFilter}
            onChange={(e) => setBehaviorFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="all">جميع السلوكيات</option>
            <option value="excellent">ممتاز (9-10)</option>
            <option value="good">جيد (7-8)</option>
            <option value="needs_improvement">يحتاج تحسين (&lt;7)</option>
          </select>
          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="all">جميع الاهتمامات</option>
            {allInterests.map(interest => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const progress = getProgress(student.currentSurah);
          
          return (
            <div 
              key={student.id} 
              onClick={() => onSelect(student)}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{student.name}</h3>
                    <p className="text-xs text-gray-500">رقم الطالب: {student.id}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDeleteClick(e, student.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Progress Bar Section */}
              <div className="mt-5 mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-indigo-600"/> إنجاز القرآن
                  </span>
                  <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 px-2 py-1.5 rounded border border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">السورة</span>
                      <span className="text-xs font-semibold text-gray-700 truncate max-w-[100px]">{student.currentSurah || '-'}</span>
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">الآية</span>
                      <span className="text-xs font-semibold text-gray-700">{student.currentAyah || '-'}</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded flex flex-col">
                  <span className="text-gray-500 text-xs flex items-center gap-1"><TrendingUp size={12}/> الدرجة</span>
                  <span className={`font-semibold ${student.grade >= 90 ? 'text-green-600' : student.grade >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {student.grade}%
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded flex flex-col">
                  <span className="text-gray-500 text-xs flex items-center gap-1"><Star size={12}/> السلوك</span>
                  <span className="font-semibold text-gray-800">{student.behaviorScore}/10</span>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">الاهتمامات</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {student.interests.map((interest, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-[fadeIn_0.2s_ease-out]">
             <div className="flex items-center gap-3 text-red-600 mb-4">
               <div className="bg-red-100 p-2 rounded-full">
                 <AlertTriangle size={24} />
               </div>
               <h3 className="text-xl font-bold">حذف الطالب؟</h3>
             </div>
             <p className="text-gray-600 mb-6">
               هل أنت متأكد من رغبتك في حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء وسيتم إزالته من جميع المجموعات.
             </p>
             <div className="flex justify-end gap-3">
               <button
                 onClick={() => setStudentToDelete(null)}
                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
               >
                 إلغاء
               </button>
               <button
                 onClick={confirmDelete}
                 className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
               >
                 حذف الطالب
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-[fadeIn_0.2s_ease-out] overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">إضافة طالب جديد</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User size={16} className="text-indigo-600"/> المعلومات الشخصية
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                    <input
                      required
                      type="text"
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">السورة الحالية</label>
                      <div className="relative">
                        <BookOpen className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        <select
                          value={newStudent.currentSurah}
                          onChange={e => setNewStudent({...newStudent, currentSurah: e.target.value})}
                          className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                          <option value="">-- اختر السورة --</option>
                          {QURAN_SURAHS.map(surah => (
                            <option key={surah} value={surah}>{surah}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الآية</label>
                      <input
                        type="number"
                        min="1"
                        value={newStudent.currentAyah}
                        onChange={e => setNewStudent({...newStudent, currentAyah: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                      <input
                        type="date"
                        value={newStudent.birthDate}
                        onChange={handleDateChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">العمر (تلقائي)</label>
                      <input
                        type="number"
                        readOnly
                        value={newStudent.age}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={newStudent.email}
                        onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="student@example.com"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                      <input
                        type="password"
                        value={newStudent.password}
                        onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={newStudent.phone}
                        onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                      <textarea
                        value={newStudent.notes}
                        onChange={e => setNewStudent({...newStudent, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={2}
                      />
                  </div>
                </div>
              </div>

              {/* Parent Section */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  <UserCheck size={16} className="text-indigo-600"/> بيانات ولي الأمر
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم ولي الأمر</label>
                    <input
                      type="text"
                      value={newStudent.parentName}
                      onChange={e => setNewStudent({...newStudent, parentName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">بريد ولي الأمر</label>
                      <input
                        type="email"
                        value={newStudent.parentEmail}
                        onChange={e => setNewStudent({...newStudent, parentEmail: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">هاتف ولي الأمر</label>
                      <input
                        type="tel"
                        value={newStudent.parentPhone}
                        onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كلمة مرور بوابة ولي الأمر</label>
                      <div className="relative">
                          <Lock size={16} className="absolute right-3 top-2.5 text-gray-400" />
                          <input
                            type="password"
                            value={newStudent.parentPassword}
                            onChange={e => setNewStudent({...newStudent, parentPassword: e.target.value})}
                            className="w-full pr-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                      </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  حفظ الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Teacher } from '../types';
import { UserCog, Trash2, Mail, BookOpen, AlertTriangle, X, Lock, Briefcase, User } from 'lucide-react';

interface TeacherListProps {
  teachers: Teacher[];
  onDelete: (id: string) => void;
  onSelect: (teacher: Teacher) => void;
  onAdd: (teacher: Omit<Teacher, 'id'>) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({ teachers, onDelete, onSelect, onAdd }) => {
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: '',
    email: '',
    password: '',
    yearsExperience: 0
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTeacherToDelete(id);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      onDelete(teacherToDelete);
      setTeacherToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: newTeacher.name,
      subject: newTeacher.subject,
      email: newTeacher.email,
      password: newTeacher.password,
      yearsExperience: Number(newTeacher.yearsExperience)
    });
    setIsAdding(false);
    setNewTeacher({ name: '', subject: '', email: '', password: '', yearsExperience: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">دليل المعلمين</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <UserCog size={18} />
          إضافة معلم
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div 
            key={teacher.id} 
            onClick={() => onSelect(teacher)}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer relative group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{teacher.name}</h3>
                  <p className="text-xs text-gray-500">رقم المعلم: {teacher.id}</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleDeleteClick(e, teacher.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen size={16} className="text-gray-400" />
                <span className="font-medium">{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <span>{teacher.email}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                الخبرة: <span className="font-semibold text-gray-700">{teacher.yearsExperience} سنوات</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {teacherToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-[fadeIn_0.2s_ease-out]">
             <div className="flex items-center gap-3 text-red-600 mb-4">
               <div className="bg-red-100 p-2 rounded-full">
                 <AlertTriangle size={24} />
               </div>
               <h3 className="text-xl font-bold">حذف المعلم؟</h3>
             </div>
             <p className="text-gray-600 mb-6">
               هل أنت متأكد من رغبتك في حذف هذا المعلم؟
             </p>
             <div className="flex justify-end gap-3">
               <button
                 onClick={() => setTeacherToDelete(null)}
                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
               >
                 إلغاء
               </button>
               <button
                 onClick={confirmDelete}
                 className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
               >
                 حذف المعلم
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">إضافة معلم جديد</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-2.5 text-gray-400" size={18} />
                  <input
                    required
                    type="text"
                    value={newTeacher.name}
                    onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                    className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="الاسم"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المادة / القسم</label>
                <div className="relative">
                  <BookOpen className="absolute right-3 top-2.5 text-gray-400" size={18} />
                  <input
                    required
                    type="text"
                    value={newTeacher.subject}
                    onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                    className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="التخصص"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                   <div className="relative">
                      <Mail className="absolute right-3 top-2.5 text-gray-400" size={18} />
                      <input
                        required
                        type="email"
                        value={newTeacher.email}
                        onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                        className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                   <div className="relative">
                      <Lock className="absolute right-3 top-2.5 text-gray-400" size={18} />
                      <input
                        required
                        type="password"
                        value={newTeacher.password}
                        onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                        className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سنوات الخبرة</label>
                <div className="relative">
                  <Briefcase className="absolute right-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={newTeacher.yearsExperience}
                    onChange={e => setNewTeacher({...newTeacher, yearsExperience: Number(e.target.value)})}
                    className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
                  حفظ المعلم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
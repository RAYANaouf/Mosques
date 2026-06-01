import React, { useState } from 'react';
import { Teacher, Group, CalendarEvent, Student } from '../types';
import { ArrowRight, Mail, BookOpen, Clock, Calendar, Users, Briefcase, UserCog, Lock, Save, Check, User } from 'lucide-react';

interface TeacherDetailsProps {
  teacher: Teacher;
  groups: Group[];
  events: CalendarEvent[];
  students: Student[];
  onBack: () => void;
  onUpdate: (teacher: Teacher) => void;
  standalone?: boolean;
}

type TabType = 'details' | 'groups' | 'seance' | 'settings';

export const TeacherDetails: React.FC<TeacherDetailsProps> = ({ teacher, groups, events, students, onBack, onUpdate, standalone = false }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [formData, setFormData] = useState({
    name: teacher.name,
    email: teacher.email,
    subject: teacher.subject,
    password: teacher.password || '',
  });
  const [isSaved, setIsSaved] = useState(false);

  // Filter data for this teacher
  const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
  const teacherEvents = events.filter(e => e.teacherId === teacher.id).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...teacher,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      password: formData.password,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!standalone && (
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition"
          >
            <ArrowRight size={18} />
            العودة للدليل
          </button>
        )}
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-3xl shrink-0">
             {teacher.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{teacher.subject}</p>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1"><Mail size={16} /> {teacher.email}</span>
              <span className="flex items-center gap-1"><Briefcase size={16} /> خبرة {teacher.yearsExperience} سنوات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            التفاصيل
          </button>
          <button 
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'groups' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الحلقات
          </button>
          <button 
            onClick={() => setActiveTab('seance')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'seance' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الحصص
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الإعدادات
          </button>
        </div>

        <div className="p-6 min-h-[300px]">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-500"/> إحصائيات التدريس
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex justify-between"><span>عدد الحلقات:</span> <span className="font-medium">{teacherGroups.length}</span></li>
                    <li className="flex justify-between"><span>الحصص الأسبوعية:</span> <span className="font-medium">{teacherEvents.length}</span></li>
                    <li className="flex justify-between"><span>المادة:</span> <span className="font-medium">{teacher.subject}</span></li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-indigo-500"/> أوقات العمل
                  </h3>
                  <p className="text-sm text-gray-600">ساعات العمل الرسمية: 8:00 صباحاً - 4:00 عصراً</p>
                  <p className="text-sm text-gray-600 mt-2 italic">تواصل عبر البريد للمواعيد الخاصة.</p>
                </div>
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-4">الحلقات المسندة</h3>
              {teacherGroups.length === 0 ? (
                <p className="text-gray-400 italic">لا توجد حلقات مسندة لهذا المعلم.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacherGroups.map(group => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition">
                      <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                        <Users size={18} /> {group.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{group.studentIds.length} طلاب</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seance / Sessions Tab */}
          {activeTab === 'seance' && (
            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 mb-4">الحصص القادمة</h3>
               {teacherEvents.length === 0 ? (
                 <p className="text-gray-400 italic">لا توجد حصص مجدولة.</p>
               ) : (
                 <div className="space-y-3">
                   {teacherEvents.map(event => {
                     const date = new Date(event.startTime);
                     const group = groups.find(g => g.id === event.groupId);
                     return (
                      <div key={event.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0 w-16 text-center bg-white rounded border border-gray-200 p-2">
                           <span className="block text-xs font-bold text-gray-500 uppercase">{date.toLocaleDateString('ar-EG', { weekday: 'short' })}</span>
                           <span className="block text-xl font-bold text-gray-800">{date.getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{event.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Clock size={14} /> 
                            {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(date.getTime() + event.durationMinutes * 60000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {group && (
                            <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              {group.name}
                            </span>
                          )}
                        </div>
                      </div>
                     );
                   })}
                 </div>
               )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <UserCog size={24} className="text-indigo-600" />
                 إعدادات ملف المعلم
               </h3>
               
               <form onSubmit={handleUpdate} className="space-y-6">
                 <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم المعروض</label>
                      <div className="relative">
                        <User className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
                      <div className="relative">
                        <BookOpen className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="email"
                          readOnly
                          value={formData.email}
                          className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="text" 
                          required
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                   <button
                     type="submit"
                     className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                   >
                     <Save size={18} />
                     حفظ التغييرات
                   </button>
                   {isSaved && (
                     <span className="text-green-600 flex items-center gap-1.5 text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
                       <Check size={18} />
                       تم تحديث الملف!
                     </span>
                   )}
                 </div>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Student, Group, CalendarEvent } from '../types';
import { ArrowRight, Mail, Phone, Calendar, Users, UserCog, Lock, Save, Check, User, TrendingUp, Star, UserCheck, BookOpen, Clock, Plus, X, LogOut } from 'lucide-react';
import { QURAN_SURAHS } from '../constants';

interface StudentDetailsProps {
  student: Student;
  groups: Group[];
  events: CalendarEvent[];
  onBack: () => void;
  onUpdate: (student: Student) => void;
  onUpdateGroup: (group: Group) => void;
}

type TabType = 'details' | 'groups' | 'schedule' | 'settings';

export const StudentDetails: React.FC<StudentDetailsProps> = ({ student, groups, events, onBack, onUpdate, onUpdateGroup }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email || '',
    phone: student.phone || '',
    password: student.password || '',
    parentName: student.parentName || '',
    parentPhone: student.parentPhone || '',
    parentEmail: student.parentEmail || '',
    parentPassword: student.parentPassword || '',
    grade: student.grade,
    behaviorScore: student.behaviorScore,
    notes: student.notes || '',
    currentSurah: student.currentSurah || '',
    currentAyah: student.currentAyah || 1
  });
  const [isSaved, setIsSaved] = useState(false);

  // Filter data
  const studentGroups = groups.filter(g => g.studentIds.includes(student.id));
  const availableGroups = groups.filter(g => !g.studentIds.includes(student.id));
  const groupIds = studentGroups.map(g => g.id);
  const studentEvents = events
    .filter(e => e.groupId && groupIds.includes(e.groupId))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const getProgress = (surah: string | undefined) => {
    if (!surah) return 0;
    const index = QURAN_SURAHS.indexOf(surah);
    return index !== -1 ? Math.round(((index + 1) / 114) * 100) : 0;
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...student,
      ...formData,
      grade: Number(formData.grade),
      behaviorScore: Number(formData.behaviorScore),
      currentAyah: Number(formData.currentAyah)
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleEnroll = () => {
    if (selectedGroupId) {
      const groupToUpdate = groups.find(g => g.id === selectedGroupId);
      if (groupToUpdate) {
        onUpdateGroup({
          ...groupToUpdate,
          studentIds: [...groupToUpdate.studentIds, student.id]
        });
        setSelectedGroupId('');
        setIsEnrolling(false);
      }
    }
  };

  const handleUnenroll = (group: Group) => {
    if(window.confirm(`هل أنت متأكد من إزالة ${student.name} من ${group.name}؟`)) {
        onUpdateGroup({
            ...group,
            studentIds: group.studentIds.filter(id => id !== student.id)
        });
    }
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition"
          >
            <ArrowRight size={18} />
            العودة للدليل
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-start">
           <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl shrink-0">
             {student.name.charAt(0)}
           </div>
           <div>
             <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
             <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
               {student.email && <span className="flex items-center gap-1"><Mail size={16} /> {student.email}</span>}
               {student.phone && <span className="flex items-center gap-1"><Phone size={16} /> {student.phone}</span>}
               <span className="flex items-center gap-1"><Calendar size={16} /> العمر: {student.age || '-'}</span>
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
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'schedule' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الجدول
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 px-4 text-center font-medium transition whitespace-nowrap ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الإعدادات
          </button>
          </div>

          <div className="p-6 min-h-[300px]">
             {activeTab === 'details' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-500"/> الأداء والإنجاز
                             </h3>
                             <div className="space-y-4">
                                
                                <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                                <BookOpen size={18} />
                                            </div>
                                            <h4 className="font-bold text-gray-800">حفظ القرآن</h4>
                                        </div>
                                        <span className="text-lg font-bold text-indigo-600">{getProgress(student.currentSurah)}%</span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                                        <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${getProgress(student.currentSurah)}%` }}></div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                            <span className="block text-xs text-gray-500 uppercase font-semibold">السورة الحالية</span>
                                            <span className="font-bold text-gray-800">{student.currentSurah || 'لم يبدأ'}</span>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs text-gray-500 uppercase font-semibold">رقم الآية</span>
                                            <span className="font-bold text-gray-800">{student.currentAyah || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">الدرجة</span>
                                        <span className="font-bold">{student.grade}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${student.grade}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">نقاط السلوك</span>
                                        <span className="font-bold">{student.behaviorScore}/10</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${student.behaviorScore * 10}%`}}></div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <UserCheck size={18} className="text-indigo-500"/> ولي الأمر
                             </h3>
                             <ul className="space-y-3 text-sm">
                                <li className="flex gap-2">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-gray-600">الاسم:</span>
                                    <span className="font-medium text-gray-800">{student.parentName || 'غير متوفر'}</span>
                                </li>
                                <li className="flex gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-600">الهاتف:</span>
                                    <span className="font-medium text-gray-800">{student.parentPhone || 'غير متوفر'}</span>
                                </li>
                                <li className="flex gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-600">البريد:</span>
                                    <span className="font-medium text-gray-800">{student.parentEmail || 'غير متوفر'}</span>
                                </li>
                             </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <h3 className="font-semibold text-gray-800 mb-2">ملاحظات</h3>
                        <p className="text-sm text-gray-700">{student.notes || 'لا توجد ملاحظات إضافية.'}</p>
                    </div>
                 </div>
             )}

             {activeTab === 'groups' && (
                 <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">الحلقات المسجلة</h3>
                    <button 
                        onClick={() => setIsEnrolling(!isEnrolling)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${isEnrolling ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {isEnrolling ? <X size={16} /> : <Plus size={16} />}
                        {isEnrolling ? 'إلغاء' : 'تسجيل في حلقة'}
                    </button>
                  </div>

                  {isEnrolling && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-indigo-100 mb-6 animate-[fadeIn_0.2s_ease-out]">
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm">اختر حلقة للتسجيل فيها:</h4>
                        {availableGroups.length === 0 ? (
                            <div className="text-gray-500 italic text-sm">الطالب مسجل في جميع الحلقات المتاحة.</div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                                >
                                    <option value="">-- اختر الحلقة --</option>
                                    {availableGroups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleEnroll}
                                    disabled={!selectedGroupId}
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    تسجيل
                                </button>
                            </div>
                        )}
                    </div>
                  )}

                  {studentGroups.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <Users size={32} className="mx-auto mb-2 opacity-30" />
                      <p>الطالب غير مسجل في أي حلقة.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentGroups.map(group => (
                             <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition bg-white flex justify-between items-start group">
                                <div>
                                    <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                                        <Users size={18} /> {group.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                                </div>
                                <button 
                                    onClick={() => handleUnenroll(group)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="مغادرة الحلقة"
                                >
                                    <LogOut size={16} />
                                </button>
                             </div>
                        ))}
                    </div>
                  )}
                 </div>
             )}

             {activeTab === 'schedule' && (
                 <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 mb-4">الجدول القادم</h3>
                    {studentEvents.length === 0 ? (
                        <p className="text-gray-400 italic">لا توجد أحداث مجدولة.</p>
                    ) : (
                        <div className="space-y-3">
                            {studentEvents.map(event => {
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
                                                {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} ({event.durationMinutes} دقيقة)
                                            </p>
                                            {group && (
                                                <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                                {group.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                 </div>
             )}

             {activeTab === 'settings' && (
                 <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <UserCog size={24} className="text-indigo-600" />
                        تعديل ملف الطالب
                    </h3>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الدرجة (%)</label>
                                    <input type="number" min="0" max="100" value={formData.grade} onChange={e => setFormData({...formData, grade: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">السلوك (0-10)</label>
                                    <input type="number" min="0" max="10" value={formData.behaviorScore} onChange={e => setFormData({...formData, behaviorScore: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                             </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الإنجاز الحالي</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 relative">
                                        <BookOpen className="absolute right-3 top-2.5 text-gray-400" size={18} />
                                        <select
                                            value={formData.currentSurah}
                                            onChange={e => setFormData({...formData, currentSurah: e.target.value})}
                                            className="w-full pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            <option value="">-- اختر السورة --</option>
                                            {QURAN_SURAHS.map(surah => (
                                                <option key={surah} value={surah}>{surah}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <input 
                                            type="number" 
                                            min="1"
                                            placeholder="رقم الآية" 
                                            value={formData.currentAyah} 
                                            onChange={e => setFormData({...formData, currentAyah: Number(e.target.value)})}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                                    <input type="email" readOnly value={formData.email} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
                                    <p className="text-xs text-gray-500 mt-1">للقراءة فقط</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                                    <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                             </div>

                             <div className="pt-4 border-t border-gray-200">
                                 <h4 className="font-semibold text-gray-700 mb-3">ولي الأمر</h4>
                                 <div className="grid grid-cols-1 gap-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                                        <input type="text" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                                            <input type="text" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد</label>
                                            <input type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                     </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة مرور البوابة</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute right-3 top-2.5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={formData.parentPassword}
                                                onChange={e => setFormData({...formData, parentPassword: e.target.value})}
                                                className="w-full pr-9 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="إعادة تعيين كلمة المرور"
                                            />
                                        </div>
                                     </div>
                                 </div>
                             </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                                <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
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
                                تم التحديث بنجاح!
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
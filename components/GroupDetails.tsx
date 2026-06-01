import React, { useState } from 'react';
import { Group, Student, Teacher, CalendarEvent } from '../types';
import { ArrowRight, Users, Calendar, BookOpen, User, Clock, CheckCircle2, Plus, X, Pencil, Check } from 'lucide-react';

interface GroupDetailsProps {
  group: Group;
  students: Student[];
  teachers: Teacher[];
  events: CalendarEvent[];
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
}

type TabType = 'details' | 'student' | 'scheduler';

export const GroupDetails: React.FC<GroupDetailsProps> = ({ group, students, teachers, events, onBack, onUpdateGroup }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(group.teacherId || '');

  const groupStudents = students.filter(s => group.studentIds.includes(s.id));
  const groupTeacher = teachers.find(t => t.id === group.teacherId);
  const groupEvents = events
    .filter(e => e.groupId === group.id)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const availableStudents = students.filter(s => !group.studentIds.includes(s.id));

  const handleAddStudent = () => {
    if (selectedStudentId) {
      const updatedGroup = {
        ...group,
        studentIds: [...group.studentIds, selectedStudentId]
      };
      onUpdateGroup(updatedGroup);
      setSelectedStudentId('');
      setIsAddingStudent(false);
    }
  };

  const handleSaveTeacher = () => {
      onUpdateGroup({
          ...group,
          teacherId: selectedTeacherId
      });
      setIsEditingTeacher(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition"
        >
          <ArrowRight size={18} />
          العودة للحلقات
        </button>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-3xl shrink-0">
             <Users size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{group.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Users size={16} /> {groupStudents.length} طلاب</span>
              {groupTeacher ? (
                <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                  <User size={14} /> المعلم: {groupTeacher.name}
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                  <User size={14} /> لم يتم تعيين معلم
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            التفاصيل
          </button>
          <button 
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'student' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الطلاب
          </button>
          <button 
            onClick={() => setActiveTab('scheduler')}
            className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'scheduler' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            الجدول
          </button>
        </div>

        <div className="p-6 min-h-[300px]">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-500"/> معلومات الحلقة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">عدد الطلاب</span>
                      <span className="font-semibold">{groupStudents.length}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">الجلسات المجدولة</span>
                      <span className="font-semibold">{groupEvents.length}</span>
                    </div>
                    
                    <div className="py-2 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">المعلم المسؤول</span>
                            {!isEditingTeacher && (
                                <button 
                                    onClick={() => setIsEditingTeacher(true)} 
                                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                    <Pencil size={12}/> تغيير
                                </button>
                            )}
                        </div>
                        
                        {isEditingTeacher ? (
                            <div className="flex gap-2 mt-2">
                                <select 
                                    value={selectedTeacherId}
                                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                                >
                                    <option value="">اختر المعلم...</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handleSaveTeacher}
                                    className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700"
                                >
                                    <Check size={16} />
                                </button>
                                <button 
                                    onClick={() => { setIsEditingTeacher(false); setSelectedTeacherId(group.teacherId || ''); }}
                                    className="bg-gray-200 text-gray-600 p-1 rounded hover:bg-gray-300"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                             groupTeacher ? (
                                <span className="font-semibold text-indigo-600 block">{groupTeacher.name}</span>
                              ) : (
                                <span className="text-red-500 italic text-sm block flex items-center gap-1">
                                    <X size={14}/> معلم مفقود
                                </span>
                              )
                        )}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-indigo-600"/> الحالة
                  </h3>
                  <p className="text-indigo-800 text-sm mb-4">
                    هذه الحلقة نشطة حالياً.
                  </p>
                  <div className="flex gap-2">
                    {groupStudents.length > 0 ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">نشط</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">فارغ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Tab */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">الطلاب في {group.name}</h3>
                <button 
                  onClick={() => setIsAddingStudent(!isAddingStudent)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${isAddingStudent ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {isAddingStudent ? <X size={16} /> : <Plus size={16} />}
                  {isAddingStudent ? 'إلغاء' : 'إضافة طالب'}
                </button>
              </div>

              {isAddingStudent && (
                <div className="bg-gray-50 p-4 rounded-xl border border-indigo-100 mb-6 animate-[fadeIn_0.2s_ease-out]">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">اختر طالباً للإضافة:</h4>
                  {availableStudents.length === 0 ? (
                    <div className="text-gray-500 italic text-sm">جميع الطلاب المتاحين موجودون بالفعل في هذه الحلقة.</div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                      >
                        <option value="">-- اختر الطالب --</option>
                        {availableStudents.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name} (الدرجة: {student.grade}%)
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddStudent}
                        disabled={!selectedStudentId}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        إضافة للحلقة
                      </button>
                    </div>
                  )}
                </div>
              )}

              {groupStudents.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  <p>لا يوجد طلاب في هذه الحلقة.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupStudents.map(student => (
                    <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition bg-white flex items-center gap-3 shadow-sm">
                       <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {student.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-semibold text-gray-800">{student.name}</p>
                         <p className="text-xs text-gray-500">الدرجة: {student.grade}%</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scheduler Tab */}
          {activeTab === 'scheduler' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">جدول الحلقة</h3>
              </div>
              
              {groupEvents.length === 0 ? (
                 <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                   <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                   <p>لا توجد جلسات مجدولة لهذه الحلقة.</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {groupEvents.map(event => {
                     const date = new Date(event.startTime);
                     return (
                      <div key={event.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition">
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
                          <p className="text-xs text-gray-500 mt-2">{event.description || 'لا يوجد وصف.'}</p>
                        </div>
                        <div className="mr-auto">
                           <span className={`text-xs px-2 py-1 rounded font-medium uppercase ${event.type === 'class' ? 'bg-blue-100 text-blue-700' : event.type === 'meeting' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                             {event.type === 'class' ? 'درس' : event.type === 'meeting' ? 'اجتماع' : 'نشاط'}
                           </span>
                        </div>
                      </div>
                     );
                   })}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
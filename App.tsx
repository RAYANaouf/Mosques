import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, Settings, BookOpen, GraduationCap, School, LogOut, TrendingUp, Star, Mail, Phone, Clock, Database, UserCheck, Book, Menu } from 'lucide-react';
import { Student, Group, CalendarEvent, Teacher, ViewState } from './types';
import { StudentList } from './components/StudentList';
import { StudentDetails } from './components/StudentDetails';
import { TeacherList } from './components/TeacherList';
import { TeacherDetails } from './components/TeacherDetails';
import { GroupManager } from './components/GroupManager';
import { GroupDetails } from './components/GroupDetails';
import { Scheduler } from './components/Scheduler';
import { Login } from './components/Login';
import { AdminSettings } from './components/AdminSettings';
import { QURAN_SURAHS } from './constants';

// Services
import * as dbService from './services/db';

interface AuthUser {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  email: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Admin Credentials State
  const [adminCredentials, setAdminCredentials] = useState({
    name: 'المسؤول',
    email: 'admin@mosquestrack.com',
    password: 'admin123'
  });
  
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State initialized as empty, populated by DB Service
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Subscribe to Data (Real-time or Mock)
  useEffect(() => {
    const unsubStudents = dbService.subscribeToCollection('students', (data) => setStudents(data as Student[]));
    const unsubTeachers = dbService.subscribeToCollection('teachers', (data) => setTeachers(data as Teacher[]));
    const unsubGroups = dbService.subscribeToCollection('groups', (data) => setGroups(data as Group[]));
    const unsubEvents = dbService.subscribeToCollection('events', (data) => setEvents(data as CalendarEvent[]));

    setLoading(false);

    return () => {
      unsubStudents();
      unsubTeachers();
      unsubGroups();
      unsubEvents();
    };
  }, []);

  // Computed Data
  const selectedTeacher = selectedTeacherId ? teachers.find(t => t.id === selectedTeacherId) || null : null;
  const selectedStudent = selectedStudentId ? students.find(s => s.id === selectedStudentId) || null : null;
  const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) || null : null;

  // Computed Dashboard Stats
  const avgGrade = students.length > 0 ? Math.round(students.reduce((acc, curr) => acc + curr.grade, 0) / students.length) : 0;
  const lowPerformance = students.filter(s => s.grade < 70).length;
  const upcomingEventsCount = events.length;

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    // Reset views
    setView('dashboard'); 
    setSelectedTeacherId(null);
    setSelectedStudentId(null);
    setSelectedGroupId(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacherId(teacher.id);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudentId(student.id);
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroupId(group.id);
  }

  // --- Database Wrappers ---

  const handleUpdateGroup = async (updatedGroup: Group) => {
    await dbService.updateGroup(updatedGroup);
  };

  const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
    await dbService.updateTeacher(updatedTeacher);
    if (currentUser && currentUser.id === updatedTeacher.id) {
      setCurrentUser(prev => prev ? ({ ...prev, name: updatedTeacher.name, email: updatedTeacher.email }) : null);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    await dbService.updateStudent(updatedStudent);
    if (currentUser && currentUser.id === updatedStudent.id) {
        setCurrentUser(prev => prev ? ({ ...prev, name: updatedStudent.name, email: updatedStudent.email! }) : null);
    }
  }

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    await dbService.addStudent(studentData);
  };

  const handleDeleteStudent = async (id: string) => {
    await dbService.deleteStudent(id);
  };

  const handleAddTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    await dbService.addTeacher(teacherData);
  };

  const handleDeleteTeacher = async (id: string) => {
    await dbService.deleteTeacher(id);
  };

  // Wrapper for Scheduler setEvents
  const handleSetEvents = (action: any) => {
    if (typeof action === 'function') {
        const newEvents = action(events);
        const added = newEvents.filter((ne: CalendarEvent) => !events.find(e => e.id === ne.id));
        added.forEach((e: CalendarEvent) => dbService.addEvent(e));
    }
  };

  const handleViewChange = (newView: ViewState) => {
    setView(newView);
    setSelectedTeacherId(null);
    setSelectedStudentId(null);
    setSelectedGroupId(null);
    setIsSidebarOpen(false);
  };

  const handleSeedData = async () => {
    if (window.confirm("سيتم إضافة بيانات تجريبية لقاعدة البيانات. هل تود المتابعة؟")) {
        await dbService.seedDatabase();
    }
  }

  // --- Helper for Progress Calculation ---
  const getProgress = (surah: string | undefined) => {
    if (!surah) return 0;
    const index = QURAN_SURAHS.indexOf(surah);
    return index !== -1 ? Math.round(((index + 1) / 114) * 100) : 0;
  };

  // --- Views for Role: STUDENT ---
  const renderStudentSpace = () => {
    if (!currentUser) return null;
    const student = students.find(s => s.id === currentUser.id);
    if (!student) return <div>لم يتم العثور على ملف الطالب. يرجى الاتصال بالمسؤول.</div>;

    const myGroupIds = groups.filter(g => g.studentIds.includes(student.id)).map(g => g.id);
    const myEvents = events.filter(e => e.groupId && myGroupIds.includes(e.groupId));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">بوابة الطالب</h2>
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {student.name.charAt(0)}
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
               <p className="text-gray-500">{student.email}</p>
             </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
              <div>
                 <span className="block text-xs text-gray-500 uppercase">الدرجة</span>
                 <span className={`text-lg font-bold ${student.grade >= 90 ? 'text-green-600' : 'text-gray-800'}`}>{student.grade}%</span>
              </div>
              <div>
                 <span className="block text-xs text-gray-500 uppercase">السلوك</span>
                 <span className="text-lg font-bold text-gray-800">{student.behaviorScore}/10</span>
              </div>
              <div>
                 <span className="block text-xs text-gray-500 uppercase">الحلقات</span>
                 <span className="text-lg font-bold text-gray-800">{myGroupIds.length}</span>
              </div>
              <div>
                 <span className="block text-xs text-gray-500 uppercase">العمر</span>
                 <span className="text-lg font-bold text-gray-800">{student.age || '-'}</span>
              </div>
           </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600"/> حصصي القادمة
          </h3>
          {myEvents.length === 0 ? (
            <p className="text-gray-400 italic">لا توجد حصص مجدولة قريباً.</p>
          ) : (
             <div className="space-y-3">
               {myEvents.map(event => {
                 const date = new Date(event.startTime);
                 const group = groups.find(g => g.id === event.groupId);
                 return (
                   <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-center bg-white p-2 rounded border border-gray-200 min-w-[60px]">
                        <span className="block text-xs font-bold text-gray-500 uppercase">{date.toLocaleDateString('ar-EG', { weekday: 'short' })}</span>
                        <span className="block text-xl font-bold text-gray-800">{date.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><Clock size={14} /> {date.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
                          {group && <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{group.name}</span>}
                        </div>
                      </div>
                   </div>
                 )
               })}
             </div>
          )}
        </div>
      </div>
    );
  };

  // --- Views for Role: TEACHER ---
  const renderTeacherSpace = () => {
    if (!currentUser) return null;
    const teacher = teachers.find(t => t.id === currentUser.id);
    if (!teacher) return <div>لم يتم العثور على ملف المعلم.</div>;

    return (
      <TeacherDetails 
        teacher={teacher}
        groups={groups}
        events={events}
        students={students}
        onBack={() => {}} 
        onUpdate={handleUpdateTeacher}
        standalone={true}
      />
    );
  };

  // --- Views for Role: PARENT ---
  const renderParentSpace = () => {
    if (!currentUser) return null;
    const myChildren = students.filter(s => s.parentEmail?.toLowerCase() === currentUser.email.toLowerCase());

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserCheck className="text-indigo-600" /> بوابة ولي الأمر
                </h2>
            </div>
            
            {myChildren.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <Users size={48} className="mx-auto text-gray-300 mb-4"/>
                    <h3 className="text-lg font-medium text-gray-900">لا يوجد طلاب مرتبطين بهذا الحساب</h3>
                    <p className="text-gray-500">يرجى التواصل مع الإدارة لربط بريدك الإلكتروني بملف ابنك.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {myChildren.map(child => (
                        <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl border-2 border-white shadow-sm">
                                    {child.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                                    <p className="text-sm text-gray-500">رقم الطالب: {child.id}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Academic & Behavior Block */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                        <div className="text-blue-600 font-medium text-sm mb-1 uppercase tracking-wide">الدرجة الكلية</div>
                                        <div className="text-3xl font-bold text-gray-800">{child.grade}%</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                                        <div className="text-purple-600 font-medium text-sm mb-1 uppercase tracking-wide">السلوك والمواظبة</div>
                                        <div className="text-3xl font-bold text-gray-800">{child.behaviorScore}/10</div>
                                    </div>
                                </div>

                                {/* Quran Progress Block */}
                                <div className="border border-gray-100 rounded-xl p-4 shadow-sm">
                                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <Book size={18} className="text-indigo-600" /> إنجاز القرآن
                                    </h4>
                                    
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase font-semibold">السورة الحالية</span>
                                            <div className="font-bold text-gray-800 text-lg">{child.currentSurah || 'لم يبدأ'}</div>
                                        </div>
                                        <div className="text-left">
                                             <span className="text-xs text-gray-500 uppercase font-semibold">الآية</span>
                                             <div className="font-bold text-gray-800 text-lg">{child.currentAyah || '-'}</div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                                        <div 
                                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" 
                                            style={{ width: `${getProgress(child.currentSurah)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-left text-xs text-gray-400">
                                        {getProgress(child.currentSurah)}% مكتمل
                                    </div>
                                </div>

                                {/* Notes */}
                                {child.notes && (
                                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                                        <h4 className="text-sm font-bold text-yellow-800 mb-1">ملاحظات المعلم</h4>
                                        <p className="text-sm text-yellow-900 italic">"{child.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const renderAdminContent = () => {
    switch (view) {
      case 'students':
        if (selectedStudent) {
            return (
                <StudentDetails
                    student={selectedStudent}
                    groups={groups}
                    events={events}
                    onBack={() => setSelectedStudentId(null)}
                    onUpdate={handleUpdateStudent}
                    onUpdateGroup={handleUpdateGroup}
                />
            );
        }
        return (
          <StudentList 
            students={students} 
            onDelete={handleDeleteStudent} 
            onAdd={handleAddStudent}
            onSelect={handleStudentSelect}
          />
        );
      case 'teachers':
        if (selectedTeacher) {
          return (
            <TeacherDetails 
              teacher={selectedTeacher} 
              groups={groups} 
              events={events}
              students={students}
              onBack={() => setSelectedTeacherId(null)} 
              onUpdate={handleUpdateTeacher}
            />
          );
        }
        return (
          <TeacherList 
            teachers={teachers} 
            onDelete={handleDeleteTeacher} 
            onSelect={handleTeacherSelect}
            onAdd={handleAddTeacher}
          />
        );
      case 'groups':
        if (selectedGroup) {
          return (
            <GroupDetails
              group={selectedGroup}
              students={students}
              teachers={teachers}
              events={events}
              onBack={() => setSelectedGroupId(null)}
              onUpdateGroup={handleUpdateGroup}
            />
          );
        }
        
        const setGroupsWrapper = (action: any) => {};

        return (
          <GroupManager 
            students={students} 
            teachers={teachers}
            groups={groups} 
            setGroups={setGroupsWrapper as any} 
            onSelect={handleGroupSelect}
            onAddGroup={(g: Group) => dbService.addGroup(g)}
            onDeleteGroup={(id: string) => dbService.deleteGroup(id)}
          />
        );
      case 'scheduler':
        return (
            <Scheduler 
                groups={groups} 
                events={events} 
                setEvents={handleSetEvents as any} 
                onAddEvent={(e: CalendarEvent) => dbService.addEvent(e)}
            />
        );
      case 'settings':
        return (
          <AdminSettings 
            credentials={adminCredentials} 
            onUpdate={(newCreds) => {
              setAdminCredentials(newCreds);
              setCurrentUser(prev => prev ? ({...prev, name: newCreds.name, email: newCreds.email}) : null);
            }} 
          />
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
                {students.length === 0 && teachers.length === 0 && (
                    <button onClick={handleSeedData} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100 flex items-center gap-2">
                        <Database size={14} /> إضافة بيانات تجريبية
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">إجمالي الطلاب</p>
                    <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">متوسط الدرجات</p>
                    <p className="text-2xl font-bold text-gray-800">{avgGrade}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">أحداث قادمة</p>
                    <p className="text-2xl font-bold text-gray-800">{upcomingEventsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">تنبيهات</h3>
                  {lowPerformance > 0 ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                      يوجد {lowPerformance} طالب درجاتهم أقل من 70%. يرجى متابعتهم.
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">الجميع يبلي بلاءً حسناً! لا توجد تنبيهات.</p>
                  )}
               </div>
            </div>
          </div>
        );
    }
  };

  if (!currentUser) {
    return <Login students={students} teachers={teachers} adminCredentials={adminCredentials} onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Tajawal]" dir="rtl">
      {/* Sidebar - Only for ADMIN */}
      {currentUser.role === 'admin' && (
        <aside className={`w-64 bg-white border-l border-gray-200 hidden md:flex flex-col fixed h-full z-10 ${isSidebarOpen ? 'right-0' : ''}`}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <BookOpen size={24} />
              <span>منصة الحلقات</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button 
              onClick={() => handleViewChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={20} />
              لوحة التحكم
            </button>
            <button 
              onClick={() => handleViewChange('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'students' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={20} />
              الطلاب
            </button>
            <button 
              onClick={() => handleViewChange('teachers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'teachers' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <School size={20} />
              المعلمون
            </button>
            <button 
              onClick={() => handleViewChange('groups')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'groups' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={20} className="scale-x-[-1]" />
              الحلقات
            </button>
            <button 
              onClick={() => handleViewChange('scheduler')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'scheduler' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Calendar size={20} />
              الجدول
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-1">
            <button 
              onClick={() => handleViewChange('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${view === 'settings' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings size={20} />
              الإعدادات
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
              <LogOut size={20} className="scale-x-[-1]" />
              تسجيل خروج
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${currentUser.role === 'admin' ? 'md:mr-64' : ''}`}>
        
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
             {currentUser.role !== 'admin' && (
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl md:hidden">
                  <BookOpen size={24} />
                  <span>منصة الحلقات</span>
                </div>
             )}
             <span className="font-bold text-gray-700 hidden md:block">
               مرحباً، {currentUser.name}
             </span>
          </div>

          <div className="flex items-center gap-4">
             {/* Admin Mobile Navigation */}
             {currentUser.role === 'admin' && (
                <div className="flex gap-4 md:hidden">
                  <button onClick={() => handleViewChange('dashboard')} className="text-gray-600"><LayoutDashboard size={20}/></button>
                  <button onClick={() => handleViewChange('students')} className="text-gray-600"><Users size={20}/></button>
                  <button onClick={() => handleViewChange('teachers')} className="text-gray-600"><School size={20}/></button>
                  <button onClick={() => handleViewChange('groups')} className="text-gray-600"><Users size={20}/></button>
                  <button onClick={() => handleViewChange('scheduler')} className="text-gray-600"><Calendar size={20}/></button>
                  <button onClick={() => handleViewChange('settings')} className="text-gray-600"><Settings size={20}/></button>
                </div>
             )}

             {/* Logout Button */}
             <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                <LogOut size={18} className="scale-x-[-1]"/>
                <span className="hidden sm:inline">تسجيل خروج</span>
             </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {currentUser.role === 'admin' && renderAdminContent()}
          {currentUser.role === 'student' && renderStudentSpace()}
          {currentUser.role === 'teacher' && renderTeacherSpace()}
          {currentUser.role === 'parent' && renderParentSpace()}
        </div>
      </main>
    </div>
  );
};

export default App;
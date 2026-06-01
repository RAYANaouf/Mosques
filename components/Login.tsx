import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Student, Teacher } from '../types';

interface LoginProps {
  students: Student[];
  teachers: Teacher[];
  adminCredentials: { name: string; email: string; password: string };
  onLogin: (user: { id: string; name: string; role: 'admin' | 'teacher' | 'student' | 'parent'; email: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ students, teachers, adminCredentials, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === adminCredentials.email.toLowerCase() && password === adminCredentials.password) {
        onLogin({ id: 'admin', name: adminCredentials.name, role: 'admin', email: adminCredentials.email });
        return;
      }

      const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase() && t.password === password);
      if (teacher) {
        onLogin({ id: teacher.id, name: teacher.name, role: 'teacher', email: teacher.email });
        return;
      }

      const student = students.find(s => s.email?.toLowerCase() === email.toLowerCase() && s.password === password);
      if (student) {
        onLogin({ id: student.id, name: student.name, role: 'student', email: student.email! });
        return;
      }

      const parentMatch = students.find(s => s.parentEmail?.toLowerCase() === email.toLowerCase() && s.parentPassword === password);
      if (parentMatch && parentMatch.parentName && parentMatch.parentEmail) {
         onLogin({ 
             id: `parent_${parentMatch.id}`,
             name: parentMatch.parentName, 
             role: 'parent', 
             email: parentMatch.parentEmail 
         });
         return;
      }

      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Tajawal]" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
        <div className="p-8 w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <BookOpen size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">منصة الحلقات</h1>
            <p className="text-gray-500 text-sm mt-1">سجل الدخول للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
              {!loading && <ArrowLeft size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400" dir="ltr">
            <p>Admin: {adminCredentials.email}</p>
            <p>Pass: {adminCredentials.password}</p>
            <p className="mt-1 border-t border-gray-100 pt-1">Parent Test: ali@parent.com / parent123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
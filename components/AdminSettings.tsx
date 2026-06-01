import React, { useState } from 'react';
import { User, Mail, Lock, Save, Shield, Check, Database, Power, AlertTriangle, Terminal } from 'lucide-react';
import { isLive, saveFirebaseConfig, clearFirebaseConfig } from '../firebase';

interface AdminSettingsProps {
  credentials: { name: string; email: string; password: string };
  onUpdate: (creds: { name: string; email: string; password: string }) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ credentials, onUpdate }) => {
  const [formData, setFormData] = useState(credentials);
  const [success, setSuccess] = useState(false);
  const [configInput, setConfigInput] = useState('');
  const [configError, setConfigError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleConnectDb = () => {
    try {
      setConfigError('');
      let jsonStr = configInput;
      if (jsonStr.includes('=')) {
         const match = jsonStr.match(/{[\s\S]*}/);
         if (match) jsonStr = match[0];
      }
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

      let configObj;
      try {
        configObj = JSON.parse(jsonStr);
      } catch (e) {
        throw new Error("تنسيق JSON غير صالح. يرجى التأكد من وضع علامات اقتباس حول المفاتيح.");
      }

      if (!configObj.apiKey || !configObj.projectId) {
        throw new Error("كائن الإعدادات يفتقد حقولاً مطلوبة (apiKey, projectId)");
      }

      saveFirebaseConfig(configObj);
    } catch (e: any) {
      setConfigError(e.message || "فشل في تحليل الإعدادات");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إعدادات المسؤول</h2>
        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${isLive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            <Database size={16} />
            {isLive ? 'قاعدة البيانات متصلة' : 'وضع غير متصل / تجريبي'}
        </div>
      </div>
      
      {/* Admin Credentials */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
             <Shield size={24} />
           </div>
           <div>
             <h3 className="font-bold text-gray-800 text-lg">بيانات الدخول للمسؤول</h3>
             <p className="text-gray-500 text-sm">تحديث معلومات الوصول الخاصة بك</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم المعروض</label>
                  <div className="relative">
                    <div className="absolute right-0 top-2.5 pr-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني / اسم المستخدم</label>
                  <div className="relative">
                    <div className="absolute right-0 top-2.5 pr-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
               </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-0 top-2.5 pr-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="text" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
           </div>

           <div className="pt-2 flex items-center gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
              >
                <Save size={18} />
                حفظ التغييرات
              </button>
              
              {success && (
                <span className="text-green-600 flex items-center gap-1.5 text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
                  <Check size={18} />
                  تم التحديث بنجاح!
                </span>
              )}
           </div>
        </form>
      </div>

      {/* Database Connection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
         <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
             <Database size={24} />
           </div>
           <div>
             <h3 className="font-bold text-gray-800 text-lg">اتصال قاعدة البيانات</h3>
             <p className="text-gray-500 text-sm">الاتصال بـ Firebase Firestore للبيانات الحية</p>
           </div>
        </div>

        {isLive ? (
            <div className="bg-green-50 border border-green-100 rounded-lg p-5 text-center">
                <Check size={40} className="mx-auto text-green-600 mb-3" />
                <h4 className="font-bold text-green-800 text-lg">متصل بنجاح</h4>
                <p className="text-green-700 mb-4">تطبيقك متزامن مع Firebase.</p>
                <button 
                  onClick={clearFirebaseConfig}
                  className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition flex items-center gap-2 mx-auto"
                >
                    <Power size={16} /> قطع الاتصال وإعادة الضبط
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold flex items-center gap-2 mb-1"><Terminal size={16}/> كيفية الاتصال:</p>
                    <ol className="list-decimal mr-5 space-y-1">
                        <li>اذهب إلى Firebase Console &gt; Project Settings &gt; General</li>
                        <li>انزل إلى "Your apps" واختر Web app</li>
                        <li>انسخ كائن <code>firebaseConfig</code> (JSON)</li>
                        <li>الصقه أدناه واضغط اتصال</li>
                    </ol>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">إعدادات Firebase JSON</label>
                    <textarea 
                        rows={6}
                        value={configInput}
                        onChange={(e) => setConfigInput(e.target.value)}
                        placeholder='{ "apiKey": "...", "authDomain": "...", ... }'
                        className="w-full font-mono text-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        dir="ltr"
                    />
                    {configError && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1"><AlertTriangle size={14} /> {configError}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleConnectDb}
                        disabled={!configInput}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <Database size={16} />
                        حفظ واتصال
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
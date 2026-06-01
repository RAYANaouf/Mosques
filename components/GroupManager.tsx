import React, { useState } from 'react';
import { Student, Group, Teacher } from '../types';
import { Users, X, ChevronLeft, Plus, User } from 'lucide-react';

interface GroupManagerProps {
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onSelect: (group: Group) => void;
  onAddGroup?: (group: Group) => void;
  onDeleteGroup?: (id: string) => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({ students, teachers, groups, setGroups, onSelect, onAddGroup, onDeleteGroup }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupTeacherId, setNewGroupTeacherId] = useState('');

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupTeacherId) return;
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name: newGroupName,
      description: newGroupDesc || 'لا يوجد وصف',
      studentIds: [],
      teacherId: newGroupTeacherId
    };

    if (onAddGroup) {
      onAddGroup(newGroup);
    } else {
      setGroups(prev => [...prev, newGroup]);
    }
    
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupTeacherId('');
  };

  const deleteGroup = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) {
      if (onDeleteGroup) {
        onDeleteGroup(id);
      } else {
        setGroups(prev => prev.filter(g => g.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الحلقات</h2>
      </div>

      {/* Manual Creation Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-indigo-600"/>
          إنشاء حلقة جديدة
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">اسم الحلقة</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="مثال: حلقة المتميزين"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">المعلم المسؤول</label>
            <select
                value={newGroupTeacherId}
                onChange={(e) => setNewGroupTeacherId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
                <option value="">-- اختر المعلم --</option>
                {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">الوصف</label>
            <input
              type="text"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              placeholder="وصف الحلقة (اختياري)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={handleCreateGroup}
            disabled={!newGroupName || !newGroupTeacherId}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 justify-center h-[42px]"
          >
            إنشاء
          </button>
        </div>
        {!newGroupTeacherId && newGroupName && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                * يرجى تعيين معلم لإنشاء الحلقة.
            </p>
        )}
      </div>

      {/* Group Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => {
            const groupTeacher = teachers.find(t => t.id === group.teacherId);
            return (
              <div 
                key={group.id} 
                onClick={() => onSelect(group)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition group"
              >
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                      <Users size={18} className="text-indigo-500" />
                      {group.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                    {groupTeacher && (
                        <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1 font-medium bg-indigo-50 w-fit px-2 py-0.5 rounded">
                            <User size={12} /> {groupTeacher.name}
                        </p>
                    )}
                    {!groupTeacher && (
                         <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium bg-red-50 w-fit px-2 py-0.5 rounded">
                            <User size={12} /> لم يتم تعيين معلم
                         </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => deleteGroup(e, group.id)} 
                      className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
                    >
                      <X size={18} />
                    </button>
                    <ChevronLeft size={18} className="text-gray-300" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {group.studentIds.map(sid => {
                      const student = students.find(s => s.id === sid);
                      return student ? (
                        <div key={sid} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm">
                          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                          {student.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                  {group.studentIds.length === 0 && (
                    <p className="text-gray-400 text-sm italic">لا يوجد طلاب مسجلين.</p>
                  )}
                </div>
              </div>
            );
        })}

        {groups.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <Users size={48} className="mx-auto mb-3 opacity-20" />
            <p>لا توجد حلقات مضافة بعد. أنشئ واحدة يدوياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};
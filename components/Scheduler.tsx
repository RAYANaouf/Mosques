import React, { useState } from 'react';
import { Group, CalendarEvent } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, X } from 'lucide-react';

interface SchedulerProps {
  groups: Group[];
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  onAddEvent?: (event: CalendarEvent) => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({ groups, events, setEvents, onAddEvent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    startTime: '',
    durationMinutes: 60,
    type: 'class',
    description: ''
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.startTime) {
       const eventObj: CalendarEvent = {
         id: crypto.randomUUID(),
         title: newEvent.title!,
         startTime: newEvent.startTime!,
         durationMinutes: newEvent.durationMinutes || 60,
         type: newEvent.type as any || 'class',
         description: newEvent.description,
         groupId: newEvent.groupId
       };

       if (onAddEvent) {
         onAddEvent(eventObj);
       } else {
         setEvents(prev => [...prev, eventObj]);
       }
       
       setIsAdding(false);
       setNewEvent({ title: '', startTime: '', durationMinutes: 60, type: 'class', description: '' });
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'activity': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">الجدول الأسبوعي</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
            <CalendarIcon size={20} />
            الأحداث القادمة
          </h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> إضافة حدث يدوياً
          </button>
        </div>

        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
             <p className="text-center text-gray-400 py-10 italic">لا توجد أحداث قادمة.</p>
          ) : (
            sortedEvents.map(event => {
              const date = new Date(event.startTime);
              const group = groups.find(g => g.id === event.groupId);
              
              return (
                <div key={event.id} className={`p-4 rounded-lg border-r-4 ${getEventColor(event.type)} bg-opacity-30 border-opacity-50 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                  <div className="flex items-start gap-4">
                    <div className="bg-white bg-opacity-60 rounded-lg p-2 text-center min-w-[60px]">
                      <span className="block text-xs font-bold text-gray-500 uppercase">{date.toLocaleDateString('ar-EG', { month: 'short' })}</span>
                      <span className="block text-xl font-bold text-gray-800">{date.getDate()}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1"><Clock size={14} /> {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} ({event.durationMinutes} دقيقة)</span>
                        {group && <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{group.name}</span>}
                      </div>
                      {event.description && <p className="text-sm text-gray-500 mt-2">{event.description}</p>}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide self-start md:self-center ${getEventColor(event.type).split(' ')[1]}`}>
                    {event.type === 'class' ? 'درس' : event.type === 'meeting' ? 'اجتماع' : 'نشاط'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">إضافة حدث</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الحدث</label>
                  <input
                    required
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وقت البدء</label>
                    <input
                      required
                      type="datetime-local"
                      value={newEvent.startTime}
                      onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المدة (دقيقة)</label>
                    <input
                      required
                      type="number"
                      value={newEvent.durationMinutes}
                      onChange={e => setNewEvent({...newEvent, durationMinutes: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                      <select
                        value={newEvent.type}
                        onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="class">درس</option>
                        <option value="meeting">اجتماع</option>
                        <option value="activity">نشاط</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الحلقة (اختياري)</label>
                      <select
                        value={newEvent.groupId || ''}
                        onChange={e => setNewEvent({...newEvent, groupId: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">لا يوجد</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                   </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={2}
                  />
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">إلغاء</button>
                 <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">حفظ الحدث</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
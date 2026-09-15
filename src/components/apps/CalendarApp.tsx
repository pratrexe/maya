import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, Calendar as CalIcon } from 'lucide-react';
import { CalendarEvent, ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface CalendarAppProps {
  theme: ThemeConfig;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CalendarApp: React.FC<CalendarAppProps> = ({
  theme,
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [selectedDate, setSelectedDate] = useState<number>(9); // 09 October
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventType, setNewEventType] = useState<'gold' | 'pink' | 'rose' | 'lavender'>('gold');

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysInMonth = 31; // October has 31 days

  const handleAdd = () => {
    if (!newEventTitle.trim()) return;
    playUiClick();
    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      time: newEventTime,
      dateStr: `Oct ${selectedDate}`,
      colorType: newEventType,
    };
    onAddEvent(created);
    setNewEventTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="flex h-full flex-col md:flex-row text-sm">
      {/* Left: Monthly Calendar View */}
      <div
        className="w-full md:w-[50%] p-6 flex flex-col justify-between border-r border-black/5"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-['DM_Serif_Display']">October 2026</h2>
              <p className="text-xs text-gray-500">Festive Season & Work Schedule</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold">
            {/* October 1st was a Thursday, so 4 empty offset slots */}
            <div />
            <div />
            <div />
            <div />

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDate;
              // Check if any event falls on this day
              const hasEvent = events.some((e) =>
                e.dateStr.includes(`Oct ${day}`) || (day >= 9 && day <= 12)
              );

              return (
                <button
                  key={day}
                  onClick={() => {
                    playUiClick();
                    setSelectedDate(day);
                  }}
                  className={`h-9 w-9 mx-auto rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#c85252] text-white font-bold shadow-md scale-105'
                      : 'hover:bg-white/60 text-gray-800'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvent && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full -mb-1 ${
                        isSelected ? 'bg-white' : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date overview */}
        <div className="mt-4 p-3 rounded-2xl bg-white/60 border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalIcon className="w-4 h-4 text-[#c85252]" />
            <span className="font-bold text-xs">Selected: Oct {selectedDate}, 2026</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">Autumn Festival Week</span>
        </div>
      </div>

      {/* Right: Events and Schedule */}
      <div className="w-full md:w-[50%] p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700">
                Events & Holidays
              </h3>
              <p className="text-xs text-gray-500">{events.length} Upcoming Occasions</p>
            </div>
            <button
              onClick={() => {
                playUiClick();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#c85252] text-white text-xs font-bold hover:bg-[#b04242] transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          {/* Add Event Modal */}
          {showAddModal && (
            <div className="mb-4 p-4 rounded-3xl bg-white border border-black/10 shadow-lg space-y-3 animate-in fade-in duration-150">
              <div className="font-bold text-xs">Create Calendar Event</div>
              <input
                type="text"
                placeholder="Event name (e.g. Diwali celebration)"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Time (e.g. 10:00 AM)"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none"
                />
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-1/2 px-2 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none bg-white"
                >
                  <option value="gold">Gold Theme</option>
                  <option value="pink">Pink Theme</option>
                  <option value="rose">Rose Theme</option>
                  <option value="lavender">Lavender Theme</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-3 py-1 rounded-full bg-[#c85252] text-white text-xs font-bold hover:bg-[#b04242]"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-320px)]">
            {events.map((evt) => {
              const bgColors: Record<string, string> = {
                gold: '#fae4be',
                pink: '#fad0d0',
                rose: '#fcc1c1',
                lavender: '#ecd2fb',
                blue: '#cfe3fb',
              };
              const bg = bgColors[evt.colorType] || '#fad0d0';

              return (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl flex items-center justify-between transition-all hover:scale-101 shadow-xs group"
                  style={{ backgroundColor: bg }}
                >
                  <div>
                    <div className="font-bold text-xs text-gray-900 leading-tight">
                      {evt.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-700 mt-0.5">
                      <Clock className="w-3 h-3 opacity-70" />
                      <span>{evt.time}</span>
                      <span>•</span>
                      <span>{evt.dateStr}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playUiClick();
                      onDeleteEvent(evt.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-black/10 text-red-700 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

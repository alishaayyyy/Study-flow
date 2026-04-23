import React, { useState } from 'react';

const SubjectForm = ({ onSubjectAdded }) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dashboard.jsx ke function ko data bhej rahe hain sync ke liye
    onSubjectAdded({
      name,
      studyHours: Number(hours),
      targetDate: date
    });

    // Form clear karein
    setName('');
    setHours('');
    setDate('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-5 backdrop-blur-sm shadow-xl transition-all hover:border-rose-500/20"
    >
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white tracking-tight">Add New Subject</h3>
        <p className="text-gray-500 text-xs mt-1">Set your goals and track them on the calendar</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Subject Name</label>
          <input 
            type="text" 
            placeholder="e.g. Full Stack Development" 
            required
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Weekly Hours</label>
            <input 
              type="number" 
              placeholder="Hrs" 
              required
              value={hours} 
              onChange={(e) => setHours(e.target.value)}
              className="w-full mt-1 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Target Date</label>
            <input 
              type="date" 
              required
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]"
      >
        Add Subject
      </button>
    </form>
  );
};

export default SubjectForm;
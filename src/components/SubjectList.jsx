import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [editingSub, setEditingSub] = useState(null);
  const [newName, setNewName] = useState('');
  const [newHours, setNewHours] = useState('');
  const [streak, setStreak] = useState(0); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // Custom message state
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "subjects"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(fetchedSubjects);
      calculateStreak(fetchedSubjects);
    });
    return () => unsubscribe();
  }, [user]);

  const calculateStreak = (subList) => {
    if (!subList || subList.length === 0) {
      setStreak(0);
      return;
    }
    const allDates = [...new Set(subList.map(s => s.targetDate))].sort();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const pastAndPresentDates = allDates.filter(d => d <= todayStr);
    if (pastAndPresentDates.length === 0) {
      setStreak(0);
      return;
    }

    const latestActivity = pastAndPresentDates[pastAndPresentDates.length - 1];
    if (latestActivity !== todayStr && latestActivity !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let count = 0;
    let checkDate = new Date(latestActivity);
    const dateSet = new Set(pastAndPresentDates);
    while (dateSet.has(checkDate.toISOString().split('T')[0])) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    setStreak(count);
  };

  // Toast trigger function
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will also remove it from your calendar.")) {
      try {
        await deleteDoc(doc(db, "subjects", id));
        const q = query(collection(db, "studyEvents"), where("subjectId", "==", id));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(eventDoc => deleteDoc(doc(db, "studyEvents", eventDoc.id)));
        await Promise.all(deletePromises);
        
        // Success Toast for Delete
        triggerToast("Subject deleted successfully!");
        
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleEditClick = (sub) => {
    setEditingSub(sub);
    setNewName(sub.name);
    setNewHours(sub.studyHours);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingSub) return;

    try {
      const docRef = doc(db, "subjects", editingSub.id);
      await updateDoc(docRef, { 
        name: newName, 
        studyHours: Number(newHours) 
      });
      
      const q = query(collection(db, "studyEvents"), where("subjectId", "==", editingSub.id));
      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(eventDoc => 
        updateDoc(doc(db, "studyEvents", eventDoc.id), {
          title: `${newName} (${newHours} hrs)`
        })
      );
      await Promise.all(updatePromises);

      setEditingSub(null);
      setNewName('');
      setNewHours('');
      
      // Success Toast for Update
      triggerToast("Goal updated successfully!");
      
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- Dynamic Success Toast --- */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-right-10 duration-300">
          <div className="bg-white/20 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-bold tracking-tight text-sm">{toastMessage}</p>
        </div>
      )}

      {streak > 0 && (
        <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-orange-500/20 to-rose-500/10 border border-orange-500/20 rounded-[2rem] animate-in fade-in zoom-in duration-500 shadow-xl shadow-orange-500/5">
          <div className="relative">
            <span className="text-3xl">🔥</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </div>
          <div>
            <p className="text-orange-400 font-black text-lg tracking-tight">{streak} Day Study Streak!</p>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Consistency is Key!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => (
          <div key={sub.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center hover:border-rose-500/30 transition-all shadow-lg group">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white tracking-tight">{sub.name}</h4>
              <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {sub.studyHours} hrs/week
                </span>
                <span>•</span>
                <span className="opacity-70">Target: {sub.targetDate}</span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button onClick={() => handleEditClick(sub)} className="p-2 rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => handleDelete(sub.id)} className="p-2 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white transition-all border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSub && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-1 text-center">Update Goal</h3>
            <form onSubmit={handleUpdate} className="space-y-4 mt-6">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase ml-2">Subject Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-rose-500 transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase ml-2">Weekly Hours</label>
                <input 
                  type="number" 
                  value={newHours} 
                  onChange={(e) => setNewHours(e.target.value)} 
                  required
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-rose-500 transition-all" 
                />
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">Update</button>
                <button type="button" onClick={() => setEditingSub(null)} className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
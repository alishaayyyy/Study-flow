import Navbar from "../components/Navbar";
import SubjectForm from "../components/SubjectForm";
import SubjectList from "../components/SubjectList";
import StudyCalendar from "../components/StudyCalendar";
import ProgressChart from "../components/ProgressChart"; 
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const handleAddSubjectSync = async (subjectData) => {
    if (!user) return;

    try {
      const subRef = await addDoc(collection(db, "subjects"), {
        ...subjectData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        color: '#E11D48'
      });

      await addDoc(collection(db, "studyEvents"), {
        userId: user.uid,
        subjectId: subRef.id,
        title: `${subjectData.name} (${subjectData.studyHours} hrs)`,
        start: subjectData.targetDate,
        allDay: true,
        backgroundColor: '#E11D48',
        borderColor: '#E11D48'
      });
      
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-lg font-medium">
              Ready to crush your study goals today?
            </p>
          </div>

          {/* Optional: You can move the Streak UI here if you want it at the top level */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="relative lg:sticky lg:top-8">
               <SubjectForm onSubjectAdded={handleAddSubjectSync} />
               
               <div className="mt-4 p-5 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 hidden md:block">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <p className="text-rose-300 text-[10px] font-bold uppercase tracking-widest">Efficiency Tip</p>
                 </div>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Your progress chart and calendar will update instantly as you add new subjects.
                 </p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ProgressChart />
            </section>

            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold">My Study Subjects</h2>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-rose-400 border border-rose-500/20 uppercase tracking-widest">
                        Live Sync
                    </span>
                </div>
              </div>
              
              {/* This component now handles the Streak display and logic internally */}
              <SubjectList /> 
            </section>

          </div>
        </div>

        <div className="mt-16 md:mt-24 pb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold">Study Schedule</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your time slots and deadlines visually</p>
            </div>
          </div>
          
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-white/5 backdrop-blur-sm">
            <StudyCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
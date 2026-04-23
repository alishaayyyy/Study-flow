import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const StudyCalendar = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "studyEvents"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(d => ({
        id: d.id,
        title: d.data().title,
        start: d.data().start,
        end: d.data().end,
        backgroundColor: '#E11D48',
        borderColor: '#E11D48',
        display: 'block',
        extendedProps: { subjectId: d.data().subjectId } // Link to subject list
      }));
      setEvents(fetchedEvents);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDateSelect = async (selectInfo) => {
    let title = prompt('Enter Study Topic:');
    if (!title) return;

    let hours = parseFloat(prompt('How many hours?', '1')) || 1;
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    try {
      // 1. Create Subject in list first to get an ID
      const subjectRef = await addDoc(collection(db, "subjects"), {
        name: title,
        studyHours: hours,
        targetDate: selectInfo.startStr.split('T')[0],
        userId: user.uid,
        createdAt: serverTimestamp(),
        color: '#E11D48'
      });

      // 2. Create Event in Calendar linked to that subject
      await addDoc(collection(db, "studyEvents"), {
        userId: user.uid,
        subjectId: subjectRef.id, // Storing ID for sync
        title: `${title} (${hours} hrs)`,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Naya Feature: Calendar se delete karne ka option
  const handleEventClick = async (clickInfo) => {
    if (window.confirm(`Delete '${clickInfo.event.title}' from everywhere?`)) {
      try {
        const eventId = clickInfo.event.id;
        const subjectId = clickInfo.event.extendedProps.subjectId;

        // Delete from studyEvents
        await deleteDoc(doc(db, "studyEvents", eventId));
        
        // Delete from subjects if linked
        if (subjectId) {
          await deleteDoc(doc(db, "subjects", subjectId));
        }
        clickInfo.event.remove();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="bg-white/5 p-3 md:p-6 rounded-3xl border border-white/10 text-white shadow-2xl">
      <style>{`
        .fc-event { background-color: #E11D48 !important; border: none !important; cursor: pointer; padding: 2px 4px; }
        .fc-daygrid-event { white-space: normal !important; display: block !important; }
        .fc { color: white; height: 600px !important; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid rgba(255,255,255,0.1) !important; }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick} // Delete trigger
      />
    </div>
  );
};

export default StudyCalendar;
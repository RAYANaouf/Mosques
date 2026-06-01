import { db } from "../firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, writeBatch, onSnapshot } from "firebase/firestore";
import { Student, Teacher, Group, CalendarEvent } from "../types";
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_GROUPS, MOCK_EVENTS } from "../constants";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- In-Memory Store for Fallback ---
let localData = {
  students: [...MOCK_STUDENTS],
  teachers: [...MOCK_TEACHERS],
  groups: [...MOCK_GROUPS],
  events: [...MOCK_EVENTS]
};

// Listeners for in-memory updates
const listeners: Record<string, Function[]> = {
  students: [],
  teachers: [],
  groups: [],
  events: []
};

const notifyListeners = (collectionName: string) => {
  if (!db && listeners[collectionName]) {
    const data = localData[collectionName as keyof typeof localData];
    listeners[collectionName].forEach(cb => cb([...data])); // Send copy
  }
};

// --- Generic Helper for Subscriptions ---
export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
  if (db) {
    // Real Firestore Subscription
    return onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      callback(data);
    }, (error) => {
       handleFirestoreError(error, OperationType.GET, collectionName);
    });
  } else {
    // Mock Subscription
    if (!listeners[collectionName]) listeners[collectionName] = [];
    listeners[collectionName].push(callback);
    
    // Initial data push
    setTimeout(() => {
        callback(localData[collectionName as keyof typeof localData]);
    }, 0);

    return () => {
      listeners[collectionName] = listeners[collectionName].filter(cb => cb !== callback);
    };
  }
};

// --- Students ---
export const addStudent = async (student: Omit<Student, 'id'>) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "students"), student);
      return { ...student, id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "students");
    }
  } else {
    const newStudent = { ...student, id: crypto.randomUUID() };
    localData.students = [...localData.students, newStudent as Student];
    notifyListeners('students');
    return newStudent;
  }
};

export const updateStudent = async (student: Student) => {
  if (db) {
    try {
      const studentRef = doc(db, "students", student.id);
      const { id, ...data } = student;
      await updateDoc(studentRef, data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `students/${student.id}`);
    }
  } else {
    localData.students = localData.students.map(s => s.id === student.id ? student : s);
    notifyListeners('students');
  }
};

export const deleteStudent = async (id: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "students", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
    }
  } else {
    localData.students = localData.students.filter(s => s.id !== id);
    notifyListeners('students');
  }
};

// --- Teachers ---
export const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "teachers"), teacher);
      return { ...teacher, id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "teachers");
    }
  } else {
    const newTeacher = { ...teacher, id: crypto.randomUUID() };
    localData.teachers = [...localData.teachers, newTeacher as Teacher];
    notifyListeners('teachers');
    return newTeacher;
  }
};

export const updateTeacher = async (teacher: Teacher) => {
  if (db) {
    try {
      const ref = doc(db, "teachers", teacher.id);
      const { id, ...data } = teacher;
      await updateDoc(ref, data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `teachers/${teacher.id}`);
    }
  } else {
    localData.teachers = localData.teachers.map(t => t.id === teacher.id ? teacher : t);
    notifyListeners('teachers');
  }
};

export const deleteTeacher = async (id: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "teachers", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `teachers/${id}`);
    }
  } else {
    localData.teachers = localData.teachers.filter(t => t.id !== id);
    notifyListeners('teachers');
  }
};

// --- Groups ---
export const addGroup = async (group: Group) => {
  if (db) {
    try {
      const ref = doc(db, "groups", group.id);
      await setDoc(ref, group);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `groups/${group.id}`);
    }
  } else {
    localData.groups = [...localData.groups, group];
    notifyListeners('groups');
  }
};

export const updateGroup = async (group: Group) => {
  if (db) {
    try {
      const ref = doc(db, "groups", group.id);
      await setDoc(ref, group);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `groups/${group.id}`);
    }
  } else {
    localData.groups = localData.groups.map(g => g.id === group.id ? group : g);
    notifyListeners('groups');
  }
};

export const deleteGroup = async (id: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "groups", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `groups/${id}`);
    }
  } else {
    localData.groups = localData.groups.filter(g => g.id !== id);
    notifyListeners('groups');
  }
};

// --- Events ---
export const addEvent = async (event: CalendarEvent) => {
  if (db) {
    try {
      const ref = doc(db, "events", event.id);
      await setDoc(ref, event);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `events/${event.id}`);
    }
  } else {
    localData.events = [...localData.events, event];
    notifyListeners('events');
  }
};

export const deleteEvent = async (id: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  } else {
    localData.events = localData.events.filter(e => e.id !== id);
    notifyListeners('events');
  }
};

export const updateEvent = async (event: CalendarEvent) => {
  if (db) {
    try {
      const ref = doc(db, "events", event.id);
      await setDoc(ref, event);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${event.id}`);
    }
  } else {
    localData.events = localData.events.map(e => e.id === event.id ? event : e);
    notifyListeners('events');
  }
};

// --- Seeding ---
export const seedDatabase = async () => {
  if (db) {
    try {
      const batch = writeBatch(db);

      MOCK_STUDENTS.forEach(s => {
        const ref = doc(collection(db, "students"));
        batch.set(ref, { ...s, id: ref.id });
      });

      MOCK_TEACHERS.forEach(t => {
        const ref = doc(collection(db, "teachers"));
        batch.set(ref, { ...t, id: ref.id });
      });

      MOCK_GROUPS.forEach(g => {
        const ref = doc(collection(db, "groups"));
        batch.set(ref, { ...g, id: ref.id });
      });
      
      MOCK_EVENTS.forEach(e => {
        const ref = doc(collection(db, "events"));
        batch.set(ref, { ...e, id: ref.id });
      });

      await batch.commit();
      console.log("Database seeded!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "seeding");
    }
  } else {
    console.log("Mock DB is already active (seeded by default constants).");
  }
};

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  limit,
  writeBatch
} from 'firebase/firestore'
import { db } from './config'

// ... existing functions ...

export const getStudentsByClass = async (className, section) => {
  try {
    console.log("Fetching students for Class:", String(className), "Section:", section);
    const q = query(
      collection(db, 'students'),
      where('class', '==', String(className)),
      where('section', '==', section),
      orderBy('rollNo', 'asc')
    )
    const snapshot = await getDocs(q)
    const students = []
    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() })
    })
    console.log(`Found ${students.length} students`);
    return { success: true, data: students }
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: error.message }
  }
}

export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateStudent = async (studentId, studentData) => {
  try {
    const studentRef = doc(db, 'students', studentId)
    await updateDoc(studentRef, {
      ...studentData,
      updatedAt: Timestamp.now()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteStudent = async (studentId) => {
  try {
    const studentRef = doc(db, 'students', studentId)
    await deleteDoc(studentRef)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const bulkAddStudents = async (studentsList) => {
  try {
    const results = await Promise.all(studentsList.map(student => 
      addDoc(collection(db, 'students'), {
        ...student,
        createdAt: Timestamp.now()
      })
    ))
    return { success: true, count: results.length }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getAttendanceReports = async (className, section, date) => {
  try {
    let q = collection(db, 'attendance')
    const constraints = []
    
    if (className) constraints.push(where('class', '==', className))
    if (section) constraints.push(where('section', '==', section))
    if (date) constraints.push(where('date', '==', date))
    
    const finalQuery = query(q, ...constraints, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(finalQuery)
    const reports = []
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: reports }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const createTest = async (testData) => {
  try {
    const docRef = await addDoc(collection(db, 'tests'), {
      ...testData,
      createdAt: Timestamp.now()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getTests = async (facultyId = null, subject = null) => {
  try {
    let q = collection(db, 'tests')
    const constraints = []
    
    if (facultyId) constraints.push(where('facultyId', '==', facultyId))
    if (subject) constraints.push(where('subject', '==', subject))
    
    const finalQuery = query(q, ...constraints, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(finalQuery)
    const tests = []
    querySnapshot.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: tests }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const checkAttendanceExists = async (className, section, timeSlot, selectedDate, board = 'CBSE') => {
  try {
    const dateToCheck = selectedDate || new Date().toISOString().split('T')[0]
    const q = query(
      collection(db, 'attendance'),
      where('date', '==', dateToCheck),
      where('class', '==', String(className)),
      where('section', '==', section),
      where('board', '==', board),
      where('timeSlot', '==', timeSlot),
      limit(1)
    )
    const snapshot = await getDocs(q)
    return { success: true, exists: !snapshot.empty }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const submitAttendance = async (attendanceData) => {
  try {
    // Check if attendance already exists for this date, class, section, and timeSlot
    const dateToCheck = attendanceData.date || new Date().toISOString().split('T')[0]
    const q = query(
      collection(db, 'attendance'),
      where('date', '==', dateToCheck),
      where('class', '==', String(attendanceData.class)),
      where('section', '==', attendanceData.section),
      where('board', '==', attendanceData.board || 'CBSE'),
      where('timeSlot', '==', attendanceData.timeSlot),
      limit(1)
    )
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      return { success: false, error: 'Attendance already submitted for this time slot on ' + dateToCheck }
    }

    await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      date: dateToCheck,
      createdAt: Timestamp.now()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const saveMarks = async (marksData) => {
  try {
    const { testId, class: className, section, records } = marksData;
    
    // Check if marks already exist for this test
    const q = query(
      collection(db, 'marks'),
      where('testId', '==', testId)
    );
    const snapshot = await getDocs(q);
    
    // Using a batch to save multiple records
    const batch = writeBatch(db);
    
    // If updating, delete old records first (or we could update by studentId)
    // For simplicity, we'll delete and re-insert if they exist
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    records.forEach((record) => {
      const markRef = doc(collection(db, 'marks'));
      batch.set(markRef, {
        ...record,
        testId,
        class: className,
        section,
        subject: marksData.subject,
        facultyId: marksData.facultyId,
        facultyName: marksData.facultyName,
        date: Timestamp.now(),
        createdAt: Timestamp.now()
      });
    });

    await batch.commit();
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getMarksByTest = async (testId) => {
  try {
    const q = query(collection(db, 'marks'), where('testId', '==', testId));
    const snapshot = await getDocs(q);
    const marks = [];
    snapshot.forEach((doc) => {
      marks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: marks };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export const getAllMarks = async (filters = {}) => {
  try {
    let q = collection(db, 'marks');
    const constraints = [];
    
    if (filters.class) constraints.push(where('class', '==', parseInt(filters.class)));
    if (filters.section) constraints.push(where('section', '==', filters.section));
    if (filters.subject) constraints.push(where('subject', '==', filters.subject));
    if (filters.testId) constraints.push(where('testId', '==', filters.testId));
    
    const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q;
    const snapshot = await getDocs(finalQuery);
    const marks = [];
    snapshot.forEach((doc) => {
      marks.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: marks };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export const addContact = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contactData,
      createdAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const addAdmission = async (admissionData) => {
  try {
    const docRef = await addDoc(collection(db, 'admissions'), {
      ...admissionData,
      createdAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getContacts = async () => {
  try {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const contacts = []
    querySnapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: contacts }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getAdmissions = async () => {
  try {
    const q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const admissions = []
    querySnapshot.forEach((doc) => {
      admissions.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: admissions }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: users }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const approveUser = async (userId, role, currentUserRole) => {
  try {
    // 1. Permission Validation
    if (role === 'admin' && currentUserRole !== 'master_admin') {
      return { success: false, error: 'Only master admin can approve admin requests' }
    }

    if ((role === 'faculty' || role === 'reception') && 
        currentUserRole !== 'master_admin' && 
        currentUserRole !== 'admin') {
      return { success: false, error: 'You do not have permission to approve staff' }
    }

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      approved: true,
      role: role // Update to final role chosen by admin
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

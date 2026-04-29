import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  doc,
  updateDoc,
  where,
  limit
} from 'firebase/firestore'
import { db } from './config'

// ... existing functions ...

export const getStudentsByClass = async (className, section) => {
  try {
    const q = query(
      collection(db, 'students'),
      where('class', '==', className),
      where('section', '==', section),
      orderBy('rollNo', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const students = []
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: students }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const submitAttendance = async (attendanceData) => {
  try {
    // Check if attendance already exists for this date, class, and section
    const today = new Date().toISOString().split('T')[0]
    const q = query(
      collection(db, 'attendance'),
      where('date', '==', today),
      where('class', '==', attendanceData.class),
      where('section', '==', attendanceData.section),
      limit(1)
    )
    const existing = await getDocs(q)
    if (!existing.empty) {
      return { success: false, error: 'Attendance already marked for today for this class.' }
    }

    const docRef = await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      date: today,
      createdAt: Timestamp.now()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
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

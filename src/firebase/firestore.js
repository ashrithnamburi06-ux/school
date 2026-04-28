import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore'
import { db } from './config'

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

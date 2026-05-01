import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth, db } from './config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const MASTER_ADMIN_EMAIL = 'ashrithnamburi06@gmail.com' // Define master admin email

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const loginWithGoogle = async (userData) => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // 1. Check if user is master admin
    if (user.email === MASTER_ADMIN_EMAIL) {
      const masterAdminData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Master Admin',
        role: 'master_admin',
        approved: true,
        updatedAt: new Date().toISOString()
      }
      await setDoc(doc(db, 'users', user.uid), masterAdminData, { merge: true })
      return { success: true, user, role: 'master_admin', approved: true }
    }

    // 2. Check Firestore for existing user
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const data = userDoc.data()
      if (!data.approved) {
        return { success: false, error: 'Waiting for admin approval' }
      }
      return { success: true, user, role: data.role, approved: true }
    } else {
      // 3. Create new user request using the data from the form
      if (!userData) {
        return { success: false, error: 'Registration details are required for new users.' }
      }

      const newUser = {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        phone: userData.phone,
        facultyId: userData.facultyId,
        role: userData.role,
        subject: userData.role === 'faculty' ? userData.subject : null,
        boardAccess: (userData.role === 'faculty' || userData.role === 'reception') ? (userData.boardAccess || 'BOTH') : null,
        approved: false,
        createdAt: new Date().toISOString()
      }
      await setDoc(userDocRef, newUser)
      return { success: false, error: 'Request submitted. Waiting for admin approval.' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists() ? userDoc.data() : null
  } catch (error) {
    return null
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

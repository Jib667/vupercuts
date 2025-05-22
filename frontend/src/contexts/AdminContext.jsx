import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check if admin credentials are in localStorage
    const storedAuth = localStorage.getItem('vupercutsAdminAuth')
    if (storedAuth) {
      const authData = JSON.parse(storedAuth)
      verifyAdminAuth(authData.username, authData.password)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])
  
  const verifyAdminAuth = async (username, password) => {
    try {
      // Create Basic Auth header
      const authString = `${username}:${password}`
      const encodedAuth = btoa(authString)
      
      console.log('Verifying admin with credentials:', username)
      
      await axios.get(`${API_URL}/admin/verify`, {
        headers: {
          'Authorization': `Basic ${encodedAuth}`
        }
      })
      
      console.log('Admin verification successful')
      setIsAdmin(true)
      setAdminUsername(username)
      setAdminPassword(password)
      
      return true
    } catch (err) {
      console.error('Admin verification failed:', err)
      setIsAdmin(false)
      localStorage.removeItem('vupercutsAdminAuth')
      throw err
    }
  }
  
  const adminLogin = async (username, password) => {
    try {
      await verifyAdminAuth(username, password)
      
      // Save credentials to localStorage (caution: only do this in production with HTTPS)
      localStorage.setItem('vupercutsAdminAuth', JSON.stringify({
        username,
        password
      }))
      
      return true
    } catch (err) {
      console.error('Admin login error:', err)
      throw err
    }
  }
  
  const adminLogout = () => {
    setIsAdmin(false)
    setAdminUsername('')
    setAdminPassword('')
    localStorage.removeItem('vupercutsAdminAuth')
  }
  
  const getAuthHeaders = () => {
    if (!isAdmin) {
      console.warn('Attempting to get auth headers but not logged in as admin')
      return {}
    }
    
    console.log('Creating auth headers for admin:', adminUsername)
    const authString = `${adminUsername}:${adminPassword}`
    const encodedAuth = btoa(authString)
    
    return {
      'Authorization': `Basic ${encodedAuth}`
    }
  }
  
  return (
    <AdminContext.Provider value={{
      isAdmin,
      loading,
      adminLogin,
      adminLogout,
      getAuthHeaders
    }}>
      {children}
    </AdminContext.Provider>
  )
} 
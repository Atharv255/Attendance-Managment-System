import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="max-w-7xl mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
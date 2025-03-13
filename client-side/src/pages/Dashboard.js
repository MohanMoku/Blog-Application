import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DasSidebar from '../components/DasSidebar'
import DashProfile from '../components/DashProfile'

const Dashboard = () => {

  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl === 'profile'){
      setTab('profile')
    }
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56">
        {/* sidebar */}
        <DasSidebar />
      </div>
      {/* profile */}
      {tab === 'profile' && <DashProfile />}
    </div>
  )
}

export default Dashboard
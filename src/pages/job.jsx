import { useUser } from '@clerk/clerk-react'
import React from 'react'

const JobPage
 = () => {

  const { isLoaded, user } = useUser();

  return (
    <div>JobPage
    </div>
  )
}

export default JobPage

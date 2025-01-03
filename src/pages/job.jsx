import { getSingleJob } from '@/api/apijobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const JobPage
 = () => {

  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn:fnJob,
    data:Job,
    loading:loadingJob,
   }=useFetch(getSingleJob,{
    job_id:id,
   });

   useEffect(() => {
    if (isLoaded) fnJob();
   },[isLoaded]);

   if(!isLoaded || loadingJob){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  

  return (
    <div className='flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl' >{Job?.title} </h1>
        <img src={Job?.company?.logo_url} className='h-12' alt={Job?.title} />
      </div>
      <div className='flex justify-between' >
        <div className='flex gap-2'>
          <MapPinIcon/>
          {Job?.location}
        </div>
        <div className='flex gap-2 ' >
          <Briefcase/> {Job?.applications?.length} Applicants
        </div>
        <div className='flex gap-2 ' >
          {Job?.isOpen ? (
            <>
              <DoorOpen/> Open
              </>
            ):(
            <>
            <DoorClosed/> Closed
            </>
          )}
        </div>
      </div>

      {/* hiring status */}

      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg' >{Job?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>
        What We are looking for
      </h2>
      <MDEditor.Markdown source={Job?.requirements} className='bg-transparent sm:text-lg'/>
    </div>
  )
}

export default JobPage

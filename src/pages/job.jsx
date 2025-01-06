import { getSingleJob, updateHiringStatus } from '@/api/apijobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationCard from '@/components/application-card';

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

   const {
    loading:loadingHiringStatus,
    fn:fnHiringStatus,
   }=useFetch(updateHiringStatus,{
    job_id:id,
   });

   const handleStatusChange =(value)=>{
    const isOpen = value ==="open"
    fnHiringStatus(isOpen).then(() => fnJob())
  };

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
      {loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />}
      {Job?.recruiter_id === user?.id && (
      <Select onValueChange={handleStatusChange}>
      <SelectTrigger
      className={`w-full ${Job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
      >
        <SelectValue 
        placeholder={
          "Hiring Status" + (Job?.isOpen ? "( Open )" : "( Closed )")
        } />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
    )}

      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg' >{Job?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>
        What We are looking for
      </h2>
      <MDEditor.Markdown source={Job?.requirements} className='bg-transparent sm:text-lg'/>

      {/* render applications */}
      {Job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={Job}
          user={user}
          ferchJob={fnJob}
          applied={Job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

       {Job?.applications?.length > 0 && Job?.recruiter_id === user?.id && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
            {Job?.applications.map((application)=>{
              return (
              <ApplicationCard key={application.id} application={application}/>
            );
            })}
          </div>
       )}

    </div>
  )
}

export default JobPage

import { getCompanies } from '@/api/apiCompannies';
import { getJobs } from '@/api/apijobs'
import JobCard from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import { State } from 'country-state-city';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';

const JobListing = () => {


  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const {isLoaded} = useUser();

 const {
  fn:fnJobs,
  data:Jobs,
  loading:loadingJobs,
 }=useFetch(getJobs,{
  location,
  company_id,
  searchQuery,
 });


 const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

 useEffect(() => {
  if(isLoaded) fnCompanies();
 },[isLoaded]);

 useEffect(() => {
  if(isLoaded) fnJobs();
 },[isLoaded, location, company_id, searchQuery]);

 const handleSearch = (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);

  const query = formData.get("search-query");
  if (query) setSearchQuery(query);
 };

 const clearFilters = () => {
  setSearchQuery("");
  setCompany_id("");
  setLocation("");
 };

 if(!isLoaded){
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
}

  return (
    <div>
      <h1 className='mb-6 gradient-title font-extrabold text-6xl sm:text-7xl text-center'>
        Latest Job
      </h1>

      {/* add filters here */}
       <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3' >
         <Input
         type='text'
         placeholder='Search Jobs by Title..'
         name='search-query'
         className='h-full flex-1 px-4 text-md'
         />
         <Button type="submit" className="h-full sm:w-28" variant= 'blue'>
          Search
         </Button>
       </form>

       <div className='flex flex-col sm:flex-row gap-2'>
       <Select value={location} onValueChange={(value) => setLocation(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {State.getStatesOfCountry("IN").map(({ name })=>{
             return ( 
             <SelectItem key={name} value={name}>
                {name}
                </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.isArray(companies) && companies.length > 0 ? (
                companies.map(({ name, id }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No Companies Available</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
    <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2" >
          Clear Filters
    </Button>
  </div>

    {loadingJobs && (
      <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    )}

    {loadingJobs === false && (
      <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Jobs?.length ?(
          Jobs.map((job)=>{
            return( <JobCard 
            key={job.id}
            job={job}
            savedInit={job?.saved?.length > 0} />
            );
          })
        ):(
          <div>No Jobs fouund</div>
        )}
        </div>
    )}
 
    </div>
  )
};

export default JobListing ;
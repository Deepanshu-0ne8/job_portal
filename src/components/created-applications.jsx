import { getApplications } from '@/api/apiApplications';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import ApplicationCard from './application-card';

const CreatedApplications = () => {
    const { user } = useUser();

    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
      } = useFetch(getApplications, {
        user_id: user.id,
      });

      useEffect(() => {
        fnApplications();
      },[]);

      if(loadingApplications){
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
      }

    const safeApplications = Array.isArray(applications) ? applications : [];

  return (
    <div className="flex flex-col gap-2">
            {safeApplications.length === 0 ? (
                <div>No applications found.</div>
            ) : (
                safeApplications.map((application) => (
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        isCandidate
                    />
                ))
            )}
        </div>
  );
};

export default CreatedApplications;
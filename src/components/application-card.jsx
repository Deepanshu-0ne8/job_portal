import { Boxes, BriefcaseBusiness, Dam, DamIcon, Download, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

const ApplicationCard = ({ application, isCandidate = false }) => {

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    };

  return (<Card>
    <CardHeader>
        <CardTitle className="flex justify-between font-bold">
            {isCandidate
            ? `${application?.Job?.title} at ${application?.Job?.company?.name}`
        : application?.name}
        <Download
        size={18}
        className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
        onClick={handleDownload}
        />
        </CardTitle>
    </CardHeader>

    <CardContent className='flex flex-col gap-4 flex-1'>
        <div className="flex flex-col md:flex-row justify-between">
             <div className="flex gap-2 items-center">
                <BriefcaseBusiness size={15}/> {application?.experience} Years of experience
             </div>

             <div className="flex gap-2 items-center">
                <School size={15}/> {application?.education}
             </div>

             <div className="flex gap-2 items-center">
                <Boxes size={15}/> Skills: {application?.skills}
             </div>
        </div>
        <hr />
    </CardContent>
    <CardFooter className='flex justify-between'>
        <span>{new Date(application?.created_at).toLocaleDateString()}</span>
        {!isCandidate ? <span className="capitalize font-bold text-green-400">Status: {application?.status}</span> : <></> }
    </CardFooter>
  </Card>
  );
};

export default ApplicationCard;
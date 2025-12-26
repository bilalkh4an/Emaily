import { User, CalendarDays,VenusAndMars, Mail, Phone } from "lucide-react";
import { useState } from "react";
const PatientRegistration = () => {

    const [page,setPage] = useState(1);

    const formHandler = (e,identifier) => {
    e.preventDefault();


        if (identifier === "next") {
        setPage(prev => Math.min(prev + 1, 3));
        }

        if (identifier === "back") {
        setPage(prev => Math.max(prev - 1, 1));
        }

    
    

};

    return (
        <div className="bg-[url(./assets/background2.png)] bg-cover bg-center bg-no-repeat">        
       <div className="h-screen px-10 py-10 shadow-2xl">          
            <div className="w-6/12 px-10 py-10 ml-auto shadow-2xl shadow-black/50 rounded-2xl">
                <h1 className="text-center py-2 font-medium text-2xl">Pattient Registration</h1>
                <p className="text-center text-gray-600">Step 1:4 Personal Information</p>
                <div className="flex items-center justify-center w-full my-8">
  {/* Step 1 */}
  <div className="flex items-center">
    <div className={`w-8 h-8 rounded-full ${page ==1 ?  "bg-indigo-600" : "bg-gray-300" } text-white flex items-center justify-center font-semibold`}>
      1
      
    </div>
    <span className="ml-2 text-sm font-medium text-indigo-600">
      Personal Info
    </span>
  </div>

  {/* Line */}
  <div className="w-24 h-[2px] bg-indigo-300 mx-4"></div>

  {/* Step 2 */}
  <div className="flex items-center">
    <div className={`w-8 h-8 rounded-full ${page ==2 ?  "bg-indigo-600" : "bg-gray-300" } text-white flex items-center justify-center font-semibold`}>
      2
    </div>
    <span className="ml-2 text-sm text-gray-500">
      Medical Info
    </span>
  </div>

  {/* Line */}
  <div className="w-24 h-[2px] bg-gray-300 mx-4"></div>

  {/* Step 3 */}
  <div className="flex items-center">
    <div className={`w-8 h-8 rounded-full ${page ==3 ?  "bg-indigo-600" : "bg-gray-300" } text-white flex items-center justify-center font-semibold`}>
      3
    </div>
    <span className="ml-2 text-sm text-gray-500">
      Confirmation
    </span>
  </div>
</div>

                <form className="">     
                    <div className={` ${page==1 ? "block" : "hidden"} `}>
                                
  
                <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Patient Name</span>
                </div>
                <input className="w-full border border-gray-600 rounded  px-5 py-2 mx-2 my-1" placeholder="Patient Name" />

                <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <CalendarDays  size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Date of Birth</span>
                </div>              
                <input className="w-full border rounded  px-5 py-2 mx-2 my-1" placeholder="Date of Birth" />


                
                <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <VenusAndMars  size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Gender</span>
                </div>
                <input className="w-full border rounded  px-5 py-2 mx-2 my-1" placeholder="Gender" />
                </div>   

                    <button onClick={(e)=>{
                        formHandler(e,"back");
                    }} className="bg-black text-white py-2 px-20 mx-20 my-5 rounded-2xl">Back</button>
                    <button onClick={(e)=>{
                        formHandler(e,"next");

                    }} className="bg-black text-white py-2 px-20 rounded-2xl">Next</button>
                    
                </form>    
            </div>            
        </div>
        </div>
    )
}
export default PatientRegistration
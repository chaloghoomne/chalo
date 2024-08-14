import {useState} from "react"
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import EditProfile from "./EditProfile"


function Travelers({ user }) {
const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full    flex-col space-y-4">
      {/* Personal Details Card */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-center w-full space-y-4 md:space-y-0">
        <div className="flex flex-col w-full space-x-4 ">
          {/* Personal Details Header */}
          <div className="flex w-full justify-between">
            <h2 className="text-blue-500 text-lg font-semibold ">
              Personal Details
            </h2>
          </div>
          {/* Personal Details Fields */}
          <div className="flex relative flex-wrap flex-col justify-start items-start md:flex-row md:flex-wrap space-x-4 ">
            <div onClick={()=>setIsModalOpen(true)} className="p-2 absolute right-3 top-[-30px] bg-blue-500 rounded-xl">
           {(user?.firstName && user?.lastName)?<FaEdit size={20} color="white" />:<IoAdd size={20} color="white" />}
            </div>
            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between min-w-60">
              <span className="font-medium">
                First Name * :- {user?.firstName}{" "}
              </span>
            </span>

            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between min-w-60">
              <span className="font-medium items-start">
                Last Name :- {user?.lastName}
              </span>
            </span>
            <span className="text-gray-600 flex  my-3 flex-col md:flex-row md:items-center md:justify-between min-w-60">
              <span className="font-medium">Gender :- {user?.gender}</span>
            </span>
            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between  min-w-60">
              <span className="font-medium items-start self-start">
                Date of Birth * :- {user?.dob?.slice(0, 10)}
              </span>
            </span>
            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between  min-w-60">
              <span className="font-medium">
                Occupation * :- {user?.occupation}
              </span>
            </span>
            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between  min-w-60">
              <span className="font-medium">
                Mobile Number * :- {user?.phoneNumber}
              </span>
            </span>
            <span className="text-gray-600 flex my-3 flex-col md:flex-row md:items-center md:justify-between  min-w-60">
              <span className="font-medium">Email Address:- {user?.email}</span>
            </span>
          </div>
        </div>
      </div>
       <EditProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Travelers;

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import EditProfile from "./EditProfile";

function Travelers({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full items-center">
      {/* Personal Details Card */}
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-4xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-blue-600 text-2xl font-semibold">Personal Details</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition duration-300"
          >
            {user?.firstName && user?.lastName ? (
              <FaEdit size={20} />
            ) : (
              <IoAdd size={20} />
            )}
          </button>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InfoField label="First Name" value={user?.firstName} required />
          <InfoField label="Last Name" value={user?.lastName} />
          <InfoField label="Gender" value={user?.gender} />
          <InfoField label="Date of Birth" value={user?.dob?.slice(0, 10)} required />
          <InfoField label="Occupation" value={user?.occupation} required />
          <InfoField label="Mobile Number" value={user?.phoneNumber} required />
          <InfoField label="Email Address" value={user?.email} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

// Reusable Info Field Component
const InfoField = ({ label, value, required = false }) => (
  <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-sm">
    <span className="text-sm text-gray-500">{label} {required && <span className="text-red-500">*</span>}</span>
    <span className="font-medium text-gray-800">{value || "Not provided"}</span>
  </div>
);

export default Travelers;

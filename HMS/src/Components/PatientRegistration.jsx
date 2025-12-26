import { User, CalendarDays, VenusAndMars, Mail, Phone } from "lucide-react";
import { useState } from "react";
const PatientRegistration = () => {
  const [page, setPage] = useState(1);

  const [formdata, setFromdata] = useState({
    name: "",
    age: "",
    gender: "",
    medicalcondition: "",
    Allergies: "",
    CurrentMedications: "",
  });

  const canProceed = () => {
    if (page === 1) {
      // Step 1: name, age, gender required
      return formdata.name && formdata.age && formdata.gender;
    }

    if (page === 2) {
      // Step 2: medical info required
      return (
        formdata.medicalcondition &&
        formdata.Allergies &&
        formdata.CurrentMedications
      );
    }

    return true; // Step 3 is confirmation, no check needed
  };

  const datachanged = (e) => {
    const { name, value } = e.target;

    setFromdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formHandler = (e, identifier) => {
    e.preventDefault();

    if (identifier === "next") {
      if (!canProceed()) {
        alert("Please fill all required fields for this step!");
        return; // stop moving forward
      }
      if (!canProceed()) {
        alert("Please fill all required fields for this step!");
        return; // stop moving forward
      }
      setPage((prev) => Math.min(prev + 1, 3));
    }

    if (identifier === "back") {
      if (!canProceed()) {
        alert("Please fill all required fields for this step!");
        return; // stop moving forward
      }
      setPage((prev) => Math.max(prev - 1, 1));
    }

    if (identifier === "Register") {
      alert("Data Enter Successfully");
    }
  };

  return (
    <div className="md:bg-[url(./assets/background2.png)] bg-cover bg-center bg-no-repeat">
      <div className="h-screen px-10 py-10 shadow-2xl">
        <div className="w-full h-full md:w-6/12 px-10 py-10 ml-auto shadow-2xl shadow-black/50 rounded-2xl">
          <h1 className="text-center py-2 font-medium text-2xl">
            Pattient Registration
          </h1>
          <p className="text-center text-gray-600">
            Step {page}:3 Personal Information
          </p>
          <div className="flex items-center justify-center w-full my-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full ${
                  page == 1 ? "bg-indigo-600" : "bg-gray-300"
                } text-white flex items-center justify-center font-semibold`}
              >
                1
              </div>

              <span
                className={`ml-2 text-sm font-medium ${
                  page == 1 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Personal Info
              </span>
            </div>

            {/* Line */}
            <div className="w-24 h-[2px] bg-indigo-300 mx-4"></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full ${
                  page == 2 ? "bg-indigo-600" : "bg-gray-300"
                } text-white flex items-center justify-center font-semibold`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  page == 2 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Medical Info
              </span>
            </div>

            {/* Line */}
            <div className="w-24 h-[2px] bg-gray-300 mx-4"></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full ${
                  page == 3 ? "bg-indigo-600" : "bg-gray-300"
                } text-white flex items-center justify-center font-semibold`}
              >
                3
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  page == 3 ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>

          <form className="">
            <div className={` ${page == 1 ? "block" : "hidden"} `}>
              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Patient Name</span>
              </div>
              <input
                className="w-full border border-gray-600 rounded  px-5 py-2 mx-2 my-1"
                placeholder="Patient Name"
                name="name"
                onChange={(e) => {
                  datachanged(e);
                }}
              />

              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <CalendarDays size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Date of Birth</span>
              </div>
              <input
                type="date"
                className="w-full border rounded  px-5 py-2 mx-2 my-1"
                placeholder="Date of Birth"
                name="age"
                onChange={(e) => {
                  datachanged(e);
                }}
              />

              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <VenusAndMars size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Gender</span>
              </div>
              <select
                name="gender"
                className="w-full border rounded px-5 py-2 mx-2 my-1"
                onChange={datachanged}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={page == 2 ? "block" : "hidden"}>
              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium">
                  Medical Condition(s)
                </span>
              </div>
              <input
                className="w-full border border-gray-600 rounded  px-5 py-2 mx-2 my-1"
                placeholder="Medical Condition(s)"
                name="medicalcondition"
                onChange={(e) => {
                  datachanged(e);
                }}
              />

              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Allergies</span>
              </div>
              <input
                className="w-full border border-gray-600 rounded  px-5 py-2 mx-2 my-1"
                placeholder="Allergies"
                name="Allergies"
                onChange={(e) => {
                  datachanged(e);
                }}
              />

              <div className="flex items-center gap-2 text-gray-700 mx-2 my-2">
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Current Medications</span>
              </div>
              <input
                className="w-full border border-gray-600 rounded  px-5 py-2 mx-2 my-1"
                placeholder="Current Medications"
                name="CurrentMedications"
                onChange={(e) => {
                  datachanged(e);
                }}
              />
            </div>

            <div className={page == 3 ? "block" : "hidden"}>
              <div className="flex justify-center">
                <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
                  {/* Left Side - Image */}
                  <div className="flex justify-center items-center p-6 md:p-10 md:w-1/2 bg-gray-100">
                    <img
                      className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover"
                      src="https://thumbs.dreamstime.com/b/circle-check-mark-icon-confirmation-success-logo-symbol-approved-accept-complete-406016702.jpg"
                      alt="Patient"
                    />
                  </div>

                  {/* Right Side - Information */}
                  <div className="md:w-1/2 p-3 flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-2">
                      Personal Information
                    </h3>
                    <p className="mb-1 text-gray-600">Name: {formdata.name}</p>
                    <p className="mb-1 text-gray-600">Age: {formdata.age}</p>
                    <p className="mb-1 text-gray-600">
                      Gender: {formdata.gender}
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-4">
                      Medical Information
                    </h3>
                    <p className="mb-1 text-gray-600">
                      Medical Condition(s): {formdata.medicalcondition}
                    </p>
                    <p className="mb-1 text-gray-600">
                      Allergies: {formdata.Allergies}
                    </p>
                    <p className="mb-1 text-gray-600">
                      Current Medications: {formdata.CurrentMedications}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5 md:flex md:flex-row md:justify-between">
              <button
                onClick={(e) => {
                  formHandler(e, "back");
                }}
                className="bg-black text-white py-2 px-20 rounded-2xl hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={(e) => {
                  formHandler(e, "next");
                }}
                className={
                  page < 3
                    ? "block bg-black text-white py-2 px-20 rounded-2xl  hover:bg-gray-600 "
                    : "hidden"
                }
              >
                Next
              </button>

              <button
                onClick={(e) => {
                  formHandler(e, "Register");
                }}
                className={
                  page == 3
                    ? "block bg-black text-white py-2 px-20 rounded-2xl  hover:bg-green-700  "
                    : "hidden"
                }
              >
                Register Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PatientRegistration;

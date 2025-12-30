import { useState } from "react";

const Project = () => {
  const data = [
    { id: 1, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 2, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 3, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 4, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 5, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 6, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 7, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 8, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 9, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 10, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 11, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 12, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 13, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 14, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 15, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 16, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 17, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 18, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 19, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 20, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 21, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 22, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 23, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 24, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 25, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 26, email: "Khan003@gmail.com", age: 21, status: "Pending" },
    { id: 27, email: "bilal@gmail.com", age: 21, status: "Active" },
    { id: 28, email: "Ali@gmail.com", age: 31, status: "Inactive" },
    { id: 29, email: "Malik-Naseem@gmail.com", age: 25, status: "Active" },
    { id: 30, email: "Khan003@gmail.com", age: 21, status: "Pending" },
  ];
  const total = data.length;
  const dataPerPage=8
  const [currentpage, setCurrentpage] = useState(1);
  const [startpage, setstartpage] = useState(0);
  const [endPage, setendPage] = useState(dataPerPage);
  const currentData = data.slice(startpage, endPage);

  return (
    <div className="w-full mt-5 ">
      <div className="flex justify-between shadow rounded bg-gray-300 mx-10 px-5 py-4 items-center">
        <p className="text-slate-800">Project Board</p>
        <button className=" bg-slate-600 text-white  rounded py-1 px-2 hover:bg-white hover:text-black">
          Create Project
        </button>
      </div>

      <div className="overflow-x-auto mx-10 my-5 rounded-lg shadow-xl border border-gray-400">
        <table className="w-full text-center">
          <thead className="bg-slate-600 text-white">
            <tr className="">
              <td className="p-1 text-m uppercase">ID</td>
              <td className="p-1 text-m uppercase">Email</td>
              <td className="p-1 text-m uppercase">Age</td>
              <td className="p-1 text-m uppercase">Status</td>
              <td className="p-1 text-m uppercase">Action</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {currentData.map((items) => (
              <tr className="hover:bg-slate-200 ">
                <td className="p-2 text-sm text-gray-600">{items.id}</td>
                <td className="p-2 text-sm text-gray-600 font-mono">
                  {items.email}
                </td>
                <td className="p-2 text-sm text-gray-600">{items.age}</td>
                <td className={`p-2 text-sm text-gray-600`}>
                  <span
                    className={` px-2 rounded text-black
                        ${items.status === "Active" ? "bg-green-200" : ""} 
                        ${items.status === "Inactive" ? "bg-red-200 " : ""} 
                        ${
                          items.status === "Pending" ? "bg-yellow-200 " : ""
                        }                         
                        `}
                  >
                    {items.status}
                  </span>
                </td>
                <td className="p-2 text-sm text-gray-600">
                  <button className="px-5 py-1 rounded shadow bg-slate-400 hover:bg-white active:bg-slate-900">
                    =
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="">
        <div className="flex justify-between gap-5 shadow rounded bg-gray-300 text-black mx-10 px-5 py-4 mt-10 ">
          <div className="flex gap-5">
            <p className="text-slate-800 ">Total Pages: {Math.floor(total / 8)}</p>
            <p className="text-slate-800">Current Page: {currentpage}</p>
          </div>
          <div>
            <div className="flex gap-5 items-center">
              <div className="">
                <button
                  className={`bg-slate-600 text-white  rounded py-1 px-5 hover:bg-white hover:text-black
                    
                    ${startpage > 0 ? "block" : "hidden"}
                    
                    `}
                  onClick={() => {
                    if (startpage > 0) {
                      setstartpage((prev) => prev - dataPerPage);
                      setendPage((prev) => prev - dataPerPage);
                      setCurrentpage((prev) => prev - 1);
                    }
                  }}
                >
                  Previous
                </button>
              </div>
              <div>
                <button
                  className={`bg-slate-600 text-white  rounded py-1 px-5 hover:bg-white hover:text-black
                    ${endPage < total ? "block" : "hidden"}`}
                  onClick={() => {
                    if (endPage < total) {
                      setstartpage((prev) => prev + dataPerPage);
                      setendPage((prev) => prev + dataPerPage);
                      setCurrentpage((prev) => prev + 1);
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Project;

import { useForm } from "react-hook-form";
const PatientRegistration2 = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex items-center h-screen  bg-black">
      <div className="mx-auto w-6/12  p-8 rounded-2xl bg-white">
        <h1 className="text-center text-3xl font-semibold py-3">
          Registration Form
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex md:gap-3 md:justify-between">
            <div className="md:w-6/12">
              <label>Email Address</label>
              <input
                className="input-primary"
                type="email"
                placeholder="Enter Email Address"
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                })}
              />
            </div>

            <div className="md:w-6/12">
              <label>Password</label>
              <input
                className="input-primary"
                type="password"
                placeholder="Enter Password"
                {...register("password", { required: true, minLength: 8 })}
              />
            </div>
          </div>

          <div className="md:flex md:gap-3 md:justify-between">
            <div className="md:w-6/12">
              <label>Full Name</label>
              <input
                className="input-primary"
                type="text"
                placeholder="Full Name"
                {...register("name", { required: true })}
              />
            </div>

            <div className="md:w-6/12">
              <label>Date of Birth</label>
              <input
                className="input-primary"
                type="date"
                placeholder="DOB"
                {...register("dob", { required: true })}
              />
            </div>
          </div>

          <label>Gender</label>
          <select
            className="input-primary"
            {...register("gender", { required: true })}
          >
            <option value="" disabled selected>
              Select an Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Address</label>
          <input
            className="input-primary"
            type="text"
            placeholder="Address"
            {...register("address", { required: true })}
          />
          <button className="btn-primary">Register Now</button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration2;

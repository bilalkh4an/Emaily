import { useForm } from "react-hook-form";

const Login = () => {
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
    <div className="flex items-center h-screen bg-black">
      <div className="mx-auto md:w-4/12 p-8 rounded-2xl bg-white ">
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label>Email Address</label>
          <input className="input-primary" type="email" placeholder="Enter Email Address"{...register("Name", {required: true,pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,},})}/>
        <label>Password</label>  
          <input className="input-primary" type="password" placeholder="Enter Password"{...register("Fname", { required: true,minLength:8 })}/>
          <button className="btn-primary">Register Now</button>
        </form>
      </div>
    </div>
  );
};
export default Login;

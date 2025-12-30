const Dashboard = () => {
  const view = ["Projects", "Units", "Clients", "Orders","Billing"];
  return (
    <div className="w-full bg-slate-300 py-2 px-2">
      <div className="px-5 py-5 my-5 bg-white rounded">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex flex-col items-center justify-center md:flex-row flex-wrap md:gap-2">
        {view.map((items) => (
          <div className="w-8/12 my-2 md:w-3/12 bg-[#3C153B] text-white rounded-2xl py-10 px-10 text-center hover:bg-[#8B1E3F]">
            <div className="flex items-center gap-2 justify-center">
              <p className="text-2xl font-semibold">5</p>
              <p className="text-2xl">{items}</p>
            </div>
            <p className="bg-[#89BD9E] mt-2 py-1 rounded text-black hover:bg-black hover:text-white">
              View {items}
            </p>            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

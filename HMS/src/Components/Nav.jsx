const Nav = () => {
  return (
    <div className="hidden md:block md:flex">
      <div className="w-2/12 bg-black text-white px-2 "></div>
        <div className="w-full">
          <div className="w-full flex justify-end text-center">
            <button className=" hover:bg-slate-500 hover:text-white rounded py-2 px-3">
              <div className="flex gap-5 items-center justify-end">
                <p>Hi Bilal</p>
                <div className="bg-black px-3 py-1 rounded">
                  <p className="text-white">B</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default Nav;

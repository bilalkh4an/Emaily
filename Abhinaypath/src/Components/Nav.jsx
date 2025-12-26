const Nav= () =>
{
    return (
        <div className="flex items-center justify-between px-5 py-3">
        <div className="flex gap-2 items-center ml-10 text-2xl border-3 rounded">
          <div className="w-10 h-10">
            <img src="https://www.abhinaypath.com/images/logo.png" />
          </div>
          Abhinayपथ
        </div>
        <div>
          <ul className="hidden md:flex gap-10 font-medium">
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              Events
            </ui>
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              Theatre Artists
            </ui>
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              Production & Backstage
            </ui>
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              Mentorship
            </ui>
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              About
            </ui>
            <ui className="text-base font-medium transition-colors hover:text-[#7E1F2E] hover:font-medium ">
              Contact
            </ui>
          </ul>
        </div>
        <div className="hidden md:block">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-full bg-[#7E1F2E] hover:bg-[#6a1a27] text-white px-4 py-2 h-auto text-sm font-medium transition-transform hover:scale-105">Join Beta Community</button>
        </div>
        <div className="md:hidden text-5xl">=</div>
      </div>
    )
}

export default Nav
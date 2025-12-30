import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Nav from "./Components/nav";
import "./App.css";

function App() {
  return (
    <>
      <Nav />

      <div className="w-full h-screen bg-purple-900 ">
        <div className="ml-20 mx-5 text-white ">
          <button className="px-4 mt-30 mb-10 bg-slate-600 border rounded-2xl font-bold md:text-[12px]">
            Abhinayपथ Community Access
          </button>
          <h1 className="md:w-6/12 font-playfair  text-3xl md:text-6xl">
            A Professional Home for Theatre Practice & Technical Craft
          </h1>
          <h3 className="md:w-8/12 mt-5 text-[18px] md:font-semibold md:text-3xl">
            Build a structured theatre portfolio, explore serious training and
            theatre festivals, and present your work with clarity
          </h3>
          <div className="mt-10 flex flex-col mr-10 md:flex md:flex-row md gap-3 md:w-6/12">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full rounded-full bg-[#F5A623] text-[#2D1A54] hover:bg-[#e69b1e] text-lg px-8 py-6 h-auto font-medium transition-transform hover:scale-105">
              View Auditions
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full rounded-full border-2 border-white text-white hover:bg-white hover:text-[#2D1A54] text-lg px-8 py-6 h-auto font-medium transition-all bg-transparent">
              Browse Workshops
            </button>
          </div>
          <button className="mx-40 py-5 mb-10 md:mx-0 md:py-1 md:mx-50 md:mt-10 md:px-5 md:bg-slate-600 md:border md:rounded-2xl font-bold text-[12px]">
            Join Abhinayपथ Community
          </button>
        </div>
      </div>

      <div className="text-center m-5 mt-20">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#2D1A54]/10 text-[#2D1A54] hover:bg-[#2D1A54]/20 mb-4">
          Core Features
        </div>
        <div class="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gradient text-[#2D1A54] ">
          Your Creative Journey Starts Here
        </div>
        <div max-w-3xl mx-auto>
          <p className="text-xl text-gray-800 ">
            Everything you need for your creative career.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 px-5 py-10 justify-center mt-10">
        <div className="w-100 rounded-2xl shadow-2xl overflow-hidden transition-transform hover:scale-105">
          <img
            className="h-56 w-full object-fit object-center"
            src="https://www.abhinaypath.com/images/auditions-stage.png"
          />
          <div className="p-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold">Find Casting Calls</h3>
            <p className="text-gray-800 mb-6 text-lg">
              Verified auditions for theater, film, and web from trusted
              producers.
            </p>
            <button className="border border-amber-900 rounded-2xl px-5 py-2">
              Explore Auditions
            </button>
          </div>
        </div>

        <div className="w-100 rounded-2xl shadow-2xl overflow-hidden transition-transform hover:scale-105">
          <img
            className="h-56 w-full object-fit object-center"
            src="https://www.abhinaypath.com/images/acting-workshop.png"
          />
          <div className="p-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold">Find Casting Calls</h3>
            <p className="text-gray-800 mb-6 text-lg">
              Verified auditions for theater, film, and web from trusted
              producers.
            </p>
            <button className="border border-amber-900 rounded-2xl px-5 py-2">
              Explore Auditions
            </button>
          </div>
        </div>

        <div className="w-100 rounded-2xl shadow-2xl overflow-hidden transition-transform hover:scale-105">
          <img
            className="h-56 w-full object-fit object-center"
            src="https://www.abhinaypath.com/images/mentorship-hero.png"
          />
          <div className="p-8 flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold">Find Casting Calls</h3>
            <p className="text-gray-800 mb-6 text-lg">
              Verified auditions for theater, film, and web from trusted
              producers.
            </p>
            <button className="border border-amber-900 rounded-2xl px-5 py-2">
              Explore Auditions
            </button>
          </div>
        </div>
      </div>

      <div className="py-10 mt-10 mx-5 bg-gradient-to-r from-[#2D1A54]/5 to-[#F5A623]/5">
        <div className=" text-center">
          <div>
            <button className="px-5 py-3 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#2D1A54]/10 text-[#2D1A54] hover:bg-[#2D1A54]/20 mb-4">
              More Features Coming
            </button>
          </div>
          <div>
            <p className="text-5xl font-playfair text-4xl md:text-5xl font-bold mb-6 text-gradient">
              More Features on the Horizon
            </p>
          </div>
          <div>
            <p className="text-gray-800 max-w-3xl mx-auto text-lg">
              More tools coming soon. Join Abhinayपथ for early access.
            </p>
          </div>
        </div>
        <div className="flex flex-w my-10 mx-10">
          <div className="py-5 px-5 w-100 rounded-2xl shadow-2xl ml-10 ">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-bold text-xl mb-3">Networking Platform</h3>
            <p className="text-gray-800">
              Connect with fellow artists, directors, and producers to
              collaborate on projects.
            </p>
          </div>

          <div className="py-5 px-5 w-100 rounded-2xl shadow-2xl ml-10 ">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="font-bold text-xl mb-3">Networking Platform</h3>
            <p className="text-gray-800">
              Connect with fellow artists, directors, and producers to
              collaborate on projects.
            </p>
          </div>

          <div className="py-5 px-5 w-100 rounded-2xl shadow-2xl ml-10 ">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-bold text-xl mb-3">Networking Platform</h3>
            <p className="text-gray-800">
              Connect with fellow artists, directors, and producers to
              collaborate on projects.
            </p>
          </div>

          <div className="py-5 px-5 w-100 rounded-2xl shadow-2xl ml-10 ">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="font-bold text-xl mb-3">Networking Platform</h3>
            <p className="text-gray-800">
              Connect with fellow artists, directors, and producers to
              collaborate on projects.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className=" text-center bg-purple-900 text-amber-50 p-20">
          <div>
            <button className=" bg-white px-5 py-3 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#2D1A54]/10 text-[#2D1A54] hover:bg-[#2D1A54]/20 mb-4">
              Limited Community Access
            </button>
          </div>
          <div>
            <p className="text-5xl font-playfair text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Ready to Take Your Creative Career to the Next Level?
            </p>
          </div>
          <div>
            <p className="text-white max-w-3xl mx-auto text-lg">
              Join India's creative community today.
            </p>
          </div>
          <div>
            <button className="mt-10 inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-100 rounded-full bg-[#F5A623] text-[#2D1A54] hover:bg-[#e69b1e] text-lg px-8 py-6 h-auto font-medium transition-transform hover:scale-105">
              View Auditions
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="px-10 py-10 bg-blue-950">
          <div className="flex justify-between">
            <div className="w-3/12">
              <div className="flex gap-3">
                <div className="w-10 rounded-2xl">
                  <img src="https://www.abhinaypath.com/images/logo.png" />
                </div>
                <div className="text-white">Abhinayपथ</div>
              </div>
              <p className="text-white">India's creative platform to discover auditions, workshops & prep support — across theatre, film & web.</p>
            </div>
            <div className="w-2/12 text-white">Quick Links
           
              <ul>
                <li className="py-2">home</li>
                 <li className="py-2">home</li>
                  <li className="py-2">home</li>
                 <li className="py-2">home</li>
              </ul>
         
            </div>
            <div className="w-2/12 text-white">Quick Links
           
              <ul>
                <li className="py-2">home</li>
                 <li className="py-2">home</li>
                  <li className="py-2">home</li>
                 <li className="py-2">home</li>
              </ul>
         
            </div>
            <div className="w-3/12 text-white">
            <p>Connect With Us</p>
            <div className="flex gap-3 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </div>
          <p>Subscribe to our newsletter</p>
          <div className="flex">
          <input className="p-2 rounded-l-3xl bg-white text-black " placeholder="Enter Email" />
            <button className="bg-amber-950 rounded-r-full px-3">Subscribe</button>
            </div>
            </div>
            
          </div>
          <div className="py-5 border-dotted border-b-1 border-amber-50"></div>
          <p className="text-white text-center py-5">© 2025 AbhinayPath. All rights reserved.</p>
        </div>
        
      </div>
    </>
  );
}

export default App;

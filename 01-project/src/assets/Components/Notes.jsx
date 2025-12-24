import { use } from "react"
import { useState } from "react"

const Notes= () =>{

    let [title, setTitle]=useState("")
    let [details,setDetails]=useState("")
    const [datatitle, setDatatitle] = useState([]);
    const [datadetails, setDataDetails] = useState([]);

    const formHandler = (e) =>{
        e.preventDefault()
        setTitle("")
        setDetails("")
        let newdatatitle=[...datatitle]

        let newdatadetials=[...datadetails]

        newdatatitle.push(title);
        newdatadetials.push(details);

        setDatatitle(newdatatitle);
    setDataDetails(newdatadetials);

        console.log(`Title are ${datatitle} and details are ${datadetails}`)

    }

    return (
        <div className="w-full h-full bg-black">
            <div className="flex">
                <div className="h-screen w-6/12 mx-8 py-8">
                    <h1 className='text-white text-2xl font-semibold'>Add Notes</h1>
                    <form>
                        <input value={title} onChange={(e)=>{setTitle(e.target.value)}} className="border border-white rounded my-5 text-white w-150 px-3 py-3" type="text" placeholder="Enter Title" />
                        <textarea value={details} onChange={(e)=>{setDetails(e.target.value)}} className="text-white border rounded border-whit w-150 h-50 flex px-3 py-3" placeholder="Enter Details Here" />
                        <button onClick={(e)=>{formHandler(e)}} className="border border-white w-150 my-10 py-3 px-3 rounded bg-white font-semibold">Add Notes</button>

                    </form>
                </div>

                <div className="w-6/12 mx-8 px-8 py-8 border-l-2 border-white">
                    <h1 className="text-white text-2xl font-semibold">Recent Notes</h1>
                    
                    <div className="flex gap-1 flex-wrap">
                        <div className="h-70 w-50 bg-white rounded my-5">
                            <h2 className="text-2xl px-3 py-3 font-bold">{datatitle}</h2>
                            <p className="px-3 py-1 text-gray-500">{datadetails}</p>
                        </div>                        
                    </div>
                </div>
        </div>
        </div>
 
    )
   

}
export default Notes
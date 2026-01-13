import { MessageCircleMore } from "lucide-react"
import { Link } from "react-router-dom"

const GetQuotes =()=>{
    return(
      <Link  to="/get-quote"
        className="right-6 bottom-6 z-50 fixed bg-black focus:ring-opacity-50 shadow-lg px-6 py-4 rounded-full focus:ring-2 font-bold text-white transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none"
        aria-label="Get Quote"
      >
        <span className="flex justify-center items-center gap-3">
        <MessageCircleMore />
          Get Quote
        </span>
      </Link>

    )
  }

  export default GetQuotes
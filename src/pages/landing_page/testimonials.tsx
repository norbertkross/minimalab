import CircleComponent from "../../components/reuseable/gradient_cirle"
import CustomerImage from "../../assets/images/customer.jpg"
import SenaImage from "../../assets/images/sena.jpeg"
const Testimonials = () => {
    const messages =[
        {
            id:1,
            author:"Carlos Ponce M.",
            authorImage:CustomerImage,
            message:"Partnering with this team was a game-changer. They didn’t just build our AI-powered mobile app—they helped shape the entire product vision. From the sleek UI to the intelligent features, everything was executed with precision. Highly recommended!”",
        },
        {
            id:2,
            author:"Sena Godsway",
            authorImage:SenaImage,
            message:"Their process is seamless, transparent, and deeply collaborative. We came in with an idea, and they delivered a full-stack AI web solution that exceeded expectations. The team’s expertise in cloud and AI integration is unmatched.",
        },
    ]
  return (
       <div className="mx-auto py-12 md:py-14 w-full md:w-9/12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <h2 className="font-semibold text-[30px] text-neutral-900 md:text-[48px]">Testimonials</h2>
        </div>

        <div className="sm:flex sm:gap-x-6 lg:gap-x-8 space-y-3 sm:space-y-0 mt-10 sm:mt-16">
            {messages.map((message)=>(
            <div
            key={message.id}
            className="bg-white px-6 py-6 border-2 rounded-lg overflow-hidden text-left">
            <CircleComponent path={message.authorImage}/>

              <p className="text-[16px] text-neutral-600">
                {message.message}
              </p>
              <div className="mt-5">
                <p className="font-semibold text-neutral-800">{message.author}</p>

              </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
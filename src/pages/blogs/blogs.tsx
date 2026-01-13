import Footer from "../../components/footer";
import AppHeader from "../../components/header";
import GetQuotes from "../../components/reuseable/get_quotes";
import BlogList from "./BlogList";

const Blogs =()=>{
    return(
        <>
        <AppHeader />
         <div className="mx-auto mb-10 mt-10 w-full px-4 text-center md:w-7/12">
          <h1 className="mb-4 text-4xl font-bold">Our Blogs</h1>
          <p className="mb-6 text-lg text-gray-600">
            Stay updated with the latest insights, trends, and stories from our team. Explore our collection of blogs covering a wide range of topics designed to inform, inspire, and engage our readers.
          </p>
        </div>

        <BlogList/>


        <Footer/>
        <GetQuotes />
        </>
    )
}

export default Blogs;
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center px-2 pt-16 md:px-24'>
      <div className='mb-6 flex items-center justify-center gap-6'>
        {/*<Link to="/" className='text-3xl'><FaFacebook/></Link>*/}
        <Link to="/" className='text-3xl'><FaLinkedin/></Link>
        <Link to="/" className='text-3xl'><FaX/></Link>
        {/*<Link to="/" className='text-3xl'><FaInstagram/></Link>*/}
        <Link to="/" className='text-3xl'><FaYoutube/></Link>
      </div>

      <div className='mb-14 flex flex-col gap-4 px-6 text-center text-[18px]'>
      <div className='flex flex-col md:flex-row md:gap-6 justify-center items-center gap-2 mt-0'>
         <Link to='/careers' className=''>Careers</Link>
<<<<<<< HEAD
         <p>cscodelabs@gmail.com</p> 
=======
>>>>>>> 1ad29320363c41612519b27b008017beede2888d
        </div>
        <p>All rights reserved. Sailnex &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export default Footer

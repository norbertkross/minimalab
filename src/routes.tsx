import {Route,Routes } from 'react-router-dom'
import LandingPage from './pages/landing_page/landing_page'
import About from './pages/about_page/about_us'
import Works from './pages/works_page/works_page'
import Services from './pages/services_page/services_page'
import NewContact from './pages/contact_page/ContactPage'
import Careers from './pages/careers_page/careers'
import Blogs from './pages/blogs/blogs'

import BlogPage from './pages/blogs/BlogPage'
import CreateBlogPage from './pages/create_blog/create_blog'



const AppRoutes = () => {
  return (
    <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/services' element={<Services/>}/>
    <Route path='/careers' element={<Careers/>}/>

    <Route path='/works' element={<Works/>}/>
    <Route path='/get-quote' element={<NewContact/>}/>
    <Route path='/blogs' element ={<Blogs/>}/>
    <Route path='/blogs/:id' element={<BlogPage />} />
    <Route path='/blogs/admin/create' element={<CreateBlogPage />} />

    </Routes>
  )
}

export default AppRoutes

import { Routes, Route, useLocation } from "react-router-dom";
import MenuPage from "./components/MenuPage/MenuPage"
import ProductDetail from "./components/ProductDetail/ProductDetail"; 
import Catalogue from "./components/Catalogue/Catalogue";
import PhotoPage from "./components/PhotoPage/PhotoPage";
import RampsProductDetail from "./components/RampsProductDetail/RampsProductDetail";
import SkateparksProductDetail from "./components/SkateparksProductDetail/SkateparksProductDetail"
import DiyProductDetail from "./components/SetsProductDetail/SetsProductDetail";
import NewsPage from "./components/NewsPage/NewsPage";
import ProjectPage from "./components/ProjectPage/ProjectPage"
import './App.css'
import FAQPage from "./components/FAQPage/FAQPage"
import SetsProductDetail from "./components/SetsProductDetail/SetsProductDetail";
import About from "./components/About/About";


function App() {
 const location = useLocation();
 
  return (
    <>
      
    <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MenuPage />} />
        
        <Route  path="/catalogue" element={<Catalogue />} />
      {/* <Route path="/product/:category/:id" element={<ProductDetail />} /> */}
       <Route path="/product/sets/:id" element={<SetsProductDetail />} />
 <Route path="/product/ramps/:id" element={<RampsProductDetail />} /> 
 <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
 <Route path="/product/diy/:id" element={<DiyProductDetail />} />
        {/* <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
         <Route path="/product/diy/:id" element={<DiyProductDetail />} /> */}
  <Route path="/news" element={<NewsPage />} />
  <Route path="/FAQ" element={<FAQPage />} />

        <Route  path="/photopage" element={<PhotoPage />} />
        
        
         <Route path="projectpage" element={<ProjectPage/>}/>
            <Route path="about" element={<About/>}/>
      </Routes>
     
    </>
  )
}

export default App

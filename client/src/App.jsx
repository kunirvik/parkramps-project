
import { Routes, Route, useLocation } from "react-router-dom";
import MenuPage from "./components/MenuPage/MenuPage"
import ProductDetail from "./components/ProductDetail/ProductDetail"; 
import Catalogue from "./components/Catalogue/Catalogue";
import PhotoPage from "./components/PhotoPage/PhotoPage";
import RampsProductDetail from "./components/RampsProductDetail/RampsProductDetail";
import SkateparksProductDetail from "./components/SkateparksProductDetail/SkateparksProductDetail"
import DiyProductDetail from "./components/DiyProductDetail/DiyProductDetail";
// import NewsPage from "./components/NewsPage/NewsPage";
import './App.css'

function App() {
 const location = useLocation();
 
  return (
    <>
      
    <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MenuPage />} />
        
        <Route  path="/catalogue" element={<Catalogue />} />
      {/* <Route path="/product/:category/:id" element={<ProductDetail />} /> */}
       <Route path="/product/sets/:id" element={<ProductDetail />} />
 <Route path="/product/ramps/:id" element={<RampsProductDetail />} /> 
 <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
 <Route path="/product/diy/:id" element={<DiyProductDetail />} />
        {/* <Route path="/product/skateparks/:id" element={<SkateparksProductDetail />} />
         <Route path="/product/diy/:id" element={<DiyProductDetail />} /> */}
  {/* <Route path="/news" element={<NewsPage />} /> */}

        <Route  path="/photopage" element={<PhotoPage />} />
        
{/*         
         <Route path="projectpage" element={<ProjectPage/>}/> */}
      </Routes>
     
    </>
  )
}

export default App

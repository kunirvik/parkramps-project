const productCatalogRamps= [ {id: 1,
    name: "Ramp160",
    image: "/images/ramps/minir180h60w200d40alt.png",
    altImages: ["/images/ramps/minir180h60w200d40.png", "/images/ramps/minir180h60w200d40frontalt.png",  "/images/ramps/minir180h60w200d40top.png",  "/images/ramps/minir180h60w200d40front.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "Studio 65",
    year: 2023,
    description: "Комплексные решения для скейтпарков.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" },
      { title: "Установка", link: "#installation" }
    ],
    relatedProducts: [2, 3, 4] // IDs of related products
  },
  {
    id: 2,
    name: "Рампы",
    image: "/images/ramps/ramp95garagemain.png",
    altImages: ["/images/ramps/ramp95garagetop.png", "/images/ramps/ramp95garage.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "РампСтрой",
    year: 2024,
    description: "Профессиональные рампы различных размеров.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Размеры", link: "#dimensions" },
      { title: "Установка", link: "#installation" },
      { title: "Гарантия", link: "#warranty" }
    ],
    relatedProducts: [1, 3, 4] // IDs of related products
  },
  {
    id: 3,
    name: "Ramp2",
       image: "/images/ramps/rampr250h125w375d125.png",
    altImages: ["/images/ramps/rampr250h125w375d125top.png", "/images/ramps/rampr250h125w375d125front.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      { title: "Варианты комплектации", link: "#sets" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" }
    ],
    relatedProducts: [1, 2, 4] // IDs of related products
  },
  {
    id: 4,
    name: "Ramp3",
     image: "/images/ramps/rampskl.png",
    altImages: ["/images/ramps/rampsklfront.png", "/images/ramps/rampskltop.png"],
    
  
sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],


    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3] // IDs of related products
  }, 
]
export default productCatalogRamps
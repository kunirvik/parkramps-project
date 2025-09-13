const productCatalogRamps= [  
  {id: 1,
    name: "ramp60",
    image: "/images/ramps/minir180h60w200d40alt.png",
    altImages: ["/images/ramps/minir180h60w200d40.png", "/images/ramps/minir180h60w200d40frontalt.png",  "/images/ramps/minir180h60w200d40top.png",  "/images/ramps/minir180h60w200d40front.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "Studio 65",
    year: 2023,
    description: "Комплексные решения для скейтпарков.",
    description2: "Мини-рампа для скейтпарка высотой 60 см — отличное решение для детей, начинающих райдеров и тренировок в ограниченном пространстве. Благодаря небольшой высоте эта скейт-фигура безопасна и удобна для отработки первых трюков на скейтборде, BMX или трюковом самокате. Купить мини-рампу 60 см можно для двора, школьной площадки или даже крытой тренировочной зоны, чердака, гаража — компактный размер и прочная конструкция гарантируют долговечность и комфортное катание." ,  
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      // { title: "Материалы", link: "#materials" },
      // { title: "Технические характеристики", link: "#tech-specs" },
      // { title: "Доставка", link: "#delivery" },
      // { title: "Установка", link: "#installation" }
    ],
    relatedProducts: [2, 3, 4] // IDs of related products
  },
{
    id: 2,
    name: "ramp95",
    image: "/images/ramps/ramp95garagemain.png",
    altImages: ["/images/ramps/ramp95garagetop.png", "/images/ramps/ramp95garage.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "РампСтрой",
    year: 2024,
    description: "Профессиональные рампы различных размеров.",
    description2: "Мини-рампа для скейтпарка высотой 95 см и шириной 2.5 м — идеальное решение для начинающих райдеров и частных площадок. Компактная скейт-фигура отлично подойдет для скейтбордов, BMX и трюковых самокатов. Купить мини-рампу такого размера можно для дома или двора — она поможет освоить базовые трюки и сделает катание безопасным и увлекательным.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      // { title: "Материалы", link: "#materials" },
      // { title: "Размеры", link: "#dimensions" },
      // { title: "Установка", link: "#installation" },
      // { title: "Гарантия", link: "#warranty" }
    ],
    relatedProducts: [1, 3, 4] // IDs of related products
  }, 
  {
    id: 3,
    name: "ramp125",
       image: "/images/ramps/rampr250h125w375d125.png",
    altImages: ["/images/ramps/rampr250h125w375d125top.png", "/images/ramps/rampr250h125w375d125front.png"],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    description2: "Рампа для скейтпарка высотой 1.25 м и шириной 3.75 м — универсальный вариант для городских скейт-зон и спортивных площадок. Эта средняя рампа подойдет для катания на скейтборде, BMX и самокате. Купить рампу такого размера стоит тем, кто хочет развиваться и учиться выполнять более сложные трюки в удобных и безопасных условиях."  ,
     details: [
        { title: "Каталог фигур", link: "#catalog" },
      // { title: "Каталог фигур", link: "#catalog" },
      // { title: "Варианты комплектации", link: "#sets" },
      // { title: "Технические характеристики", link: "#tech-specs" },
      // { title: "Доставка", link: "#delivery" }
    ],
    relatedProducts: [1, 2, 4] // IDs of related products
  },
  {
    id: 4,
    name: "ramp125",
     image: "/images/ramps/rampskl.png",
    altImages: ["/images/ramps/rampsklfront.png", "/images/ramps/rampskltop.png"],
sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    description2: "Профессиональная рампа для скейтпарка высотой 1.25 м и шириной 5 м — это выбор экстремалов и спортивных клубов. Большая скейт-фигура идеально подойдет для соревнований и тренировок профессиональных райдеров. Купить рампу 2 м можно для открытых скейтпарков, чтобы привлечь опытных спортсменов и создать настоящую атмосферу экстрима.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      // { title: "Инструкции", link: "#instructions" },
      // { title: "Материалы", link: "#materials" },
      // { title: "Инструменты", link: "#tools" },
      // { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3] // IDs of related products
  }, 
   {
    id: 5,
    name: "ramp180",
     image: "/images/ramps/midiramp.webp",
    altImages: ["/images/ramps/midiramptop.webp", "/images/ramps/midirampfront.webp"],
sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "DIY Workshop",
    year: 2023,
    description: "комплекты для самостоятельного строительства элементов.",
    description2: "профессиональная рампа для скейтпарка высотой 1.25 м и шириной 5 м — это выбор экстремалов и спортивных клубов. Большая скейт-фигура идеально подойдет для соревнований и тренировок профессиональных райдеров. Купить рампу 2 м можно для открытых скейтпарков, чтобы привлечь опытных спортсменов и создать настоящую атмосферу экстрима.",
    details: [
      { title: "kаталог фигур", link: "#catalog" },
      // { title: "Инструкции", link: "#instructions" },
      // { title: "Материалы", link: "#materials" },
      // { title: "Инструменты", link: "#tools" },
      // { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3] // IDs of related products
  }, 
]
export default productCatalogRamps
const productCatalogDiys = [ {id: 1,
    name: "box1",
    image: "/images/sets/kicker.webp",
    altImages: ["/images/sets/box1.webp", ],
    sample: ["/images/sample/kicker1.jpg",  "/images/sample/kicker.jpg",],
    designer: "Studio 65",
    year: 2023,
      imageMobile: "/images/diy/kicker-small.png", // <--- маленькая версия
    description: "Комплексные решения для скейтпарков.",
    details: [
      { title: "Материалы", link: "#materials" },
     { title: "Каталог фигур", link: "#catalog" },
    ],
    relatedProducts: [2, 3, 4, 5] // IDs of related products
  },
  // {
  //   id: 2,
  //   name: "jerseybarrier",
  //  image: "/images/sets/jerseybarrier.png",
  //   altImages: ["/images/sets/jerseybarriertop.png", "/images/sets/jerseybarrierfront.png"],
  //    sample: ["/images/sample/kicker1.jpg", ],
  //   designer: "РампСтрой",
  //   year: 2024,
  //   description: "Профессиональные рампы различных размеров.",
  //   details: [
  //     { title: "Материалы", link: "#materials" },
  //      { title: "Каталог фигур", link: "#catalog" },
  //   ],
  //   relatedProducts: [1, 3, 4, 5] // IDs of related products
  // },
  {
    id: 3,
    name: "box3 kicker",
    image: "/images/sets/box.webp",
    altImages: ["/images/sets/kicker1.webp", "/images/sets/kicker2.webp"],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      { title: "Варианты комплектации", link: "#sets" },
      
    ],
    relatedProducts: [1, 2, 4, 5] // IDs of related products
  },  
  {
    id: 4,
    name: "manny",
     image: "/images/sets/manny.webp",
    altImages: ["/images/sets/manny2.webp"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
        { title: "Каталог фигур", link: "#catalog" },
      { title: "Материалы", link: "#materials" },
      
    ],
    relatedProducts: [1, 2, 3, 5] // IDs of related products
  }, 
  // {
  //   id: 5,
  //   name: "quater r215h80w125d40",
  //    image: "/images/sets/quaterr215h80w125d40.png",
  //   altImages: ["/images/sets/quaterr215h80w125d40left.png", "/images/sets/quaterr215h80w125d40top.png"],
  //   designer: "DIY Workshop",
  //   year: 2023,
  //   description: "Комплекты для самостоятельного строительства элементов.",
  //   details: [
  //       { title: "Каталог фигур", link: "#catalog" },
  //     { title: "Материалы", link: "#materials" },

  //   ],
  //   relatedProducts: [1, 2, 3, 4] // IDs of related products
  // },
// {
//     id: 6,
//     name: "quater r215h80w125d40",
//      image: "/images/sets/quaterr250h125w187d125.png",
//     altImages: ["/images/sets/quaterr250h125w187d125right.png", "/images/sets/quaterr250h125w187d125top.png"],
//     designer: "DIY Workshop",
//     year: 2023,
//     description: "Комплекты для самостоятельного строительства элементов.",
//     details: [
//         { title: "Каталог фигур", link: "#catalog" },
//       { title: "Материалы", link: "#materials" },
   
//     ],
//     relatedProducts: [1, 2, 3, 4] // IDs of related products
//   },

  // {
  //   id: 7,
  //   name: "quater r215h80w125d40",
  //    image: "/images/sets/quaterr250h160w375d125.png",
  //   altImages: ["/images/sets/quaterr250h160w375d125left.png", "/images/sets/quaterr250h160w375d125top.png"],
  //   designer: "DIY Workshop",
  //   year: 2023,
  //   description: "Комплекты для самостоятельного строительства элементов.",
  //   details: [
  //        { title: "Каталог фигур", link: "#catalog" },
  //     { title: "Материалы", link: "#materials" },
  
  //   ],
  //   relatedProducts: [1, 2, 3, 4] // IDs of related products
  // },
  //  {
  //   id: 8,
  //   name: "quater r215h80w125d40",
  //    image: "/images/sets/set.png",
  //   altImages: ["/images/sets/set2.png", "/images/sets/set3.png"],
  //   designer: "DIY Workshop",
  //   year: 2023,
  //   description: "Комплекты для самостоятельного строительства элементов.",
  //   details: [
  //        { title: "Каталог фигур", link: "#catalog" },
  //     { title: "Материалы", link: "#materials" },

  //   ],
  //   relatedProducts: [1, 2, 3, 4] // IDs of related products
  // },
]  ;
export default productCatalogDiys
const productCatalogDiys = [ {id: 1,
    name: "box1",
    image: "/images/sets/kicker2.png",
    altImages: ["/images/yolobox1.jpg", "/images/yolobox1.jpg", "/images/yolobox1.jpg", "/images/yolobox1.jpg", "/images/yolobox1.jpg","/images/yolobox1.jpg","/images/yolobox1.jpg","/images/yolobox1.jpg","/images/yolobox1.jpg","/images/yolobox1..jpg", "/images/yolobox1..jpg", "/images/yolobox1..jpg",  ],
    sample: ["/images/sample/kicker1.jpg", ],
    designer: "Studio 65",
    year: 2023,
    description: "Комплексные решения для скейтпарков.",
     description2: "Комплексные решения для скейтпарков.",
    details: [
      // { title: "Материалы", link: "#materials" },
     { title: "Каталог фигур", link: "#catalog" },
    ],
    relatedProducts: [2, 3, 4, 5] // IDs of related products
  },
  {
    id: 2,
    name: "jumpbox",
           image: "/images/sets/box360/yolobox1.webp",
        altImages: [ "/images/sets/box360/yolobox2.webp", "/images/sets/box360/yolobox3.webp", "/images/sets/box360/yolobox4.webp", 
          "/images/sets/box360/yolobox5.webp","/images/sets/box360/yolobox6.webp","/images/sets/box360/yolobox7.webp",
          "/images/sets/box360/yolobox8.webp","/images/sets/box360/yolobox9.webp","/images/sets/box360/yolobox10.webp",
           "/images/sets/box360/yolobox11.webp", "/images/sets/box360/yolobox12.webp", "/images/sets/box360/yolobox13.webp", "/images/sets/box360/yolobox14.webp",
          "/images/sets/box360/yolobox15.webp", "/images/sets/box360/yolobox16.webp", "/images/sets/box360/yolobox17.webp", "/images/sets/box360/yolobox18.webp", ],
    sample: ["/images/sample.pg",  "/images/sample.webp", "/images/sample.tob.webp"],
    designer: "РампСтрой",
    year: 2024,
    description: "Профессиональные рампы различных размеров.",
    details: [
      { title: "Материалы", link: "#materials" },
       { title: "Каталог фигур", link: "#catalog" },
    ],
    relatedProducts: [1, 3, 4, 5] // IDs of related products
  },
  {
    id: 3,
    name: "VertWall",
    image: "/images/sets/box.png",
    altImages: ["/images/sets/kicker1.png", "/images/sets/kicker2.png"],
    sample: ["/images/sample/vertwall3.jpg",  "/images/sample/vertwall1.JPG" ],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      // { title: "Варианты комплектации", link: "#sets" },
      
    ],
    relatedProducts: [1, 2, 4, 5] // IDs of related products
  },  
  {
    id: 4,
    name: "manny",
     image: "/images/sets/manny.png",
    altImages: ["/images/sets/manny2.png"],
    sample: ["/images/sample/grindbox2.jpg", "/images/sample/grindbox.jpg", ],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
        { title: "Каталог фигур", link: "#catalog" },
      // { title: "Материалы", link: "#materials" },
      
    ],
    relatedProducts: [1, 2, 3, 5] // IDs of related products
  }, 
  {
    id: 5,
    name: "quater r215h80w125d40",
     image: "/images/sets/quaterr215h80w125d40.png",
    altImages: ["/images/sets/quaterr215h80w125d40left.png", "/images/sets/quaterr215h80w125d40top.png"],
     sample: ["/images/sample/quater.JPG",  "/images/sample/box.JPG",],
    designer: "DIY Workshop",
    year: 2023,
    // description: "Комплекты для самостоятельного строительства элементов.",
      description2: "квотер - неотъемлемая часть любого парка, чаще всего устанавливается по обе стороны площадки и помогает сохранять инерцию на площадке. набирать скорость или гасить её. квотера могут быть любого размера и их можно использовать для  трюков, разного размера квотера можно совмещать друг с другом - усовершенствуя площадку и открывать новые опции для катания и выполнения трюков",
    details: [
        { title: "Каталог фигур", link: "#catalog" },
      // { title: "Материалы", link: "#materials" },

    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },
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
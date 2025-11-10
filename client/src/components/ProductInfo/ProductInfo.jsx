import { Accordion } from "../Accordion/Accordion";
import { ContactButton } from "../ContactButtons/ContactButton";

export function ProductInfo({
  product,
  accordionKey,
  onOpenGallery,
  infoRef,
  style
}) {
  return (
    <div ref={infoRef} className="w-full lg:w-[%] lg:h-[55%] flex flex-col justify mt-8 lg:mt-20" style={style}>
      <div className="lg:block">
        <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
          {product.name}
        </h1>
      </div>
      
      <p className="text-1xl font-futura text-[#717171] font-medium mb-3">
        {product.description3}
      </p>
      
      <Accordion
        key={accordionKey}
        items={[
          { title: "опис", content: product.description2 },
          { 
            title: "замовити скейтпарк", 
            content: (<>{product.description} <ContactButton/></>) 
          },
        ]}
        defaultOpenIndex={1}
        forceCloseTrigger={product.id}
      />

      {product.details?.map((detail, index) => {
        const isCatalog = detail.title.toLowerCase().includes("каталог");
        return (
          <button
            key={index}
            onClick={() => {
              if (isCatalog) {
                onOpenGallery();
              } else {
                window.location.href = detail.link;
              }
            }}
            className="w-full text-left flex cursor-pointer justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="font-futura text-[#717171] font-medium">
              {detail.title}
            </span>
            <span className="font-futura text-[#717171] text-lg">→</span>
          </button>
        );
      })}
    </div>
  );
}
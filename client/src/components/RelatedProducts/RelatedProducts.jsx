const RelatedProducts = ({ products, onProductClick, isAnimating }) => {
  return (
    <div className="w-full mt-16">
      <h2 className="text-2xl font-futura text-[#717171] font-bold mb-6 text-center">Рекомендуемые товары</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {products.map((product) => (
          <div 
            key={product.id}
            onClick={() => onProductClick(product.id)}
            className={`w-full max-w-xs cursor-pointer hover:scale-105 transition-transform duration-300 ${isAnimating ? 'pointer-events-none opacity-70' : ''}`}
          >
            <div className="rounded-lg p-4 flex flex-col items-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-30 object-contain mb-4"
                draggable="false" // Предотвращаем случайные перетаскивания
              />
              <h3 className="font-futura text-[#717171] font-medium text-center">{product.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
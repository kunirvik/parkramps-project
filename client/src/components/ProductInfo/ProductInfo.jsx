import ImageThumbnails from '../ImageThumbnails/ImageThumbnails';

const ProductInfo = ({
  product,
  isSlideChanging,
  animationComplete,
  selectedImageIndices,
  activeProductIndex,
  handleImageSelect,
  isAnimating,
  ANIMATION_DURATION,
  infoRef
}) => {
  return (
    <div 
      ref={infoRef}
      className="w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0"
      style={{ 
        opacity: (isSlideChanging || !animationComplete) ? 0 : 1,
        transform: (isSlideChanging || !animationComplete) ? 'translateY(20px)' : 'translateY(0)',
        transition: `opacity ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        visibility: (isSlideChanging || !animationComplete) ? 'hidden' : 'visible',
        position: 'relative'
      }}
    >
      {/* Product information */}
      <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">{product.name}</h1>
      <p className="font-futura text-[#717171] font-medium">{product.description}</p>
      <p className="font-futura text-[#717171] font-medium mt-2">Дизайн: {product.designer}, {product.year}</p>
      
      {/* Image thumbnails */}
      <ImageThumbnails 
        images={[product.image, ...product.altImages]}
        selectedIndex={selectedImageIndices[activeProductIndex]}
        onSelectImage={handleImageSelect}
        isAnimating={isAnimating}
      />

      {/* Product details */}
      {product.details.map((detail, index) => (
        <a
          key={index}
          href={detail.link}
          className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
        >
          <span className="font-futura text-[#717171] font-medium">{detail.title}</span>
          <span className="font-futura text-[#717171] text-lg">→</span>
        </a>
      ))}
    </div>
  );
};

export default ProductInfo;


const ImageThumbnails = ({ images, selectedIndex, onSelectImage, isAnimating }) => {
  return (
    <div className="mt-8 flex flex-wrap justify-start gap-4">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => onSelectImage(index)}
          className={`border rounded-lg p-1 transition hover:scale-105 ${
            selectedIndex === index ? "border-black" : "border-transparent"
          }`}
          disabled={isAnimating} // Отключаем кнопки во время анимации
        >
          <img
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className="w-16 h-16 object-contain rounded"
            draggable="false" // Предотвращаем случайные перетаскивания
          />
        </button>
      ))}
    </div>
  );
};

export default ImageThumbnails;
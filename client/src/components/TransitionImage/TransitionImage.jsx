const TransitionImage = ({ imageUrl, imageData, animationComplete, transitionImageRef }) => {
  if (animationComplete || !imageData) {
    return null;
  }

  return (
    <img
      ref={transitionImageRef}
      src={imageUrl}
      alt="Transition"
      className="object-contain"
      style={{ position: 'fixed', visibility: 'visible' }}
    />
  );
};

export default TransitionImage;
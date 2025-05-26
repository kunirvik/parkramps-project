import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";


export default function DetailPhotoSample({ activeKey, photos }) {
  const panelRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;

    if (activeKey) {
      tlRef.current = gsap.timeline().to(panelRef.current, {
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        display: "block",
      });
    } else {
      tlRef.current = gsap.timeline().to(panelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          if (panelRef.current) panelRef.current.style.display = "none";
        },
      });
    }
  }, [activeKey]);

  useEffect(() => {
    gsap.set(panelRef.current, { y: "100%", display: "none" });
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-300"
      style={{ height: "250px" }}
    >
      <div className="h-full overflow-x-auto whitespace-nowrap py-4 px-6 flex gap-4">
        {photos.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`photo-${idx}`}
            className="inline-block h-full rounded-md object-cover cursor-pointer"
            style={{ width: "auto", maxHeight: "220px" }}
          />
        ))}
      </div>
    </div>
  );
}
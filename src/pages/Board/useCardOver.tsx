import { useRef, useState } from "react";

export const useCardOver = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [slot, setSlot] = useState<null | number>(null);
  
    const handleCardOver = (e: DragEvent) => {
      if (!ref.current) return;
      const cardBounds = ref.current.getBoundingClientRect();
      const cardMidpoint = cardBounds.top + cardBounds.height / 2;
      setSlot(cardMidpoint);
    };
  
    return { handleCardOver, ref, slot };
  };
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  popUpSide: 'left' | 'right';
  children?: React.ReactNode;
  sameWidth?: true;
  setFalse: () => void;
};

const Popup = ({ popUpSide, children, sameWidth, setFalse }: Props) => {
  const [parentHeight, setParentHeight] = useState<number>();
  const [elementWidth, setElementWidth] = useState<number>();
  const ballonRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    setParentHeight(
      (ballonRef.current?.previousElementSibling as HTMLElement)?.offsetHeight
    );

    if (sameWidth) {
      setElementWidth(
        (ballonRef.current?.previousElementSibling as HTMLElement)?.offsetWidth
      );
    }

    setShowPopup(true);

    return () => {
      setParentHeight(0);
    };
  }, [sameWidth, parentHeight, elementWidth]);

  useEffect(() => {
    const clickOutEvent = (e: MouseEvent) => {
      let parentOfParent =
        (e.target as HTMLElement)?.parentElement ?? undefined;
      let isParent = false;

      while (!!parentOfParent && !isParent) {
        if (parentOfParent === ballonRef.current?.parentElement) {
          isParent = true;
        } else {
          parentOfParent = parentOfParent?.parentElement ?? undefined;
        }
      }
      if (!isParent) setFalse();
    };

    document.addEventListener('mousedown', clickOutEvent);

    return () => {
      document.removeEventListener('mousedown', clickOutEvent);
    };
  }, [ballonRef, setFalse]);

  return (
    <div
      ref={ballonRef}
      style={{
        ...(!showPopup && { display: 'none' }),
        top: `${parentHeight ? parentHeight + 10 : 8}px`,
        ...(sameWidth ? { width: elementWidth } : {}),
        ...(popUpSide === 'left' ? { left: '0px' } : { right: '0px' }),
      }}
      className="flex flex-col gap-2 min-w-fit p-2 absolute z-10 h-fit w-fit rounded-md border border-gray-300 shadow-lg bg-white"
    >
      {children}
    </div>
  );
};

export default Popup;

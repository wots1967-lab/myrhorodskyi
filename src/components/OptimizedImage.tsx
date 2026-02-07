import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  eager?: boolean;
}

const OptimizedImage = ({ src, alt, eager = false, className, ...props }: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;

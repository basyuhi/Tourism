// src/components/OptimizedImage.jsx
import { useState } from "react";

const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/zwru0zrjk";

const OptimizedImage = ({
    src,
    alt,
    className,
    width = 800,
    height = 600
}) => {
    const [hasError, setHasError] = useState(false);

    const fallbackUrl =
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

    if (hasError || !src) {
        return (
            <img
                src={fallbackUrl}
                alt={alt || "Image"}
                className={className}
            />
        );
    }

    let optimizedSrc = src;

    if (src.includes("ik.imagekit.io")) {
        const parts = src.split(".com/");

        if (parts.length > 1) {
            optimizedSrc = `${IMAGEKIT_ENDPOINT}/tr:w-${width},h-${height},f-webp,q-80/${parts[1]}`;
        }
    }

    return (
        <img
            src={optimizedSrc}
            alt={alt || "Image"}
            className={className}
            loading="lazy"
            onError={() => {
                console.warn("Image failed to load:", src);
                setHasError(true);
            }}
        />
    );
};

export default OptimizedImage;
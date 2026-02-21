import { getUrl } from "aws-amplify/storage";
import { useEffect, useRef, useState } from "react";
import useImage from "use-image";

type CanvasSize = {
    width: number;
    height: number;
};

export function useCanvasImage(
    imagePath: string,
    initialSize: CanvasSize = { width: 800, height: 1200 }
) {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [canvasSize, setCanvasSize] = useState<CanvasSize>(initialSize);
    const containerRef = useRef<HTMLDivElement>(null);

    const [image] = useImage(imageUrl, "anonymous");

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const { url } = await getUrl({
                    path: imagePath,
                    options: {
                        validateObjectExistence: true,
                    },
                });
                setImageUrl(url.toString());
            } catch (err) {
                console.error("Failed to get image URL:", err);
            }
        };
        fetchImageUrl();
    }, [imagePath]);

    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                setCanvasSize({ width, height });
            }
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    return { image, imageUrl, canvasSize, containerRef };
}

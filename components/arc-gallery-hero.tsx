"use client"

import type React from "react"
import { useEffect, useState } from "react"

type ArcGalleryHeroProps = {
    images: string[]
    startAngle?: number
    endAngle?: number
    radiusLg?: number
    radiusMd?: number
    radiusSm?: number
    cardSizeLg?: number
    cardSizeMd?: number
    cardSizeSm?: number
    className?: string
}

const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
    images,
    startAngle = -110,
    endAngle = 110,
    radiusLg = 340,
    radiusMd = 280,
    radiusSm = 200,
    cardSizeLg = 120,
    cardSizeMd = 100,
    cardSizeSm = 80,
    className = "",
}) => {
    const [dimensions, setDimensions] = useState({
        radius: radiusLg,
        cardSize: cardSizeLg,
    })

    // topOffset reserves space for a fixed header on small screens
    const [topOffset, setTopOffset] = useState(0)

    const [backgroundImage, setBackgroundImage] = useState<number | null>(null)
    const [autoSlideIndex, setAutoSlideIndex] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 640) {
                setDimensions({ radius: radiusSm, cardSize: cardSizeSm })
                setTopOffset(0) // allow header overlap
            } else if (width < 1024) {
                setDimensions({ radius: radiusMd, cardSize: cardSizeMd })
                setTopOffset(0) // allow header overlap
            } else {
                setDimensions({ radius: radiusLg, cardSize: cardSizeLg })
                setTopOffset(0) // allow header overlap
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm])

    // Auto slide functionality - changes every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setAutoSlideIndex((prev) => (prev + 1) % images.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [images.length])

    const handleImageClick = (index: number) => {
        setBackgroundImage((prev) => {
            // If clicking the same image that's already in background, remove it
            if (prev === index) {
                return null
            }
            // Otherwise, set this image as the new background
            return index
        })
    }

    const count = Math.max(images.length, 2)
    const step = (endAngle - startAngle) / (count - 1)

    // Determine which image to show in background
    const currentBackgroundImage = backgroundImage !== null ? backgroundImage : autoSlideIndex

    return (
        <section
            className={`relative overflow-hidden h-[88vh] flex flex-col ${className}`}
            // apply top padding to avoid header overlap on small screens
            style={{ paddingTop: `${topOffset}px` }}
        >
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full transition-all duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${images[currentBackgroundImage]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
                </div>

                {/* Image transition indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentBackgroundImage
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/50 hover:bg-white/80 hover:scale-110"
                                }`}
                            onClick={() => setBackgroundImage(index)}
                        />
                    ))}
                </div>
            </div>

            {/* 3D Arc Container */}
            <div
                className="relative mx-auto z-10"
                style={{
                    width: "100%",
                    height: dimensions.radius * 1.2,
                    perspective: "1000px",
                }}
            >
                {/* Center pivot with 3D transforms */}
                <div
                    className="absolute left-1/2 bottom-0 -translate-x-1/2"
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {images.map((src, i) => {
                        const angle = startAngle + step * i
                        const angleRad = (angle * Math.PI) / 180

                        const isBackground = backgroundImage === i
                        const isAutoSlide = backgroundImage === null && autoSlideIndex === i

                        const x = Math.cos(angleRad) * dimensions.radius
                        const y = Math.sin(angleRad) * dimensions.radius

                        // push images a bit down on small screens by adding topOffset/2 to bottom
                        const bottomValue = y + topOffset / 2

                        return (
                            <div
                                key={i}
                                className={`absolute cursor-pointer transition-all duration-700 ease-out ${isBackground || isAutoSlide
                                    ? "opacity-100 scale-90 ring-4 ring-yellow-400/50"
                                    : "opacity-80 hover:opacity-100 hover:scale-110"
                                    }`}
                                style={{
                                    width: dimensions.cardSize,
                                    height: dimensions.cardSize,
                                    left: `calc(50% + ${x}px)`,
                                    bottom: `${bottomValue}px`,
                                    transform: `translate(-50%, 50%) translateZ(${isBackground || isAutoSlide ? -50 : 20}px) rotateY(${angle * 0.3}deg)`,
                                    animationDelay: `${i * 100}ms`,
                                    animationFillMode: "forwards",
                                    zIndex: isBackground || isAutoSlide ? 1 : count - i + 10,
                                    transformStyle: "preserve-3d",
                                }}
                                onClick={() => handleImageClick(i)}
                            >
                                <div
                                    className={`rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/20 bg-card transition-all duration-500 w-full h-full backdrop-blur-sm ${isBackground || isAutoSlide
                                        ? "shadow-2xl ring-2 ring-yellow-400/70 animate-pulse"
                                        : "hover:shadow-2xl hover:ring-2 hover:ring-purple-400/50"
                                        }`}
                                    style={{
                                        transform: `rotate(${angle / 6}deg) rotateX(10deg)`,
                                        filter: isBackground || isAutoSlide ? "brightness(1.1) saturate(1.3) contrast(1.1)" : "none",
                                        boxShadow:
                                            isBackground || isAutoSlide
                                                ? "0 35px 60px -12px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.3)"
                                                : "0 30px 40px -10px rgba(0, 0, 0, 0.4), 0 15px 15px -5px rgba(0, 0, 0, 0.3)",
                                    }}
                                >
                                    <img
                                        src={src || "/placeholder.svg"}
                                        alt=""
                                        className="block w-full h-full object-cover transition-transform duration-500"
                                        draggable={false}
                                        style={{
                                            transform: `scale(${isBackground || isAutoSlide ? 0.95 : 1})`,
                                        }}
                                    />
                                    {/* Active indicator with glow */}
                                    {(isBackground || isAutoSlide) && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-purple-400/20" />
                                    )}
                                    {/* Hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-transparent to-pink-400/0 hover:from-purple-400/20 hover:to-pink-400/20 transition-all duration-300" />

                                    {/* Image title - only show for active image */}
                                    {(isBackground || isAutoSlide) && (
                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                                            <p className="text-white text-sm font-medium drop-shadow-lg bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm animate-fade-in">
                                                Image {i + 1}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Text Content without card - Direct on background */}
            <div
                className="relative z-20 flex items-center justify-center px-6"
                style={{ marginTop: `-${dimensions.radius * 0.6}px` }}
            >
                <div className="text-center max-w-2xl px-6 animate-softPulse">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-darkblue drop-shadow-2xl">
                        Empowering Lives Through <span className="text-lightblue">Support and Skills</span>
                    </h1>
                </div>
            </div>

<style jsx>{`
  @keyframes softPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }
  .animate-softPulse {
    animation: softPulse 3s ease-in-out infinite;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`}</style>
        </section>
    )
}

export default ArcGalleryHero

export default function Hero({ image }: { image: string }) {
  return (
    <div className="text-center max-w-4xl mx-auto px-6 pt-20 pb-16">
      <h1
        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-olive tracking-tight leading-tight mb-8 ${
          image ? "hidden" : ""
        }`}
      >
        Turn your <span className="text-terracotta">fridge</span> into delicious{" "}
        <span className="text-terracotta">meals</span>
      </h1>

      <p
        className={`text-sage text-lg md:text-xl ${
          image ? "hidden" : ""
        } max-w-2xl mx-auto`}
      >
        Upload a photo of your ingredients and let AI craft personalized
        recipes. Transform everyday ingredients into extraordinary dishes.
      </p>
    </div>
  );
}

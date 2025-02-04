export default function Hero() {
  return (
    <div className="text-center sm:mt-7">
      <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-7xl font-medium capitalize tracking-tight text-gray-700 md:mb-8">
        Turn your <span className="text-blue-500 ">fridge</span> into a{" "}
        <span className="text-blue-500 ">meal</span>
      </h1>
      <p className="text-gray-600 text-xs md:text-lg max-w-2xl mx-auto">
        Upload a photo of your ingredients and let AI suggest personalized
        recipes. No more wasted food, just delicious meals.
      </p>
    </div>
  );
}

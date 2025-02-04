import Header from "../components/Header";
import Hero from "../components/Hero";
import ImageUploadSection from "../components/ImageUploadSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen max-w-4xl flex flex-col justify-between items-center mx-auto bg-gradient-to-b">
      <Header />
      <div className="flex flex-col items-center justify-between gap-4 px-4 max-w-4xl text-center mb-[5rem] sm:mb-0">
        <Hero />
        <ImageUploadSection />
      </div>
      <Footer />
    </main>
  );
}

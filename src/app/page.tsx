import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Hero />
      {/* scroll runway so the hero parallax has somewhere to travel */}
      <section className="grid min-h-svh place-items-center">
        <p className="text-gold">next section</p>
      </section>
    </>
  );
}

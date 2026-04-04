import { supabase } from "@/lib/supabase";
import Hero from "@/components/home/hero";
import Features from "@/components/home/feature";
import ClassesSection from "@/components/home/class";
import Testimonials from "@/components/home/testimonial";
import StatsSection from "@/components/home/stats";
import CTASection from "@/components/home/ctasection";

export default async function Home() {
  const { data, error } = await supabase.auth.getSession();
  console.log("Supabase connected:", data);

  return (
    <>
      <Hero />
      <StatsSection />
      <Features />
      <ClassesSection />
      <Testimonials />
      <CTASection />
    </>
  );
}

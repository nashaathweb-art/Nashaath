    import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/home/watsapp";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <WhatsAppButton />

      <Footer />
    </>
  );
}
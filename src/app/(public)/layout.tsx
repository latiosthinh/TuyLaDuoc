import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getGlobalSpinCount } from "@/app/actions/spin";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSpinCount = await getGlobalSpinCount();

  return (
    <>
      <Header initialSpinCount={initialSpinCount} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 pt-4 pb-2 sm:px-6 lg:px-8 sm:pt-6 sm:pb-3 overflow-x-clip flex flex-col justify-around">
        {children}
      </main>
      <Footer />
    </>
  );
}

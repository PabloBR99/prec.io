import { Header } from "@/components/ui/Header";
import { GameContainer } from "@/components/game/GameContainer";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 pb-8 pt-4">
        <GameContainer />
      </main>
      <footer className="py-4 text-center text-xs text-foreground/30">
        PreciGame &mdash; Datos de productos via Open Food Facts
      </footer>
    </div>
  );
}

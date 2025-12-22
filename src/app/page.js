import AboutPopup from "@/components/AboutPopup/AboutPopup";
import XOGame from "@/components/XOGame/XOGame";
import { getOpenGraphMetadata } from "@/data/metadata";

export function generateMetadata() {
  return getOpenGraphMetadata();
}

export default function Home() {
  return (
    <main>
      <AboutPopup />
      <XOGame />
    </main>
  );
}

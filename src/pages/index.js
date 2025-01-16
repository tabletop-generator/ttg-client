import Layout from "../components/Layout";
import GradientOverlay from "../components/GradientTransitionLarge";
import PinterestGrid from "../components/PinterestGrid";

export default function Home() {
  return (
    <Layout>
      <p>Damn dood thats a sick library</p>
      <GradientOverlay breakpoint1={`50`} breakpoint2={`70`} />
      <PinterestGrid />
    </Layout>
  );
}

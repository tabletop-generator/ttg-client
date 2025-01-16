import Layout from "../components/Layout";
import GradientOverlay from "../components/GradientTransitionLarge";

export default function Home() {
  return (
    <Layout>
      <p>Holy balls I think it&apos;s working</p>
      <GradientOverlay breakpoint1={`50`} breakpoint2={`70`} />
    </Layout>
  );
}

import Header from "../components/Header";
import Card from "../components/Card";
import Slide from "../components/Slide";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <Header />

      {/* Menu */}
      <main className="pt-6">
        <Card />
      </main>

      {/* Slider */}
      <Slide />

    </div>
  );
};

export default Home;
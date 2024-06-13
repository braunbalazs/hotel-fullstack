import React from "react";
import MainHeader from "../layout/MainHeader";
import HotelServices from "../common/HotelServices";
import Parallax from "../common/Parallax";
import RoomCaroussel from "../common/RoomCaroussel";
import RoomSearch from "../common/RoomSearch";

const Home = () => {
  return (
    <section>
      <MainHeader />
      <div className="container">
        <RoomSearch />
        <RoomCaroussel />
        <Parallax />
        <RoomCaroussel />
        <HotelServices />
        <Parallax />
        <RoomCaroussel />
      </div>
    </section>
  );
};

export default Home;

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "./Header";
import {
  FaClock,
  FaCocktail,
  FaParking,
  FaSnowflake,
  FaTshirt,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import HotelService from "./HotelService";

const HotelServices = () => {
  return (
    <>
      <div className="mb-2">
        <Header title={"Our Services"} />

        <Row className="mt-4">
          <h4 className="text-center">
            Services at <span className="hotel-color"> lakeSide - </span>Hotel
            <span className="gap-2">
              <FaClock className="ml-5" /> 24-Hour Front Desk
            </span>
          </h4>
        </Row>
        <hr />

        <Row xs={1} md={2} lg={3} className="g-4 mt-2">
          <HotelService
            title="WiFi"
            text="Stay connected with high-speed internet access."
          >
            <FaWifi />
          </HotelService>
          <HotelService
            title="Breakfast"
            text="Start your day with a delicious breakfast buffet."
          >
            <FaUtensils />
          </HotelService>
          <HotelService
            title="Laundry"
            text="Keep your clothes clean and fresh with our laundry service."
          >
            <FaTshirt />
          </HotelService>
          <HotelService
            title="Mini-bar"
            text="Enjoy a refreshing drink or snack from our in-room mini-bar."
          >
            <FaCocktail />
          </HotelService>
          <HotelService
            title="Parking"
            text="Park your car conveniently in our on-site parking lot."
          >
            <FaParking />
          </HotelService>
          <HotelService
            title="Air conditioning"
            text="Stay cool and comfortable with our air conditioning system."
          >
            <FaSnowflake />
          </HotelService>
        </Row>
      </div>
      <hr />
    </>
  );
};

export default HotelServices;

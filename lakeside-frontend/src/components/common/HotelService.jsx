import React from "react";
import { Card, Col } from "react-bootstrap";

const HotelService = ({ title, text, children }) => {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="hotel-color">
            {children} {title}
          </Card.Title>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default HotelService;

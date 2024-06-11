import React from "react";
import { useState } from "react";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Form, FormControl } from "react-bootstrap";
import BookingSummary from "./BookingSummary";

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMesseage, setErrorMesseage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: "",
  });

  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
  });

  const { roomId } = useParams();
  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
    setErrorMesseage("");
  }

  async function getRoomPriceById(roomId) {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculatePayment = () => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, "days");
    const paymentPerDay = roomPrice ? roomPrice : 0;
    return diffInDays * paymentPerDay;
  };

  function isGuestCountValid() {
    const adultCount = parseInt(booking.numOfAdults);
    const childrenCount = parseInt(booking.numOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  }

  function isCheckOutDateValid() {
    if (
      !moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))
    ) {
      setErrorMesseage("Check-out date must come before check-in date");
      return false;
    } else {
      setErrorMesseage("");
      return true;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      !isGuestCountValid() ||
      !isCheckOutDateValid()
    ) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setIsValidated(true);
  }

  async function handleBooking() {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmationCode } });
    } catch (error) {
      setErrorMesseage(error.message);
      navigate("/booking-success", { state: { error: errorMesseage } });
    }
  }

  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-body mt-5">
              <h4 className="card card-title">Reserve Room</h4>
              <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="guestFullName">Full Name:</Form.Label>
                  <FormControl
                    required
                    type="text"
                    id="guestFullName"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your full name
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="guestEmail">Email:</Form.Label>
                  <FormControl
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your email address
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend>Lodging period</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="checkInDate">
                        Check-in Date:
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        placeholder="Check-in date"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select check-in date
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label htmlFor="checkOutDate">
                        Check-out Date:
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        placeholder="Check-out date"
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select check-out date
                      </Form.Control.Feedback>
                    </div>
                    {errorMesseage && (
                      <p className="error-message text-danger">
                        {errorMesseage}
                      </p>
                    )}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Number of Guests</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="numOfAdults">Adults:</Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfAdults"
                        name="numOfAdults"
                        value={booking.numOfAdults}
                        placeholder="0"
                        min={1}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select at least 1 adult
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label htmlFor="numOfChildren">Children:</Form.Label>
                      <FormControl
                        required
                        type="number"
                        id="numOfChildren"
                        name="numOfChildren"
                        value={booking.numOfChildren}
                        placeholder="0"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
                <div className="form-group mt-2 mb-2">
                  <button type="submit" className="btn btn-hotel">
                    Contunue
                  </button>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-md-6">
            {isSubmitted && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                isFormValid={isValidated}
                onConfirm={handleBooking}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;

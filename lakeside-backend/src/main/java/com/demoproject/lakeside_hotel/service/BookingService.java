package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.model.BookedRoom;

import java.util.List;

public interface BookingService {


    List<BookedRoom> getAllBookingsByRoomId(Long id);

    void cancelBooking(Long bookingId);

    String saveBooking(Long roomId, BookedRoom bookingRequest);

    BookedRoom findByBookingConfirmationCode(String confirmationCode);

    List<BookedRoom> getAllBookings();
}

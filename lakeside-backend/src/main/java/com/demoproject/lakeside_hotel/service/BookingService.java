package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.model.BookedRoom;

import java.util.List;

public interface BookingService {


    List<BookedRoom> getAllBookingsByRoomId(Long id);
}

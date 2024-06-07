package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.model.BookedRoom;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long id) {

        return null;
    }
}

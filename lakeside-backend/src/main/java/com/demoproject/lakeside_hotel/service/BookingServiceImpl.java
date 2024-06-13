package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.exception.InvalidBookingRequestException;
import com.demoproject.lakeside_hotel.exception.ResourceNotFoundException;
import com.demoproject.lakeside_hotel.model.BookedRoom;
import com.demoproject.lakeside_hotel.model.Room;
import com.demoproject.lakeside_hotel.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomService roomService;

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate()
                          .isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }
        Room room = roomService.getRoomById(roomId);
        List<BookedRoom> existingBookings = room.getBookings();
        boolean isRoomAvailable = isRoomAvailable(bookingRequest, existingBookings);
        if (isRoomAvailable) {
            room.addBooking(bookingRequest);
            bookingRepository.save(bookingRequest);
        } else {
            throw new InvalidBookingRequestException("This room is not available for the selected dates");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                                .orElseThrow(() -> new ResourceNotFoundException("No booking with confirmation code '%s' found".formatted(confirmationCode)));
    }

    private boolean isRoomAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                               .noneMatch(existingBooking ->
                                       bookingRequest.getCheckInDate()
                                                     .equals(existingBooking.getCheckInDate())
                                               || bookingRequest.getCheckOutDate()
                                                                .isBefore(existingBooking.getCheckOutDate())
                                               || (bookingRequest.getCheckInDate()
                                                                 .isAfter(existingBooking.getCheckInDate())
                                               && bookingRequest.getCheckInDate()
                                                                .isBefore(existingBooking.getCheckOutDate()))
                                               || (bookingRequest.getCheckInDate()
                                                                 .isBefore(existingBooking.getCheckInDate())

                                               && bookingRequest.getCheckOutDate()
                                                                .equals(existingBooking.getCheckOutDate()))
                                               || (bookingRequest.getCheckInDate()
                                                                 .isBefore(existingBooking.getCheckInDate())

                                               && bookingRequest.getCheckOutDate()
                                                                .isAfter(existingBooking.getCheckOutDate()))

                                               || (bookingRequest.getCheckInDate()
                                                                 .equals(existingBooking.getCheckOutDate())
                                               && bookingRequest.getCheckOutDate()
                                                                .equals(existingBooking.getCheckInDate()))

                                               || (bookingRequest.getCheckInDate()
                                                                 .equals(existingBooking.getCheckOutDate())
                                               && bookingRequest.getCheckOutDate()
                                                                .equals(bookingRequest.getCheckInDate()))
                               );
    }


}

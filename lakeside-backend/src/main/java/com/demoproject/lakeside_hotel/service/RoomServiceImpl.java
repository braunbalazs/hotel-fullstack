package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.exception.InternalServerException;
import com.demoproject.lakeside_hotel.exception.PhotoRetrievalException;
import com.demoproject.lakeside_hotel.exception.ResourceNotFoundException;
import com.demoproject.lakeside_hotel.model.BookedRoom;
import com.demoproject.lakeside_hotel.model.Room;
import com.demoproject.lakeside_hotel.repository.RoomRepository;
import com.demoproject.lakeside_hotel.response.BookingResponse;
import com.demoproject.lakeside_hotel.response.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
//    private final BookingService bookingService;

    @Override
    public RoomResponse addNewRoom(MultipartFile file, String roomType, BigDecimal roomPrice) throws SQLException, IOException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        if (!file.isEmpty()) {
            byte[] photoBytes = file.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }
        Room savedRoom = roomRepository.save(room);
        return new RoomResponse(savedRoom.getId(), savedRoom.getRoomType(), savedRoom.getRoomPrice());
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public List<RoomResponse> getAllRooms() throws SQLException {
        List<Room> rooms = roomRepository.findAll();
        return getRoomResponseList(rooms);
    }

    @Override
    public void deleteRoom(Long roomId) {
        roomRepository.findById(roomId)
                      .ifPresent(room -> roomRepository.deleteById(roomId));
    }

    @Override
    public RoomResponse updateRoom(Long roomId, String roomType, BigDecimal roomPrice, MultipartFile photo) throws IOException, SQLException {
        byte[] photoBytes = photo != null && !photo.isEmpty()
                ? photo.getBytes()
                : getRoomPhotoByRoomId(roomId); // todo could be null here
//        Blob photoBlob = photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
        Room room = roomRepository.findById(roomId)
                                  .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (roomType != null) room.setRoomType(roomType);
        if (roomPrice != null) room.setRoomPrice(roomPrice);
        if (photoBytes != null && photoBytes.length > 0) {
            try {
                room.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException e) {
                throw new InternalServerException("Error updating room");
            }
        }
        //todo @transactional instead of save
        return getRoomResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse getRoomResponseById(Long roomId) {
        Room room = getRoomById(roomId);
        return getRoomResponse(room);
    }

    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                             .orElseThrow(() -> new ResourceNotFoundException("Room with id: %d not found".formatted(roomId)));
    }

    @Override
    public List<RoomResponse> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) throws SQLException {
        List<Room> availableRooms = roomRepository.findAvailableRoomsByDatesAndType(checkInDate, checkOutDate, roomType);
        return getRoomResponseList(availableRooms);
    }

    private List<RoomResponse> getRoomResponseList(List<Room> rooms) throws SQLException {
        List<RoomResponse> roomResponses = new ArrayList<>();
        for (Room room : rooms) {
            byte[] photoBytes = getRoomPhotoByRoomId(room.getId()); // Todo
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.getEncoder()
                                           .encodeToString(photoBytes);
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setPhoto(base64Photo);
                roomResponses.add(roomResponse);
            }
        }
        return roomResponses;
    }

    private byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException {
        Room room = roomRepository.findById(roomId)
                                  .orElseThrow(() -> new ResourceNotFoundException("Room with id: %d not found".formatted(roomId)));
        Blob photoBlob = room.getPhoto();
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    private RoomResponse getRoomResponse(Room room) {
//        List<BookedRoom> bookings = bookingService.getAllBookingsByRoomId(room.getId());
//        List<BookingResponse> bookingInfo = bookings.stream()
//                                                    .map(booking -> new BookingResponse(
//                                                            booking.getId(),
//                                                            booking.getCheckInDate(),
//                                                            booking.getCheckOutDate(),
//                                                            booking.getBookingConfirmationCode()
//                                                    ))
//                                                    .toList();
        byte[] photoBytes = null;
        Blob photoBlob = room.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }
        return new RoomResponse(
                room.getId(),
                room.getRoomType(),
                room.getRoomPrice(),
                room.isBooked(),
                photoBytes
//                bookingInfo
        );
    }
}

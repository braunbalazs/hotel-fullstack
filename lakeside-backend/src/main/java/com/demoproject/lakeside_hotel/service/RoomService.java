package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.model.Room;
import com.demoproject.lakeside_hotel.response.RoomResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public interface RoomService {

    RoomResponse addNewRoom(MultipartFile file, String roomType, BigDecimal roomPrice) throws SQLException, IOException;

    List<String> getAllRoomTypes();

    List<RoomResponse> getAllRooms() throws SQLException;

    void deleteRoom(Long roomId);

    RoomResponse updateRoom(Long roomId, String roomType, BigDecimal roomPrice, MultipartFile photo) throws IOException, SQLException;

    RoomResponse getRoomResponseById(Long roomId);

    public Room getRoomById(Long roomId);

    List<RoomResponse> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) throws SQLException;
}

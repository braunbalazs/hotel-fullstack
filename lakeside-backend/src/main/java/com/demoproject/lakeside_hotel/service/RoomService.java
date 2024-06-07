package com.demoproject.lakeside_hotel.service;

import com.demoproject.lakeside_hotel.model.Room;
import com.demoproject.lakeside_hotel.response.RoomResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

public interface RoomService {

    RoomResponse addNewRoom(MultipartFile file, String roomType, BigDecimal roomPrice) throws SQLException, IOException;

    List<String> getAllRoomTypes();

    List<RoomResponse> getAllRooms() throws SQLException;

    void deleteRoom(Long roomId);
}

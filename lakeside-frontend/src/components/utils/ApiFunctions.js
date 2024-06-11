import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

// Add a new room to the db
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  const response = await api.post("/rooms/add/new-room", formData);
  return response.status === 201;
}

// Get all room types from the db
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching room types");
  }
}

// Get all rooms from the db
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms");
    return result.data;
  } catch (error) {
    throw new Error("Error fetching rooms");
  }
}

// Delete room by its id
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`);
  }
}

// Update room
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  const response = await api.put(`rooms/update/${roomId}`, formData);
  return response;
}

// Get room by its id
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`);
  }
}

// Save new booking to db
export async function bookRoom(roomId, booking) {
  const bookingToSend = {
    guestFullName: booking.guestFullName,
    guestEmail: booking.guestEmail,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    numOfAdults: parseInt(booking.numOfAdults),
    numOfChildren: parseInt(booking.numOfChildren),
  };
  console.log(bookingToSend);
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      bookingToSend
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}

// Get all bookings from db
export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings");
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
}

// Get booking by the confirmation code
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error finding booking: ${error.message}`);
    }
  }
}

// Cancel booking - delete in db
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`);
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking: ${error.message}`);
  }
}

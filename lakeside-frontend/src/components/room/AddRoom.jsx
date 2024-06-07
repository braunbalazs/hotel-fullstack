import React, { useState } from "react";
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";

const initialRoom = {
  photo: null,
  roomType: "",
  roomPrice: "",
};

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState(initialRoom);

  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleRoomInputChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "roomPrice") {
      if (!isNaN(value)) {
        value = parseInt(value);
      } else {
        value = "";
      }
    }
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const selectedImage = e.target.files[0];
    setNewRoom((prev) => ({ ...prev, photo: selectedImage }));
    setImagePreview(URL.createObjectURL(selectedImage));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const success = await addRoom(
        newRoom.photo,
        newRoom.roomType,
        newRoom.roomPrice
      );
      if (success !== undefined) {
        setSuccessMessage("A new room was added to the database");
        setNewRoom(initialRoom);
        setImagePreview("");
        setErrorMessage("");
      } else {
        setErrorMessage("Error adding room");
      }
    } catch (error) {
      setErrorMessage(error.errorMessage);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  }

  return (
    <>
      <section className="container, mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mt-5 mb-2">Add a New Room</h2>

            {successMessage && (
              <div className="alert alert-success fade show">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger fade show">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="roomType">
                  Room Type
                </label>
                <div>
                  <RoomTypeSelector
                    handleRoomInputChange={handleRoomInputChange}
                    newRoom={newRoom}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="roomPrice">
                  Room Price
                </label>
                <input
                  className="form-control"
                  type="number"
                  required
                  id="roomPrice"
                  name="roomPrice"
                  value={newRoom.roomPrice}
                  onChange={handleRoomInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Room Photo
                </label>
                <input
                  required
                  name="photo"
                  id="photo"
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  style={{ height: "auto", padding: 0 }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview  room photo"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mb-3"
                  ></img>
                )}
              </div>
              <div className="d-grid gap-2 d-md-flex mt-2">
                <button className="btn btn-outline-primary">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddRoom;

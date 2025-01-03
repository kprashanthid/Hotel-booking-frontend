"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/bookings");
      setBookings(response.data.bookings);
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const onSubmitBooking = async (data) => {
    try {
      const bookingData = { ...data, time: selectedSlot };
      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingData
      );
      if (response.status === 201) {
        setBookingSuccess(true);
        setAvailableSlots([]);
        setSelectedSlot(null);
        fetchBookings();
        toast.success("Booking Confirmed!");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Error confirming booking!");
    }
  };
  const deleteBooking = async (id) => {
    try {
      const response = await axios.post("http://localhost:8080/api/bookings", {
        _id: id,
        action: "delete",
      });
      if (response.status === 200) {
        fetchBookings();
        toast.error("Booking Deleted!");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Error deleting booking!");
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckAvailability = async (data) => {
    setIsAvailabilityChecked(true);
    await fetchBookings();
    toast.info("Checked availability!");
  };

  return (
    <div className="max-w-md mx-auto w-4/5 my-8 p-6 border border-gray-300 rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-semibold mb-6">Book a Table</h2>
      <form
        onSubmit={handleSubmit(handleCheckAvailability)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name?.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium">
            Contact Number
          </label>
          <input
            id="contact"
            type="text"
            {...register("contact", { required: "Contact is required" })}
            className={`w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact ? "border-red-500" : ""
            }`}
          />
          {errors.contact && (
            <p className="text-sm text-red-500">{errors.contact?.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register("date", { required: "Date is required" })}
            className={`w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date ? "border-red-500" : ""
            }`}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date?.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Guests
          </label>
          <input
            id="guests"
            type="number"
            {...register("guests", {
              required: "Number of guests is required",
            })}
            className={`w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.guests ? "border-red-500" : ""
            }`}
          />
          {errors.guests && (
            <p className="text-sm text-red-500">{errors.guests?.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-4 text-white bg-blue-500 font-semibold rounded-md hover:bg-blue-600"
        >
          Check Availability
        </button>
      </form>

      {isAvailabilityChecked && availableSlots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Available Slots:</h3>
          <div className="grid grid-cols-3 gap-5">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                className="w-full active:bg-blue-500 active:text-white p-3 bg-white border border-gray-100 shadow-md rounded-md"
                onClick={() => {
                  setSelectedSlot(slot);
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <form onSubmit={handleSubmit(onSubmitBooking)}>
          <button
            type="submit"
            className="w-full p-3 mt-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Confirm Booking
          </button>
        </form>
      )}

      {bookings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Current Bookings</h3>
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking._id}
                className="flex justify-between items-center bg-white border shadow-md py-2 px-3 rounded-md"
              >
                <span className="font-medium">
                  {booking.name} slot - {booking.time}
                </span>
                <button
                  onClick={() => deleteBooking(booking._id)}
                  className="bg-red-500 text-white p-2 rounded-md shadow-md border font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingForm;

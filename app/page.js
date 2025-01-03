import Image from "next/image";
import BookingForm from "./booking/page";

export default function Home() {
  return (
    <div className="bg-white flex items-center min-h-screen">
      <BookingForm />
    </div>
  );
}

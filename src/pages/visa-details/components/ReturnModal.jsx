import ReturnCalender from "./ReturnCalendar";

const Modal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl mb-4">Select Return Date</h2>
        <ReturnCalender />
        <button
          onClick={proceedFunc}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          Proceed to Application
        </button>
      </div>
    </div>
  );
};

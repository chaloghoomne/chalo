import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <img 
                src="/images/404.png" 
                alt="404 Not Found" 
                className="w-64 md:w-80 lg:w-96 mb-6"
            />
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg text-gray-400 mt-2 mb-4">
                The page you are looking for does not exist.
            </p>
            <Link 
                to="/" 
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;

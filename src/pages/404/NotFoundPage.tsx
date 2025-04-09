import { useNavigate } from "react-router-dom";
import { Facebook, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
	const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center space-y-6">
        {/* Facebook logo */}
        <div className="flex justify-center animate-bounce">
          <Facebook className="h-16 w-16 text-[#1877F2]" />
        </div>

        {/* Error message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-800">This Page Isn't Available</h1>

          <p className="text-gray-600">
            The link may be broken, or the page may have been removed. Check to see if the link you're trying to open is
            correct.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to News Feed
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Phone } from "lucide-react";

interface IncomingCallControlsProps {
  handleEndCall: () => void;
  acceptCall: () => void;
}

export function IncomingCallControls({
  handleEndCall,
  acceptCall,
}: IncomingCallControlsProps) {
  return (
    <div className="p-6 flex items-center justify-center space-x-6 bg-gray-900">
      <button
        onClick={handleEndCall}
        className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
      >
        <Phone className="h-6 w-6 transform rotate-135" />
      </button>

      <button
        onClick={acceptCall}
        className="p-4 rounded-full bg-green-600 text-white hover:bg-green-700"
      >
        <Phone className="h-6 w-6" />
      </button>
    </div>
  );
}

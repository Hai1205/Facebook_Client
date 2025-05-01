import { Gift } from "lucide-react";
import { USER } from "@/utils/interface";

interface Birthday {
  birthdays: USER[];
}

export const BirthdaySection = ({ birthdays }: Birthday) => (
  <>
    <h3 className="text-gray-400 font-semibold text-sm mb-3">Birthdays</h3>

    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-800 rounded-full p-2">
          <Gift className="h-5 w-5 text-blue-400" />
        </div>

        <p className="text-sm">
          <span className="font-medium">{birthdays[0].fullName}</span>

          {birthdays.length > 1 && (
            <span className="font-medium">
              {` and ${birthdays.length - 1} other${
                birthdays.length - 2 > 0 ? "s" : ""
              }`}
            </span>
          )}

          {birthdays.length > 0 && <span> have birthdays today.</span>}
        </p>
      </div>
    </div>
  </>
);

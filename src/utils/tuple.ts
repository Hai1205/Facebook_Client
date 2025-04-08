export interface TupleChoice {
    value: string;
    label: string;
}

export const COUNTRY_CHOICE: TupleChoice[] = [
    { value: "vietnam", label: "Vietnam" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "japan", label: "Japan" },
    { value: "china", label: "China" },
    { value: "south_korea", label: "South Korea" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
    { value: "italy", label: "Italy" },
    { value: "spain", label: "Spain" },
    { value: "russia", label: "Russia" },
    { value: "brazil", label: "Brazil" },
    { value: "india", label: "India" },
    { value: "mexico", label: "Mexico" },
    { value: "netherlands", label: "Netherlands" },
    { value: "switzerland", label: "Switzerland" },
    { value: "sweden", label: "Sweden" },
    { value: "singapore", label: "Singapore" },
    { value: "uae", label: "United Arab Emirates" },
    { value: "saudi_arabia", label: "Saudi Arabia" },
    { value: "south_africa", label: "South Africa" },
];

export const STATUS_CHOICE: TupleChoice[] = [
    { value: "active", label: "Active" },
    { value: "lock", label: "Lock" },
    { value: "pending", label: "Pending" },
];

export const REJECTION_REASON_CHOICE: TupleChoice[] = [
    { value: "Insufficient content", label: "Insufficient content" },
    { value: "Quality issues", label: "Quality issues" },
    { value: "Incomplete profile", label: "Incomplete profile" },
    { value: "Copyright concerns", label: "Copyright concerns" },
    { value: "Not a good fit", label: "Not a good fit" },
    { value: "Other (please specify)", label: "Other (please specify)" },
];


export interface CHOICE {
    value: string;
    label: string;
}

export const ROLE_CHOICE: CHOICE[] = [
    { value: "CELEBRITY", label: "Celebrity" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
];

export const MEDIA_TYPE_CHOICE: CHOICE[] = [
    { value: "IMAGE", label: "Image" },
    { value: "VIDEO", label: "Video" },
];

export const GENDER_CHOICE: CHOICE[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export const TAB_LIST_CHOICE: CHOICE[] = [
    { value: 'posts', label: 'Posts' },
    { value: 'about', label: 'About' },
    { value: 'friends', label: 'Friends' },
    { value: 'photos', label: 'Photos' },
];

export const COUNTRY_CHOICE: CHOICE[] = [
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

export const STATUS_CHOICE: CHOICE[] = [
    { value: "active", label: "Active" },
    { value: "lock", label: "Lock" },
    { value: "pending", label: "Pending" },
];

// export const REJECTION_REASON_CHOICE: CHOICE[] = [
//     { value: "Insufficient content", label: "Insufficient content" },
//     { value: "Quality issues", label: "Quality issues" },
//     { value: "Incomplete profile", label: "Incomplete profile" },
//     { value: "Copyright concerns", label: "Copyright concerns" },
//     { value: "Not a good fit", label: "Not a good fit" },
//     { value: "Other (please specify)", label: "Other (please specify)" },
// ];


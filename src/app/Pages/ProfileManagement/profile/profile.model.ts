export interface Profile {
    id: string;          // Assuming ID is a string. Change to number if necessary
    name: string;
    description?: string;  // Optional property
    contact: string;
    address: string;
    city: string;
    country: string;
    region: string;
    postalCode: string;
  }
  
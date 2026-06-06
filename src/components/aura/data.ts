export type GroceryRow = {
  id: number;
  itemId?: number; // Optional as sample data doesn't have it
  item: string;
  price: string;
  range: string;
  district?: string;
  locality: string;
  trust: number;
  status: "Verified" | "Pending" | "APPROVED" | "FLAGGED";
};

export const sampleData: GroceryRow[] = [
  { id: 1, item: "Rice", price: "₹85/kg", range: "₹80 - ₹90/kg", locality: "Dibrugarh Market", trust: 92, status: "Verified" },
  { id: 2, item: "Tea", price: "₹120/kg", range: "₹110 - ₹130/kg", locality: "Jorhat Market", trust: 88, status: "Verified" },
  { id: 3, item: "Sugar", price: "₹55/kg", range: "₹50 - ₹60/kg", locality: "Fancy Bazar", trust: 81, status: "Pending" },
  { id: 4, item: "Dal (Masoor)", price: "₹110/kg", range: "₹100 - ₹120/kg", locality: "Dibrugarh Market", trust: 90, status: "Verified" },
  { id: 5, item: "Mustard Oil", price: "₹130/ltr", range: "₹120 - ₹140/ltr", locality: "Tinsukia Market", trust: 87, status: "Pending" },
  { id: 6, item: "Salt", price: "₹20/kg", range: "₹18 - ₹22/kg", locality: "Jorhat Market", trust: 75, status: "Verified" },
  { id: 7, item: "Wheat Flour", price: "₹45/kg", range: "₹42 - ₹48/kg", locality: "Guwahati Market", trust: 84, status: "Verified" },
  { id: 8, item: "Onion", price: "₹35/kg", range: "₹30 - ₹40/kg", locality: "Fancy Bazar", trust: 78, status: "Pending" },
];

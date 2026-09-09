import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Briefcase,
  Heart,
  Gift,
  Plane,
  Gamepad2,
  Book,
} from "lucide-react";

export const ICON_OPTIONS = [
  { name: "shopping-cart", Icon: ShoppingCart },
  { name: "utensils", Icon: Utensils },
  { name: "car", Icon: Car },
  { name: "home", Icon: Home },
  { name: "briefcase", Icon: Briefcase },
  { name: "heart", Icon: Heart },
  { name: "gift", Icon: Gift },
  { name: "plane", Icon: Plane },
  { name: "gamepad", Icon: Gamepad2 },
  { name: "book", Icon: Book },
];

export const getIconComponent = (iconName) => {
  const found = ICON_OPTIONS.find((opt) => opt.name === iconName);
  return found ? found.Icon : null;
};
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Detect in-app browsers (Instagram, Telegram, Facebook, etc.)
const isInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|Telegram|TelegramBot|Line|Snapchat|Twitter|MicroMessenger/i.test(ua);
};

if (isInAppBrowser()) {
  document.body.classList.add('in-app-browser');
}

createRoot(document.getElementById("root")!).render(<App />);

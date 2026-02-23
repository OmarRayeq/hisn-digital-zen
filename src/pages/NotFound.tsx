import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--gradient-hero)" }} dir="rtl">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gold">٤٠٤</h1>
        <p className="mb-4 text-xl text-cream-dim font-arabic">الصفحة غير موجودة</p>
        <a href="/" className="text-gold underline hover:text-gold-bright font-arabic">
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;

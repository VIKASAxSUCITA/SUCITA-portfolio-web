"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div id="preloader">
      <div className="preloader-wrap">
        <Image
          src="/images/sucita_logo.png"
          alt="Sucita & Partners"
          width={200}
          height={60}
          className="img-fluid"
          priority
        />
        <div className="preloader">
          <i>.</i>
          <i>.</i>
          <i>.</i>
        </div>
      </div>
    </div>
  );
}

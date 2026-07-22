import Image from "next/image";

export default function Preloader() {
  return (
    <div id="preloader">
      <div className="preloader-wrap">
        <Image
          src="/images/sucita_logo.png"
          alt="Sucita & Partners"
          width={200}
          height={60}
          className="img-fluid"
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

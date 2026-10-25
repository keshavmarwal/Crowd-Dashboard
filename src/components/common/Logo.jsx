import logo from '../../assets/logo.svg';

export default function Logo({ className = '', compact = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logo}
        alt="Kloudspot"
        className="h-[38px] w-auto shrink-0 brightness-0 invert"
      />

      {!compact && (
        <span className="text-[26px] text-white font-semibold tracking-tight">
          kloudspot
        </span>
      )}
    </div>
  );
}


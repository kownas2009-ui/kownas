import { CSSProperties } from "react";

interface MoleculeDecorationProps {
  className?: string;
  style?: CSSProperties;
}

const MoleculeDecoration = ({ className = "", style }: MoleculeDecorationProps) => {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central atom */}
      <circle cx="100" cy="100" r="16" className="fill-primary/20" />
      <circle cx="100" cy="100" r="10" className="fill-primary/40" />
      
      {/* Bonds */}
      <line x1="100" y1="100" x2="50" y2="50" className="stroke-primary/30" strokeWidth="3" />
      <line x1="100" y1="100" x2="150" y2="50" className="stroke-primary/30" strokeWidth="3" />
      <line x1="100" y1="100" x2="50" y2="150" className="stroke-primary/30" strokeWidth="3" />
      <line x1="100" y1="100" x2="150" y2="150" className="stroke-primary/30" strokeWidth="3" />
      <line x1="100" y1="100" x2="100" y2="30" className="stroke-primary/30" strokeWidth="3" />
      
      {/* Outer atoms */}
      <circle cx="50" cy="50" r="12" className="fill-secondary/30" />
      <circle cx="50" cy="50" r="7" className="fill-secondary/50" />
      
      <circle cx="150" cy="50" r="10" className="fill-primary/25" />
      <circle cx="150" cy="50" r="6" className="fill-primary/45" />
      
      <circle cx="50" cy="150" r="10" className="fill-primary/25" />
      <circle cx="50" cy="150" r="6" className="fill-primary/45" />
      
      <circle cx="150" cy="150" r="12" className="fill-secondary/30" />
      <circle cx="150" cy="150" r="7" className="fill-secondary/50" />
      
      <circle cx="100" cy="30" r="8" className="fill-secondary/35" />
      <circle cx="100" cy="30" r="5" className="fill-secondary/55" />
    </svg>
  );
};

export default MoleculeDecoration;

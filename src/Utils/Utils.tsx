import pdf from "../assets/pdf.svg";
import text from "../assets/text.svg";
import design from "../assets/design.svg";
import developer from "../assets/developer.svg";
import math from "../assets/math.svg";

const createIcon = (src: string, alt: string) => (
  <img src={src} alt={alt} width={40} height={40} />
);

export const PdfIcon = createIcon(pdf, "PDF Icon");
export const TextIcon = createIcon(text, "Text Icon");
export const DesignIcon = createIcon(design, "Design Icon");
export const DeveloperIcon = createIcon(developer, "Developer Icon");
export const MathIcon = createIcon(math, "Math Icon");

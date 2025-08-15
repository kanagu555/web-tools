import React from "react";
import {
  PictureAsPdf,
  TextFields,
  Palette,
  Code,
  Calculate,
  AccountBalance,
  LocalHospital,
  Schedule,
} from "@mui/icons-material";

// Custom PDF Icon Component using your SVG
const CustomPdfIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 309.267 309.267"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      fill: sx?.color || "currentColor",
      ...sx,
    }}
    {...props}
  >
    <g>
      <path
        style={{ fill: "#E2574C" }}
        d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658
		c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z"
      />
      <path
        style={{ fill: "#B53629" }}
        d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z"
      />
      <path
        style={{ fill: "#FFFFFF" }}
        d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
		c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
		c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z
		 M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
		c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413
		c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964
		c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
		c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703
		c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z"
      />
    </g>
  </svg>
);

// Custom Text Icon Component
const CustomTextIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <path
      style={{ fill: "#167EE6" }}
      d="M439.652,512H72.348c-9.217,0-16.696-7.479-16.696-16.696V16.696C55.652,7.479,63.131,0,72.348,0
	h233.739c4.424,0,8.674,1.761,11.804,4.892l133.565,133.565c3.131,3.13,4.892,7.379,4.892,11.804v345.043
	C456.348,504.521,448.869,512,439.652,512z"
    />
    <path
      style={{ fill: "#2860CC" }}
      d="M317.891,4.892C314.761,1.761,310.511,0,306.087,0H256v512h183.652
	c9.217,0,16.696-7.479,16.696-16.696V150.261c0-4.424-1.761-8.674-4.892-11.804L317.891,4.892z"
    />
    <path
      style={{ fill: "#167EE6" }}
      d="M451.459,138.459L317.891,4.892C314.76,1.76,310.511,0,306.082,0h-16.691l0.001,150.261
	c0,9.22,7.475,16.696,16.696,16.696h150.26v-16.696C456.348,145.834,454.589,141.589,451.459,138.459z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M272.696,411.826H139.13c-9.217,0-16.696-7.479-16.696-16.696c0-9.217,7.479-16.696,16.696-16.696
	h133.565c9.217,0,16.696,7.479,16.696,16.696C289.391,404.348,281.913,411.826,272.696,411.826z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M372.87,345.043H139.13c-9.217,0-16.696-7.479-16.696-16.696c0-9.217,7.479-16.696,16.696-16.696
	H372.87c9.217,0,16.696,7.479,16.696,16.696C389.565,337.565,382.087,345.043,372.87,345.043z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M372.87,278.261H139.13c-9.217,0-16.696-7.479-16.696-16.696c0-9.217,7.479-16.696,16.696-16.696
	H372.87c9.217,0,16.696,7.479,16.696,16.696C389.565,270.782,382.087,278.261,372.87,278.261z"
    />
  </svg>
);

// Custom Design Icon Component
const CustomDesignIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <path
      fill="#E5AA6E"
      d="M256.295 9.217C120.001 9.217 9.512 119.706 9.512 256c0 43.532 11.693 84.2 31.055 119.939c24.744 45.676 120.236-129.338 171.165-91.196S90.776 447.079 138.533 472.527c35.252 18.784 75.036 30.256 117.762 30.256c136.294 0 246.783-110.488 246.783-246.783S392.59 9.217 256.295 9.217z"
    ></path>
    <path
      fill="#FFF"
      d="M274.829 451.585c-24.167 0-43.758-17.564-43.758-39.23s19.591-39.23 43.758-39.23s43.758 17.564 43.758 39.23s-19.591 39.23-43.758 39.23z"
    ></path>
    <path
      fill="#FFD469"
      d="M435.954 299.272c12.708 19.521 5.991 46.425-15.003 60.092c-20.994 13.667-48.315 8.922-61.023-10.599c-12.708-19.521-5.991-46.425 15.004-60.092c20.993-13.668 48.314-8.922 61.022 10.599z"
    ></path>
    <path
      fill="#0074A8"
      d="M443.193 159.103c1.598 23.238-17.366 43.469-42.358 45.188c-24.992 1.719-46.547-15.726-48.145-38.964s17.366-43.469 42.358-45.188s46.547 15.726 48.145 38.964z"
    ></path>
    <path
      fill="#FF473E"
      d="M287.822 100.348c1.598 23.238-21.619 43.762-51.857 45.841s-56.046-15.073-57.644-38.311c-1.598-23.238 21.619-43.762 51.857-45.841s56.046 15.073 57.644 38.311z"
    ></path>
    <path
      fill="#009B51"
      d="M155.826 201.296c1.598 23.238-17.366 43.469-42.358 45.188c-24.992 1.719-46.547-15.726-48.145-38.964s17.366-43.469 42.358-45.188c24.992-1.719 46.547 15.726 48.145 38.964z"
    ></path>
  </svg>
);

// Custom Developer Icon Component
const CustomDeveloperIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <circle style={{ fill: "#F33052" }} cx="256" cy="256" r="256" />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M213.12,319.776L99.872,270.544V243.28l113.248-49.008v32.112l-79.008,30.208l79.008,31.328V319.776z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M223.6,341.408l40.912-170.832h23.776l-41.36,170.832H223.6z"
    />
    <path
      style={{ fill: "#FFFFFF" }}
      d="M298.768,319.904V288l79.104-31.104l-79.104-30.752V194.48l113.36,49.008v27.04L298.768,319.904z"
    />
  </svg>
);

// Custom Math Icon Component
const CustomMathIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 508 508"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <path
      style={{ fill: "#73BADD" }}
      d="M254,250h248V58c0-29.6-24.4-52-54-52c0,0-194-1.6-194-1.2V250z"
    />
    <path
      style={{ fill: "#E36D60" }}
      d="M258,250V4.8c0-0.4,0,1.2,0,1.2H64C34.4,6,10,28.4,10,58v190.4c0-0.4,0.8,1.6,1.2,1.6H258z"
    />
    <path
      style={{ fill: "#61C2AB" }}
      d="M11.2,254c-0.4,0-1.2-2.4-1.2-2.4V446c0,29.6,24,56,54,56h194V254H11.2z"
    />
    <path
      style={{ fill: "#FFC52F" }}
      d="M258,502h190c29.6,0,54-26.4,54-56V250H258V502z"
    />
    <path
      d="M448,508H60c-33.2,0-60-26.8-60-60V60C0,26.8,26.8,0,60,0h388c33.2,0,60,26.8,60,60v388C508,481.2,481.2,508,448,508z M60,8
	C31.2,8,8,31.2,8,60v388c0,28.8,23.2,52,52,52h388c28.8,0,52-23.2,52-52V60c0-28.8-23.2-52-52-52H60z"
    />
    <path d="M254,256H6c-2.4,0-4-1.6-4-4s1.6-4,4-4h248c2.4,0,4,1.6,4,4S256.4,256,254,256z" />
    <path d="M502,256H294c-2.4,0-4-1.6-4-4s1.6-4,4-4h208c2.4,0,4,1.6,4,4S504.4,256,502,256z" />
    <path d="M256,506c-2.4,0-4-1.6-4-4V42c0-2.4,1.6-4,4-4s4,1.6,4,4v460C260,504.4,258.4,506,256,506z" />
    <path d="M210,136H66c-2.4,0-4-1.6-4-4s1.6-4,4-4h144c2.4,0,4,1.6,4,4S212.4,136,210,136z" />
    <path d="M462,136H318c-2.4,0-4-1.6-4-4s1.6-4,4-4h144c2.4,0,4,1.6,4,4S464.4,136,462,136z" />
    <path d="M462,380H318c-2.4,0-4-1.6-4-4s1.6-4,4-4h144c2.4,0,4,1.6,4,4S464.4,380,462,380z" />
    <path d="M136,206c-2.4,0-4-1.6-4-4V58c0-2.4,1.6-4,4-4s4,1.6,4,4v144C140,204.4,138.4,206,136,206z" />
    <path
      d="M72.4,442c-1.2,0-2-0.4-2.8-1.2c-1.6-1.6-1.6-4,0-5.6l127.6-127.6c1.6-1.6,4-1.6,5.6,0s1.6,4,0,5.6L75.2,440.8
	C74.4,441.6,73.6,442,72.4,442z"
    />
    <path
      d="M200.4,442c-1.2,0-2-0.4-2.8-1.2l-128-128c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0l128,128c1.6,1.6,1.6,4,0,5.6
	C202.4,441.6,201.2,442,200.4,442z"
    />
    <path
      d="M392.4,338c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S401.2,338,392.4,338z M392.4,314c-4.4,0-8,3.6-8,8s3.6,8,8,8
	s8-3.6,8-8S396.8,314,392.4,314z"
    />
    <path
      d="M392.4,442c-8.8,0-16-7.2-16-16s7.2-16,16-16s16,7.2,16,16S401.2,442,392.4,442z M392.4,418c-4.4,0-8,3.6-8,8s3.6,8,8,8
	s8-3.6,8-8S396.8,418,392.4,418z"
    />
  </svg>
);

// Custom Finance Icon Component
const CustomFinanceIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 494.4 494.4"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <circle style={{ fill: "#EFB30C" }} cx="247.2" cy="240" r="224.8" />
    <path
      style={{ fill: "#F9E310" }}
      d="M322.4,203.2h-13.6c-0.8-15.2-6.4-29.6-16-40.8h29.6c6.4,0,11.2-4.8,11.2-11.2s-4.8-11.2-11.2-11.2
	h-80h-45.6H172c-6.4,0-11.2,4.8-11.2,11.2s4.8,11.2,11.2,11.2h24.8h45.6c23.2,0,41.6,18.4,43.2,40.8H172c-6.4,0-11.2,4.8-11.2,11.2
	s4.8,11.2,11.2,11.2h113.6c-3.2,20.8-20.8,36-42.4,36h-45.6c-4,0-8,2.4-10.4,6.4s-1.6,8,0.8,12l76.8,115.2c2.4,3.2,5.6,4.8,9.6,4.8
	c2.4,0,4.8-0.8,6.4-1.6c5.6-3.2,6.4-10.4,3.2-16l-64.8-97.6h24c34.4,0,62.4-26.4,66.4-59.2h13.6c6.4,0,11.2-4.8,11.2-11.2
	S328.8,203.2,322.4,203.2z"
    />
  </svg>
);

// Custom Healthcare Icon Component
const CustomHealthcareIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 512.003 512.003"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <path
      style={{ fill: "#D8143A" }}
      d="M360.773,20.807c-38.114,0-75.772,14.352-104.769,39.228
	c-0.002-0.002-0.003-0.003-0.005-0.003c-29.001-24.876-66.657-39.225-104.77-39.225C66.429,20.807,0,87.234,0,172.037
	c0,102.506,71.37,165.162,179.402,260.002c9.234,8.107,18.763,16.471,28.57,25.143c0.067,0.059,0.135,0.119,0.203,0.177
	l32.617,28.174c4.367,3.774,9.789,5.66,15.21,5.663c0.003,0,0.005,0,0.008,0c5.424,0,10.847-1.889,15.219-5.663l32.611-28.174
	c0.068-0.059,0.135-0.118,0.203-0.177c64.565-57.104,112.977-100.818,148-143.453c40.907-49.796,59.961-94.82,59.961-141.692
	C512,87.234,445.573,20.807,360.773,20.807z"
    />
    <polygon
      style={{ fill: "#830018" }}
      points="287.037,209.449 287.037,147.373 256,147.373 224.961,147.373 224.961,209.449 
	162.889,209.449 162.889,271.523 224.961,271.523 224.961,333.596 256,333.596 287.037,333.596 287.037,271.523 349.111,271.523 
	349.111,209.449"
    />
  </svg>
);

// Custom Time Icon Component
const CustomTimeIcon = ({ sx, ...props }: any) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: sx?.fontSize || 32,
      height: sx?.fontSize || 32,
      ...sx,
    }}
    {...props}
  >
    <defs>
      <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#667eea", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#764ba2", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#f093fb", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#f5576c", stopOpacity: 1 }} />
      </linearGradient>
      <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: "#ffecd2", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#fcb69f", stopOpacity: 1 }} />
      </radialGradient>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="10"
      fill="url(#centerGradient)"
      stroke="url(#clockGradient)"
      strokeWidth="2"
    />
    <circle cx="12" cy="4" r="1" fill="#4f46e5" />
    <circle cx="18" cy="12" r="1" fill="#06b6d4" />
    <circle cx="12" cy="20" r="1" fill="#10b981" />
    <circle cx="6" cy="12" r="1" fill="#f59e0b" />
    <path
      d="M12 6v6l4 2"
      stroke="url(#handGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2" fill="#ef4444" />
  </svg>
);

// MUI Icons for Header
export const PdfIconMui = <PictureAsPdf />;
export const TextIconMui = <TextFields />;
export const DesignIconMui = <Palette />;
export const DeveloperIconMui = <Code />;
export const MathIconMui = <Calculate />;
export const FinanceIconMui = <AccountBalance />;
export const HealthcareIconMui = <LocalHospital />;
export const TimeIconMui = <Schedule />;

// Icons for Tool Categories (separate from header icons)
export const PdfIcon = <PictureAsPdf />;
export const TextIcon = <TextFields />;
export const DesignIcon = <Palette />;
export const DeveloperIcon = <Code />;
export const MathIcon = <Calculate />;
export const FinanceIcon = <AccountBalance />;
export const HealthcareIcon = <LocalHospital />;
export const TimeIcon = <Schedule />;

// Custom icons specifically for Tool Categories section
export const PdfCategoryIcon = <CustomPdfIcon />;
export const TextCategoryIcon = <CustomTextIcon />;
export const DesignCategoryIcon = <CustomDesignIcon />;
export const DeveloperCategoryIcon = <CustomDeveloperIcon />;
export const MathCategoryIcon = <CustomMathIcon />;
export const FinanceCategoryIcon = <CustomFinanceIcon />;
export const HealthcareCategoryIcon = <CustomHealthcareIcon />;
export const TimeCategoryIcon = <CustomTimeIcon />;

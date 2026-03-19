export interface ColorStop {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  [key: number]: string;
}

export interface SemanticColorTokens {
  [key: string]: unknown;
  background: {
    default: string;
    subtle: string;
    inverse: string;
  };
  surface: {
    default: string;
    raised: string;
    glass: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    onPrimary: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  action: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primaryDisabled: string;
    secondary: string;
    secondaryHover: string;
    secondaryActive: string;
    secondaryDisabled: string;
  };
  feedback: {
    success: { default: string; subtle: string; text: string };
    warning: { default: string; subtle: string; text: string };
    error: { default: string; subtle: string; text: string };
    info: { default: string; subtle: string; text: string };
  };
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: string | number;
}

export interface TypographyTokens {
  display: {
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
  };
  heading: {
    '2xl': TypographyToken;
    xl: TypographyToken;
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
    xs: TypographyToken;
  };
  body: {
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
  };
  label: {
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
  };
  caption: {
    md: TypographyToken;
    sm: TypographyToken;
  };
}

export interface SpacingTokens {
  [key: string]: string;
}

export interface RadiusTokens {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ElevationLevel {
  shadow: string;
  blur?: string;
  background?: string;
}

export interface ElevationTokens {
  0: ElevationLevel;
  1: ElevationLevel;
  2: ElevationLevel;
  3: ElevationLevel;
  4: ElevationLevel;
  5: ElevationLevel;
  glass0: ElevationLevel;
  glass1: ElevationLevel;
  glass2: ElevationLevel;
  glass3: ElevationLevel;
}

export interface MotionTokens {
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
    bounce: string;
  };
}

export interface ExtendedColor {
  name: string;
  palette: ColorStop;
  semantic: {
    default: string;
    subtle: string;
    text: string;
    border: string;
  };
}

export interface DesignTokens {
  colors: {
    primary: ColorStop;
    secondary: ColorStop;
    tertiary: ColorStop;
    neutral: ColorStop;
    extended: Record<string, ExtendedColor>;
  };
  semanticLight: SemanticColorTokens;
  semanticDark: SemanticColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  elevation: ElevationTokens;
  motion: MotionTokens;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  neutralColor: string;
  fontFamily: string;
  displayWeight: number;
  bodyWeight: number;
  isDarkMode: boolean;
  radiusPersonality: number; // 0-100 slider
  contrastMode: boolean;
}

export interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

// import original module declarations
import 'styled-components';
// Import your Theme type
import { Theme } from '../styles/themes';

// Extend the DefaultTheme interface with your custom Theme properties
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
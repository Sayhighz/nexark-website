// Import fonts using Vite's ?url syntax to get the correct paths
import SukhumvitSetText from './assets/font/SukumvitSet/SukhumvitSet-Text.ttf?url';
import SukhumvitSetMedium from './assets/font/SukumvitSet/SukhumvitSet-Medium.ttf?url';
import SukhumvitSetSemiBold from './assets/font/SukumvitSet/SukhumvitSet-SemiBold.ttf?url';
import SukhumvitSetBold from './assets/font/SukumvitSet/SukhumvitSet-Bold.ttf?url';
import SukhumvitSetLight from './assets/font/SukumvitSet/SukhumvitSet-Light.ttf?url';

import MontserratRegular from './assets/font/Montserrat/Montserrat-Regular.ttf?url';
import MontserratMedium from './assets/font/Montserrat/Montserrat-Medium.ttf?url';
import MontserratSemiBold from './assets/font/Montserrat/Montserrat-SemiBold.ttf?url';
import MontserratBold from './assets/font/Montserrat/Montserrat-Bold.ttf?url';
import MontserratLight from './assets/font/Montserrat/Montserrat-Light.ttf?url';

// Create font face styles
const fontStyles = `
/* SukhumvitSet for Thai */
@font-face {
  font-family: 'SukhumvitSet';
  src: url('${SukhumvitSetText}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SukhumvitSet';
  src: url('${SukhumvitSetMedium}') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SukhumvitSet';
  src: url('${SukhumvitSetSemiBold}') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SukhumvitSet';
  src: url('${SukhumvitSetBold}') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SukhumvitSet';
  src: url('${SukhumvitSetLight}') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

/* Montserrat for English */
@font-face {
  font-family: 'MontserratLocal';
  src: url('${MontserratRegular}') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MontserratLocal';
  src: url('${MontserratMedium}') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MontserratLocal';
  src: url('${MontserratSemiBold}') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MontserratLocal';
  src: url('${MontserratBold}') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MontserratLocal';
  src: url('${MontserratLight}') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
`;

console.log('Loading custom fonts...', {
  SukhumvitSetText,
  MontserratRegular
});

// Inject font styles into document head
const styleElement = document.createElement('style');
styleElement.textContent = fontStyles;
document.head.appendChild(styleElement);

// Test fonts are loaded
setTimeout(() => {
  console.log('Available fonts:', document.fonts);
  document.fonts.ready.then(() => {
    console.log('All fonts loaded!');
    // Force re-render by updating body font
    document.body.style.fontFamily = "'SukhumvitSet', 'MontserratLocal', 'Montserrat', system-ui, sans-serif";
  });
}, 1000);
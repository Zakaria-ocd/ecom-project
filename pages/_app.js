import { wrapper } from '../src/wrapper';

function MyApp({ Component, pageProps }) {
  return (
    <wrapper>
      <Component {...pageProps} />
    </wrapper>
  );
}

export default MyApp;

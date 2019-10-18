/** @jsx jsx */

import { jsx } from '@emotion/core';

import { Container, H1 } from '../primitives';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Meta from '../components/Meta';
import { gridSize } from '../theme';

import ForgotPasswordForm from '../components/auth/forgotPassword';

const ForgotPassword = () => {
  return (
    <>
      <Meta title="Forgot password" />
      <Navbar background="white" />
      <Container width={420} css={{ marginTop: gridSize * 3 }}>
        <H1>Forgot password</H1>
        <ForgotPasswordForm />
      </Container>
      <Footer callToAction={false} />
    </>
  );
};

export default ForgotPassword;

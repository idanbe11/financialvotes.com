import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  FormFeedback
} from 'reactstrap';
// layout for page
// import Auth from 'layouts/Auth.js';
import Guest from 'layouts/Guest';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setError] = useState('');
  const router = useRouter();
  function handleChange(update) {
    setCredentials({ ...credentials, ...update });
  }

  async function handleSubmit(params) {
    const response = await signIn('credentials', {
      redirect: false,
      ...credentials
    });
    if (response.error) {
      setError(response.error);
    } else if (response.ok) {
      router.push('/auth/overview');
    }
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent text-center">
            <h2>Login</h2>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    id="username"
                    value={credentials.username}
                    onChange={(e) => handleChange({ username: e.target.value })}
                    valid={loginError === ''}
                    invalid={loginError !== ''}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => handleChange({ password: e.target.value })}
                    valid={loginError === ''}
                    invalid={loginError !== ''}
                  />
                </InputGroup>
              </FormGroup>
              {loginError !== '' && (
                <div className="text-center pb-3">
                  <span className="text-danger font-weight-700">{loginError}</span>
                </div>
              )}
              {
                <FormFeedback tooltip className="text-danger">
                  {loginError}
                </FormFeedback>
              }
              <div className="custom-control custom-control-alternative custom-checkbox">
                {/* <input
                    className="custom-control-input"
                    id=" rememberMe"
                    type="checkbox"
                    value={state.rememberMe}
                    onChange={handleChange}
                  /> */}
                <label className="custom-control-label" htmlFor=" rememberMe">
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            {/* <a className="text-light" href="#" onClick={(e) => e.preventDefault()}>
              <small>Forgot password?</small>
            </a> */}
          </Col>
          <Col className="text-right" xs="6">
            <a className="text-light" href="/auth/register">
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
}

// Login.layout = Auth;
Login.layout = Guest;

export default Login;

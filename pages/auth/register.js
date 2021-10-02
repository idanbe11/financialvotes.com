import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
  Col
} from 'reactstrap';
// layout for this page
// import Auth from 'layouts/Auth.js';
import Guest from 'layouts/Guest';
import { register } from 'lib/api';

function Register() {
  const [state, update] = useState({
    user: {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      password: '',
      confirmpassword: ''
    },
    validations: {
      email: false,
      login: false,
      password: false,
      confirmpassword: false
    },
    formValidity: false
  });
  const router = useRouter();

  const setState = (updatedState) => {
    update({
      ...state,
      ...updatedState
    });
  };

  const handleChange = (e) => {
    const target = e.target;
    let updatedUser = state.user;
    let updatedValidations = state.validations;
    let validity = true;
    updatedUser[target.id] = target.value;
    if (updatedValidations.hasOwnProperty(target.id)) {
      updatedValidations[target.id] = validateField(target.id, target.value);
    }
    for (const key in state.validations) {
      validity = validity && state.validations[key];
    }
    setState({
      user: updatedUser,
      validations: updatedValidations,
      formValidity: validity
    });
  };

  const validateField = (id, value) => {
    switch (id) {
      case 'email':
        const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return emailTest.test(value);
      case 'password':
        return value.length >= 8;
      case 'confirmpassword':
        return state.user.password === value;
      default:
        return value.trim() !== '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state.formValidity) {
      const user = {
        firstname: state.user.firstName,
        lastname: state.user.lastName,
        email: state.user.email,
        username: state.user.login,
        password: state.user.password,
        confirmed: true,
        role: 'Authenticated'
      };
      // console.log(state, user);
      const response = await register(user);
      // console.log(response);
      if (response.error) {
        console.error(response.error);
      } else if (
        !!response &&
        (response.status === 200 || response.statusText === 'OK')
      ) {
        router.push('/auth/login');
      }
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent text-center">
            <h3>Sign up with FinancialVotes.com now!</h3>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-circle-08" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        type="text"
                        value={state.user.firstName}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-circle-08" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        type="text"
                        value={state.user.lastName}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    placeholder="Email Address"
                    type="email"
                    value={state.user.email}
                    onChange={handleChange}
                  />
                </InputGroup>
                <div className="text-muted font-italic">
                  <small>
                    {state.validations.email ? null : (
                      <span className="text-info font-weight-700">
                        Valid email address is required!
                      </span>
                    )}
                  </small>
                </div>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="login"
                    placeholder="Username"
                    type="text"
                    value={state.user.login}
                    onChange={handleChange}
                  />
                </InputGroup>
                <div className="text-muted font-italic">
                  <small>
                    {state.validations.login ? null : (
                      <span className="text-info font-weight-700">
                        Username is required!
                      </span>
                    )}
                  </small>
                </div>
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={state.user.password}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <div className="text-muted font-italic">
                      <small>
                        Password strength:{' '}
                        {state.validations.password ? (
                          <span className="text-success font-weight-700">strong</span>
                        ) : (
                          <span className="text-danger font-weight-700">weak</span>
                        )}
                      </small>
                    </div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="confirmpassword"
                        placeholder="Confirm Password"
                        type="password"
                        value={state.user.confirmpassword}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <div className="text-muted font-italic">
                      <small>
                        {state.validations.confirmpassword ? (
                          <span className="text-success font-weight-700">
                            Passwords match!
                          </span>
                        ) : (
                          <span className="text-info font-weight-700">
                            Passwords should be matched!
                          </span>
                        )}
                      </small>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

// Register.layout = Auth;
Register.layout = Guest;

export default Register;

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/client';
import NotificationAlert from 'react-notification-alert';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Spinner,
  Form,
  FormGroup,
  Input
} from 'reactstrap';
import Modal from 'components/Elements/Modal';
// layout for this page
import Auth from 'layouts/Auth';

import UserHeader from 'components/Headers/UserHeader';
import { updateUser, fetchUser, changePasswordAPI } from 'lib/api';

const PasswordResetForm = ({
  password,
  newPassword,
  confirmPassword,
  passwordChanegHandler,
  loading
}) => {
  return (
    <Row>
      <div className="col-12 mb-3">
        <p>
          Please enter your current password and new password. You'll be logged out after
          resetting the password.
        </p>
      </div>
      <div className="col-12">
        <FormGroup>
          <label className="form-control-label" htmlFor="input-password">
            Current Password
          </label>
          <Input
            className="form-control-alternative"
            value={password}
            onChange={(e) => {
              passwordChanegHandler('oldPassword', e.target.value);
            }}
            id="input-password"
            placeholder="Current Password"
            disabled={loading}
            type="password"
          />
        </FormGroup>
      </div>
      <div className="col-12">
        <FormGroup>
          <label className="form-control-label" htmlFor="input-new-password">
            New Password
          </label>
          <Input
            className="form-control-alternative"
            value={newPassword}
            onChange={(e) => {
              passwordChanegHandler('password', e.target.value);
            }}
            id="input-new-password"
            placeholder="New Password"
            disabled={loading}
            type="password"
          />
        </FormGroup>
      </div>
      <div className="col-12">
        <FormGroup>
          <label className="form-control-label" htmlFor="input-confirm-password">
            Confirm Password
          </label>
          <Input
            className="form-control-alternative"
            value={confirmPassword}
            onChange={(e) => {
              passwordChanegHandler('passwordConfirmation', e.target.value);
            }}
            id="input-confirm-password"
            placeholder="Confirm Password"
            disabled={loading}
            type="password"
          />
        </FormGroup>
      </div>
    </Row>
  );
};

const MyProfile = (props) => {
  const [session, loading] = useSession();
  const [logo, setLogo] = useState(undefined);
  const [fetched, setFetched] = useState(false);
  const router = useRouter();
  const [formLoading, setLoading] = useState(false);
  const notificationAlertRef = useRef();
  const [changePassword, setChangePassword] = useState(false);
  const [resetPWReqLoading, setResetPWReqLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    data: undefined
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirmation: ''
  });

  useEffect(() => {
    async function getUser() {
      const data = await fetchUser(session.jwt);
      // console.log(data);
      if (!!data && data.confirmed) {
        setUserData({
          email: data.email,
          firstname: !!data.firstname ? data.firstname : '',
          lastname: !!data.lastname ? data.lastname : '',
          data
        });
      }
    }
    if (!fetched) {
      getUser();
    }
  }, [fetched]);

  const handleChange = (update) => {
    setUserData({ ...userData, ...update });
  };

  const resetFields = () => {
    setUserData({
      email: '',
      firstname: '',
      lastname: '',
      data: undefined
    });
    setPasswordData({
      oldPassword: '',
      password: '',
      passwordConfirmation: ''
    });
  };

  const notify = (type, title, content) => {
    let options = {
      place: 'bc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {`${title} `}
          </span>
          <span data-notify="message">{content}</span>
        </div>
      ),
      type: type,
      icon: 'ni ni-bell-55',
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleBasicDetailsUpdateSubmit = async () => {
    const user = userData;
    // console.log(user, session.jwt);
    setLoading(true);
    const res = await updateUser(session.user.id, user, session.jwt);
    // console.log('handleBasicDetailsUpdateSubmit', res);
    if (!!res && !!res.status && res.status === 200) {
      setLoading(false);
      notify('success', 'Success!', 'Your information is updated!');
      setTimeout(() => {
        router.reload(window.location.pathname);
      }, 1000);
    } else {
      setLoading(false);
      notify('danger', 'Error!', 'Invalid request! Please double check the details.');
      resetFields();
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!!session) {
      setResetPWReqLoading(true);
      const res = await changePasswordAPI(session.jwt, passwordData);
      // console.log(res);
      if (typeof res === 'object' && !!res.data && !!res.status && res.status === 200) {
        setResetPWReqLoading(false);
        notify('success', 'Your information is updated!');
        setChangePassword(!changePassword);
        signOut();
      } else if (typeof res === 'object' && Array.isArray(res)) {
        setResetPWReqLoading(false);
        notify('danger', 'Error!', res[0]['messages'][0]['message']);
        resetFields();
      } else {
        setResetPWReqLoading(false);
        notify('danger', 'Error!', 'Please try again later.');
        resetFields();
      }
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container className="mt--7" fluid>
        <Modal
          title={'Reset Password'}
          content={
            <PasswordResetForm
              password={passwordData.oldPassword}
              newPassword={passwordData.password}
              confirmPassword={passwordData.passwordConfirmation}
              passwordChanegHandler={(field, value) => {
                setPasswordData({
                  ...passwordData,
                  [field]: value
                });
              }}
              loading={resetPWReqLoading}
            />
          }
          action={handleResetPasswordSubmit}
          actionText="Confirm"
          show={changePassword}
          toggle={() => setChangePassword(!changePassword)}
          loading={resetPWReqLoading}
          loaderComponent={
            <div className="container align-items-center mb-5">
              <Row className="m-5 p-5">
                <Col className="text-center">
                  Please wait...
                  <Spinner className="mx-3" size="sm" color="info" />
                </Col>
              </Row>
            </div>
          }
        />
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center text-center mt-3">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      {!loading &&
                      !!session &&
                      !!session.user &&
                      !!session.user.avatar ? (
                        <img
                          className="rounded-cricle"
                          alt="..."
                          src={session.user.avatar.url}
                        />
                      ) : (
                        <i
                          className="ni ni-circle-08 m-auto rounded-cricle"
                          style={{ fontSize: '5rem', top: '1rem' }}
                        />
                      )}
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-3">
                      {!!userData.data && Array.isArray(userData.data.invested_coins) && (
                        <div>
                          <span className="heading">
                            {userData.data.invested_coins.length}
                          </span>
                          <span className="description">Submitted Coins</span>
                        </div>
                      )}
                      {/* <div>
                        <span className="heading">10</span>
                        <span className="description">Votes</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Promos</span>
                      </div> */}
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {`${userData.firstname} ${userData.lastname} (${
                      !loading && !!session && !!session.user && session.user.username
                    })`}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {!loading && !!session && !!session.user && session.user.email}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">Information</h6>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-username">
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={
                              !loading &&
                              !!session &&
                              !!session.user &&
                              session.user.username
                            }
                            id="input-username"
                            placeholder="Username"
                            disabled
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userData.email}
                            onChange={(e) => handleChange({ email: e.target.value })}
                            id="input-email"
                            placeholder="jesse@example.com"
                            disabled={formLoading}
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userData.firstname}
                            onChange={(e) => handleChange({ firstname: e.target.value })}
                            id="input-first-name"
                            placeholder="First name"
                            disabled={formLoading}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-last-name">
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={userData.lastname}
                            onChange={(e) => handleChange({ lastname: e.target.value })}
                            id="input-last-name"
                            placeholder="Last name"
                            disabled={formLoading}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="text-left" xs="4">
                        <Button
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            handleBasicDetailsUpdateSubmit();
                          }}
                          disabled={formLoading}
                          size="md"
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
                <Form className="mt-5">
                  <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">Security</h6>
                    <Row>
                      <Col className="text-left" xs="4">
                        <Button
                          color="warning"
                          onClick={(e) => {
                            e.preventDefault();
                            setChangePassword(!changePassword);
                          }}
                          disabled={resetPWReqLoading}
                          size="md"
                        >
                          Change Password
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

MyProfile.layout = Auth;
MyProfile.protected = true;

export default MyProfile;

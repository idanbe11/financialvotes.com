import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
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
  Form,
  FormGroup,
  Input
} from 'reactstrap';
// layout for this page
import Auth from 'layouts/Auth';

import UserHeader from 'components/Headers/UserHeader';
import { updateUser, fetchUser } from 'lib/api';

const MyProfile = (props) => {
  const [session, loading] = useSession();
  const [logo, setLogo] = useState(undefined);
  const [fetched, setFetched] = useState(false);
  const router = useRouter();
  const [formLoading, setLoading] = useState(false);
  const notificationAlertRef = useRef();
  const [userData, setUserData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    data: undefined
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

  const handleSubmit = async () => {
    const user = userData;
    // console.log(user, session.jwt);
    setLoading(true);
    const res = await updateUser(session.user.id, user, session.jwt);
    // console.log('handleSubmit', res);
    if (!!res && !!res.status && res.status === 200) {
      setLoading(false);
      notify('success', 'Success!', 'Your information is updated!');
      setTimeout(() => {
        router.push('/auth/overview');
      }, 500);
    } else {
      setLoading(false);
      notify('danger', 'Error!', 'Invalid request! Please double check the details.');
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
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">
                      Update your information
                    </h6>
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
                            handleSubmit();
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

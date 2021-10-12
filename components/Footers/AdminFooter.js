/*eslint-disable*/
import React from 'react';
import Link from 'next/link';

// reactstrap components
import { Container, Row, Col, Nav, NavItem } from 'reactstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="12">
            <div className="copyright text-center text-info">
              <Nav className="nav-footer justify-content-center">
                <NavItem>
                  <a
                    href="https://twitter.com/financialvotes"
                    className="nav-link-icon nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-transparent ">
                      <i className="fab fa-twitter" style={{ fontSize: '1.25rem' }} />
                    </div>
                  </a>
                </NavItem>
                <NavItem>
                  <a
                    href="https://t.me/Financialvotes"
                    className="nav-link-icon nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-transparent ">
                      <i
                        className="fab fa-telegram-plane"
                        style={{ fontSize: '1.25rem' }}
                      />
                    </div>
                  </a>
                </NavItem>
              </Nav>
            </div>
          </Col>
          <Col xl="6">
            <Nav className="nav-footer justify-content-center justify-content-xl-end">
              <NavItem>
                <Link href="/contact">
                  <a className="nav-link">Contact Us</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/auth/orders/new?type=advert">
                  <a className="nav-link">Advertise</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/news">
                  <a className="nav-link">News</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/terms-and-conditions">
                  <a className="nav-link">T{`&`}C</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/privacy-policy">
                  <a className="nav-link">Privacy Policy</a>
                </Link>
              </NavItem>
            </Nav>
          </Col>
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              © {new Date().getFullYear()}{' '}
              <a className="font-weight-bold text-success ml-1" href="#">
                FinancialVotes
              </a>
            </div>
          </Col>
          {/* <Col xl="12">
            <div className="copyright text-center text-xl-right text-info">
              <small>
                Designed with ❤ by
                <a
                  className="font-weight-bold ml-1"
                  href="https://foxploit.tech?ref=template-auth-footer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TEAM
                  <span className="text-info">FOXPLOIT</span>
                </a>
              </small>
            </div>
          </Col> */}
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

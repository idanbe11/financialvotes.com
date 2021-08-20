import React from 'react';
import Link from 'next/link';
import { Button, Card, CardBody } from 'reactstrap';

const FeatureCard = ({ title, description, link }) => {
  return (
    <div className="accordion my-3 col-md-6 col-12" id="accordionExample">
      <Card className="shadow-sm">
        <CardBody className="m-2">
          {!!title && <h3>{title}</h3>}
          {!!description && <p className="text-muted mt-3">{description}</p>}
          {!!link && (
            <span className="text-muted justify-content-center mt-1">
              {link.url.startsWith('/') ? (
                <Link href={link.url}>
                  <Button
                    className="btn-icon mt-2"
                    color="success"
                    type="button"
                    size="md"
                  >
                    <span className="btn-inner--text">{link.text}</span>
                  </Button>
                </Link>
              ) : (
                <a href={link.url} target="_blank" rel="noreferrer noopener">
                  <Button
                    className="btn-icon mt-2"
                    color="primary"
                    type="button"
                    size="md"
                  >
                    <span className="btn-inner--text">{link.text}</span>
                  </Button>
                </a>
              )}
            </span>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default FeatureCard;

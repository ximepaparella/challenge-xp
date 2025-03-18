import React, { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Card subcomponents
export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={`${styles.cardHeader} ${className || ''}`} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...rest
}) => (
  <h2 className={`${styles.cardTitle} ${className || ''}`} {...rest}>
    {children}
  </h2>
);

export const CardBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={`${styles.cardBody} ${className || ''}`} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={`${styles.cardFooter} ${className || ''}`} {...rest}>
    {children}
  </div>
);

// Define the Card component with its subcomponents
interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

const Card: CardComponent = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...rest
}) => {
  const cardClasses = [
    styles.card,
    styles[`variant-${variant}`],
    styles[`padding-${padding}`],
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
};

// Attach subcomponents to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card; 
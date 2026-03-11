import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card py-4 text-center">
      <p className="text-sm text-muted-foreground">
        Developed by{' '}
        <a
          href="https://facebook.com/mdashikahmed02"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          Md Ashik Ahmed
        </a>
      </p>
    </footer>
  );
};

export default Footer;

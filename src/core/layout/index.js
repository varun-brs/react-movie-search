import React from "react";

export const Layout = (props) => {
  const { children } = props;

  return (
    <>
      <main role="main" className="container pt-5">
        {children}
      </main>
    </>
  );
};

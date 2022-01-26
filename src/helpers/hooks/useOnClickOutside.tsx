import React, { ReactNode } from "react";

const Option: React.FC<{
  children: ReactNode | ReactNode[];
  value: string;
}> = ({ children, value }) => {
  return <li className="select-option">{children}</li>;
};

export default Option;

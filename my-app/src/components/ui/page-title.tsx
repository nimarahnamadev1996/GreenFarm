import React from "react";

function PageTitle({ title }: { title: string }) {
  return <h1 className="text-md md:text-xl font-bold text-primary">
    {title}
  </h1>;
}

export default PageTitle;